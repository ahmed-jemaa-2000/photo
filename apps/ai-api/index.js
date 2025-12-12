const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const fileType = require('file-type');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./db/database');
const geminiService = require('./services/geminiService');
const telegramBot = require('./services/telegramBot');
const axios = require('axios'); // Required for local saving

const creditService = require('./services/creditService');
const generationHistoryService = require('./services/generationHistoryService');
const adCreativeService = require('./services/adCreativeService');

// Connect to MongoDB
db.connectDB();


const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Trust proxy for production (nginx reverse proxy)
// This tells Express to trust X-Forwarded-For headers from nginx
if (!isDev) {
  app.set('trust proxy', 1);
}

// ============================================
// SECURITY & PERFORMANCE MIDDLEWARE
// ============================================

// Helmet: Security headers (CSP, HSTS, etc.)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving assets
}));

// Compression: Gzip responses (50-70% smaller)
app.use(compression());

// Request logging: Morgan (only in development or with LOG_REQUESTS=true)
if (isDev || process.env.LOG_REQUESTS === 'true') {
  app.use(morgan('dev'));
}

// Rate limiting: Prevent DDoS and abuse
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Max 30 requests per minute per IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute  
  max: 5, // Max 5 generation requests per minute
  message: { error: 'Generation rate limit exceeded. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS: allow only configured origins (or all if none set)
const corsOriginsRaw = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const corsOrigins = corsOriginsRaw.includes('*') ? ['*'] : corsOriginsRaw;

const isOriginAllowed = (origin) => {
  if (!origin) return true; // non-browser or same-origin
  if (corsOrigins.length === 0) return true; // allow all if none configured
  if (corsOrigins[0] === '*') return true; // wildcard allow
  return corsOrigins.includes(origin);
};

// CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = isOriginAllowed(origin);

  if (allowed) {
    res.header('Access-Control-Allow-Origin', corsOrigins[0] === '*' ? '*' : origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(allowed ? 204 : 403);
  }

  next();
});

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Extract auth token from cookies or Authorization header
app.use(creditService.extractToken);

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// ============================================
// CREDITS ENDPOINT
// ============================================

// Get current user's credits
app.get('/api/credits', creditService.requireAuth, async (req, res) => {
  try {
    const { balance } = await creditService.getCredits(req.authToken);
    res.json({
      balance,
      costs: creditService.CREDIT_COSTS,
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

// Serve static assets for models, legs, and backgrounds with caching
const staticCacheOptions = {
  maxAge: '7d', // Cache for 7 days
  immutable: true, // Assets don't change
  etag: true,
  lastModified: true,
};
app.use('/api/assets/models', express.static(path.join(__dirname, 'assets/models'), staticCacheOptions));
app.use('/api/assets/legs', express.static(path.join(__dirname, 'assets/legs'), staticCacheOptions));
app.use('/api/assets/backgrounds', express.static(path.join(__dirname, 'assets/background'), staticCacheOptions));

// Health check (no rate limit)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const fileFilter = (req, file, cb) => {
  // Check MIME type first (fast)
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 2 // Max 2 files (image + modelReference)
  }
});

/**
 * Helper to download and save image locally
 * Returns the local URL path (e.g., '/uploads/file.png')
 */
const downloadAndSaveImage = async (url) => {
  try {
    if (!url) return null;

    console.log(`[Local Save] Downloading from: ${url}`);
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      timeout: 30000
    });

    const buffer = Buffer.from(response.data);

    // Determine extension
    const contentType = response.headers['content-type'];
    let ext = 'png';
    if (contentType) {
      if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
      else if (contentType.includes('webp')) ext = 'webp';
    }

    const filename = `gen-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const uploadDir = path.join(__dirname, 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    console.log(`[Local Save] Saved to: ${filepath}`);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('[Local Save] Failed:', error.message);
    return null; // Return null to fall back to original URL
  }
};


// Routes
// Config endpoint - Share botConfig data with web client
app.get('/api/config', (req, res) => {
  try {
    const {
      MODELS, SHOE_MODELS, BACKGROUNDS, POSE_PROMPTS, SHOE_POSE_PROMPTS,
      SHOE_CAMERA_ANGLES, SHOE_LIGHTING_STYLES,
      BAG_STYLES, BAG_DISPLAY_MODES, BAG_MODELS, BAG_CAMERA_ANGLES, BAG_LIGHTING_OPTIONS,
      ACCESSORY_TYPES, ACCESSORY_PLACEMENTS, ACCESSORY_SHOT_TYPES, ACCESSORY_LIGHTING_OPTIONS
    } = require('./config/botConfig');

    // Transform model paths to web URLs
    const modelsWithUrls = MODELS.map(model => ({
      ...model,
      previewUrl: `/api/assets/models/${path.basename(model.path)}`,
      path: undefined
    }));

    // Transform shoe model paths to web URLs
    const shoeModelsWithUrls = SHOE_MODELS.map(shoeModel => ({
      ...shoeModel,
      previewUrl: `/api/assets/legs/${path.basename(shoeModel.path)}`,
      path: undefined
    }));

    // Transform background paths to web URLs
    const backgroundsWithUrls = BACKGROUNDS.map(bg => ({
      ...bg,
      previewUrl: `/api/assets/backgrounds/${path.basename(bg.path)}`,
      path: undefined
    }));

    // Transform bag model paths to web URLs
    const bagModelsWithUrls = BAG_MODELS.map(model => ({
      ...model,
      previewUrl: `/api/assets/models/${path.basename(model.path)}`,
      path: undefined
    }));

    res.json({
      // Clothes configs
      models: modelsWithUrls,
      posePrompts: POSE_PROMPTS,
      backgrounds: backgroundsWithUrls,
      // Shoes configs
      shoeModels: shoeModelsWithUrls,
      shoePosePrompts: SHOE_POSE_PROMPTS,
      shoeCameraAngles: SHOE_CAMERA_ANGLES,
      shoeLightingStyles: SHOE_LIGHTING_STYLES,
      // Bags configs (enhanced)
      bagStyles: BAG_STYLES,
      bagDisplayModes: BAG_DISPLAY_MODES,
      bagModels: bagModelsWithUrls,
      bagCameraAngles: BAG_CAMERA_ANGLES,
      bagLightingOptions: BAG_LIGHTING_OPTIONS,
      // Accessories configs (enhanced)
      accessoryTypes: ACCESSORY_TYPES,
      accessoryPlacements: ACCESSORY_PLACEMENTS,
      accessoryShotTypes: ACCESSORY_SHOT_TYPES,
      accessoryLightingOptions: ACCESSORY_LIGHTING_OPTIONS,
      // Ad Creative configs (universal branding generator)
      adCreativePresets: adCreativeService.getAdCreativePresets(),
    });
  } catch (error) {
    console.error('Error loading config:', error);
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Apply stricter rate limit to generation endpoints
// Note: upload.fields must come before requireAuth for multipart form token extraction
app.post('/api/generate', generateLimiter, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'modelReference', maxCount: 1 }
]), (req, res, next) => {
  // Check for auth token in body (for multipart forms where header wasn't set)
  if (!req.authToken && req.body?.authToken) {
    req.authToken = req.body.authToken;
  }
  next();
}, creditService.requireAuth, creditService.requireCredits('photo'), async (req, res) => {
  const imagePath = req.files?.image?.[0]?.path;
  const modelReferencePath = req.files?.modelReference?.[0]?.path;

  // User is guaranteed to be authenticated and have credits due to middleware
  const userAuthenticated = true;
  const authToken = req.authToken;

  try {
    if (!imagePath) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Credits already checked by middleware

    // Validate file magic bytes
    try {
      if (imagePath) {
        const type = await fileType.fromFile(imagePath);
        const allowedMagic = ['image/jpeg', 'image/png', 'image/webp'];

        if (!type || !allowedMagic.includes(type.mime)) {
          // Clean up and reject
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
          if (modelReferencePath && fs.existsSync(modelReferencePath)) fs.unlinkSync(modelReferencePath);

          return res.status(400).json({
            error: 'Invalid image file. File appears to be corrupted or not a valid image.'
          });
        }
      }
    } catch (valErr) {
      console.error('Validation error:', valErr);
      // Continue if validation fails (fallback)
    }

    const { prompt, gender, modelPersona, modelId, shoeModelId, category, backgroundPrompt, shoeCameraAngle, shoeLighting, imageStyle, colorHex, colorName, manualColorHex, colorPalette } = req.body;

    console.log('Received image:', imagePath);
    console.log('Prompt:', prompt);
    console.log('Model ID:', modelId);
    console.log('Shoe Model ID:', shoeModelId);
    console.log('Category:', category);
    console.log('Image Style:', imageStyle || 'ecommerce_clean (default)');
    if (colorHex) console.log('Color Hex:', colorHex);
    if (manualColorHex) console.log('Manual Color Override:', manualColorHex);

    // Parse modelPersona if it's a JSON string
    let parsedPersona = null;
    if (modelPersona) {
      try {
        parsedPersona = typeof modelPersona === 'string' ? JSON.parse(modelPersona) : modelPersona;
      } catch (e) {
        console.warn('Failed to parse modelPersona:', e);
      }
    }

    // Parse colorPalette if it's a JSON string
    let parsedColorPalette = null;
    if (colorPalette) {
      try {
        parsedColorPalette = typeof colorPalette === 'string' ? JSON.parse(colorPalette) : colorPalette;
      } catch (e) {
        console.warn('Failed to parse colorPalette:', e);
      }
    }

    // ===== DEBUG LOGGING FOR PM2 =====
    console.log('\n========================================');
    console.log('[Generate API] NEW REQUEST RECEIVED');
    console.log('========================================');
    console.log('[Generate API] Category:', category);
    console.log('[Generate API] Image uploaded:', !!imagePath);
    console.log('[Generate API] Model ID received:', modelId || '(none)');
    console.log('[Generate API] Shoe Model ID received:', shoeModelId || '(none)');
    console.log('[Generate API] Gender:', gender);
    console.log('[Generate API] Image Style:', imageStyle);
    console.log('----------------------------------------');

    // Resolve model reference image (optional) + description from modelId/shoeModelId
    let modelDescription = '';
    let shoeModelDescription = '';
    let resolvedModelPath = modelReferencePath;

    if (resolvedModelPath) {
      console.log('[Generate API] Using uploaded model reference image:', resolvedModelPath);
    }

    // Handle shoe category - get shoe model description
    if (category === 'shoes' && shoeModelId) {
      const { SHOE_MODELS } = require('./config/botConfig');
      const selectedShoeModel = SHOE_MODELS.find(m => m.id === shoeModelId);
      if (selectedShoeModel) {
        shoeModelDescription = selectedShoeModel.description;
        if (!resolvedModelPath && selectedShoeModel.path && fs.existsSync(selectedShoeModel.path)) {
          resolvedModelPath = selectedShoeModel.path;
          console.log('[Generate API] Using shoe model reference image:', selectedShoeModel.path);
        }
        console.log('[Generate API] ✅ Found shoe model:', selectedShoeModel.name.en);
        console.log('[Generate API] 📝 Description:', shoeModelDescription.substring(0, 100) + '...');
      } else {
        console.log('[Generate API] ⚠️ Shoe model not found for ID:', shoeModelId);
      }
    }
    // Handle clothes/bags/accessories category - get model description
    else if (modelId) {
      const { MODELS, BAG_MODELS } = require('./config/botConfig');
      // Check regular models first
      let selectedModel = MODELS.find(m => m.id === modelId);
      // Then check bag models
      if (!selectedModel) {
        selectedModel = BAG_MODELS.find(m => m.id === modelId);
      }
      if (selectedModel) {
        modelDescription = selectedModel.description;
        if (!resolvedModelPath && selectedModel.path && fs.existsSync(selectedModel.path)) {
          resolvedModelPath = selectedModel.path;
          console.log('[Generate API] Using model reference image:', selectedModel.path);
        }
        console.log('[Generate API] ✅ Found model:', selectedModel.name.en);
        console.log('[Generate API] 📝 Description:', modelDescription.substring(0, 100) + '...');
      } else {
        console.log('[Generate API] ⚠️ Model not found for ID:', modelId);
      }
    } else {
      console.log('[Generate API] ℹ️ No model ID provided - using default prompts');
    }

    console.log('[Generate API] 🚀 Calling geminiService.generateImage...');
    console.log('[Generate API] Options:', JSON.stringify({
      category,
      hasModelReference: !!resolvedModelPath,
      hasModelDescription: !!modelDescription,
      hasShoeModelDescription: !!shoeModelDescription,
      imageStyle: imageStyle || 'ecommerce_clean',
    }));
    console.log('========================================\n');

    const result = await geminiService.generateImage(imagePath, prompt, {
      gender: gender || parsedPersona?.gender || undefined,
      modelPersona: parsedPersona,
      modelDescription,
      shoeModelDescription,
      modelReferencePath: resolvedModelPath,
      category,
      shoeCameraAngle,
      shoeLighting,
      imageStyle: imageStyle || 'ecommerce_clean',
      // Color accuracy data
      colorHex: colorHex || null,
      colorName: colorName || null,
      manualColorHex: manualColorHex || null,
      colorPalette: parsedColorPalette || null,
    });

    // AUTO-SAVE: Download the generated image to local server
    // This fixes 403 errors and prevents link expiration
    let finalImageUrl = result.imageUrl;
    let finalDownloadUrl = result.downloadUrl;

    const localPath = await downloadAndSaveImage(result.imageUrl);
    if (localPath) {
      finalImageUrl = localPath;
      finalDownloadUrl = localPath; // Use local path for download too
      console.log('[Generate API] Updated to local path:', localPath);
    }


    // Deduct credits after successful generation
    let creditInfo = null;
    if (userAuthenticated && authToken) {
      const deductResult = await creditService.deductCredits(authToken, 'photo', {
        category,
        generatedImageUrl: result.imageUrl,
      });
      if (deductResult.success) {
        creditInfo = {
          deducted: deductResult.deducted,
          remaining: deductResult.newBalance,
        };
        console.log(`Credits deducted: ${deductResult.deducted}, remaining: ${deductResult.newBalance}`);
      }

      // Save to generation history
      const productId = req.body.productId ? parseInt(req.body.productId, 10) : null;
      generationHistoryService.saveGeneration(authToken, {
        imageUrl: finalImageUrl,
        downloadUrl: finalDownloadUrl,
        category,

        prompt,
        productId,
        metadata: {
          modelId: modelId || null,
          imageStyle: imageStyle || 'ecommerce_clean',
        },
      }).catch(err => console.error('Failed to save generation history:', err.message));
    }

    const finalResult = {
      imageUrl: finalImageUrl,
      downloadUrl: finalDownloadUrl,
      meta: result.meta,
      prompt,
      category,
      modelId: modelId || null,
      credits: creditInfo,
    };

    // Save to generation history
    // We update the history service call to use the FINAL (local) URLs if available
    if (userAuthenticated && authToken) {
      // ... (existing history code) ...
    }

    res.json(finalResult);

  } catch (error) {
    // Structured error logging with context
    // Note: Some variables may not be defined if error happened before body parsing
    const errorContext = {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || `gen-${Date.now()}`,
      userId: req.user?.id || 'unknown',
      userEmail: req.user?.email || 'unknown',
      category: req.body?.category || 'unknown',
      modelId: req.body?.modelId || null,
      imageStyle: req.body?.imageStyle || 'unknown',
      errorMessage: error?.message || 'Unknown error',
      errorStack: isDev ? error?.stack : undefined,
      responseData: error?.response?.data || null,
    };

    console.error('[GENERATION_ERROR]', JSON.stringify(errorContext, null, 2));

    // Provide user-friendly error messages
    let clientMessage = 'Failed to generate image. Please try again.';
    if (error.message?.includes('rate limit')) {
      clientMessage = 'AI service rate limit reached. Please wait a minute and try again.';
    } else if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
      clientMessage = 'Generation took too long. Please try with a simpler prompt or smaller image.';
    } else if (error.message?.includes('invalid') || error.message?.includes('Invalid')) {
      clientMessage = 'Invalid input provided. Please check your image and settings.';
    } else if (error.message?.includes('credit')) {
      clientMessage = error.message; // Pass through credit-related errors
    }

    res.status(500).json({
      error: clientMessage,
      code: 'GENERATION_FAILED',
      requestId: errorContext.requestId, // For support reference
    });
  } finally {
    // Clean up uploaded files
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    if (modelReferencePath && fs.existsSync(modelReferencePath)) {
      fs.unlinkSync(modelReferencePath);
    }
  }
});

app.post('/api/generate-video', async (req, res) => {
  const { imageUrl, prompt, category, motionStyle } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  // Track if user is authenticated (for credit deduction)
  let userAuthenticated = false;

  try {
    // Check credits if user is authenticated (video costs 3 credits)
    if (req.authToken) {
      const { valid } = await creditService.validateToken(req.authToken);
      if (valid) {
        userAuthenticated = true;
        const creditCheck = await creditService.checkCredits(req.authToken, 'video');

        if (!creditCheck.allowed) {
          return res.status(402).json({
            error: 'Insufficient credits for video generation',
            code: 'INSUFFICIENT_CREDITS',
            balance: creditCheck.balance,
            required: creditCheck.cost,
          });
        }
      }
    }

    console.log('Starting video generation for image:', imageUrl);
    console.log('Category:', category || 'clothes');
    console.log('Motion Style:', motionStyle || 'auto');

    const result = await geminiService.generateVideoFromImage(
      imageUrl,
      prompt || 'Fashion model moving naturally',
      {
        category: category || 'clothes',
        motionStyle: motionStyle || null, // null = auto-select based on category
      }
    );

    // Deduct credits after successful video generation
    let creditInfo = null;
    if (userAuthenticated && req.authToken) {
      const deductResult = await creditService.deductCredits(req.authToken, 'video', {
        category,
        generatedVideoUrl: result.videoUrl,
      });
      if (deductResult.success) {
        creditInfo = {
          deducted: deductResult.deducted,
          remaining: deductResult.newBalance,
        };
        console.log(`Video credits deducted: ${deductResult.deducted}, remaining: ${deductResult.newBalance}`);
      }
    }

    res.json({
      videoUrl: result.videoUrl,
      downloadUrl: result.downloadUrl,
      meta: result.meta,
      credits: creditInfo,
    });
  } catch (error) {
    console.error('Error generating video:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
  }
});

// ============================================
// AD CREATIVE GENERATION ENDPOINT (Enhanced)
// ============================================

/**
 * Professional Marketing Poster Generator
 * Generates Freepik/Envato quality marketing visuals
 * 
 * Enhanced Options:
 * - Design Templates (8 styles: fitness_energy, modern_gradient, etc.)
 * - Composition Styles (7 layouts)
 * - Typography Styles (6 font aesthetics)
 * - Decorative Elements (multi-select: 3D shapes, grunge, neon, etc.)
 * - Color Schemes (10 presets + custom)
 * - Output Formats (8 platform-specific sizes)
 */
app.post('/api/generate-ad-creative', generateLimiter, upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'referenceImage', maxCount: 1 }
]), (req, res, next) => {
  // Check for auth token in body (for multipart forms)
  if (!req.authToken && req.body?.authToken) {
    req.authToken = req.body.authToken;
  }
  next();
}, creditService.requireAuth, creditService.requireCredits('adCreative'), async (req, res) => {
  const productImagePath = req.files?.productImage?.[0]?.path;
  const referenceImagePath = req.files?.referenceImage?.[0]?.path;
  const authToken = req.authToken;

  try {
    if (!productImagePath) {
      return res.status(400).json({ error: 'Product image is required' });
    }

    // Validate file magic bytes
    try {
      const type = await fileType.fromFile(productImagePath);
      const allowedMagic = ['image/jpeg', 'image/png', 'image/webp'];

      if (!type || !allowedMagic.includes(type.mime)) {
        if (fs.existsSync(productImagePath)) fs.unlinkSync(productImagePath);
        if (referenceImagePath && fs.existsSync(referenceImagePath)) fs.unlinkSync(referenceImagePath);

        return res.status(400).json({
          error: 'Invalid image file. File appears to be corrupted or not a valid image.'
        });
      }
    } catch (valErr) {
      console.error('[Ad Creative] Validation error:', valErr);
    }

    // Extract all options from request body
    const {
      // Required
      productCategory = 'other',
      outputFormat = 'instagram_feed',

      // Design choices
      designTemplate = 'modern_gradient',
      compositionStyle = 'subject_center',
      typographyStyle = 'modern_clean',

      // Colors - can be scheme ID or custom colors JSON
      colorScheme = 'royal_blue',
      customColors,

      // Decorative elements (comma-separated string or JSON array)
      decorativeElements,

      // Text content zones
      textContent,

      // Additional options
      targetAudience,
      customInstructions,
    } = req.body;

    // Parse JSON fields if needed (from multipart form)
    let parsedCustomColors = null;
    if (customColors) {
      try {
        parsedCustomColors = typeof customColors === 'string' ? JSON.parse(customColors) : customColors;
      } catch (e) {
        console.warn('[Ad Creative] Failed to parse customColors:', e);
      }
    }

    let parsedTextContent = null;
    if (textContent) {
      try {
        parsedTextContent = typeof textContent === 'string' ? JSON.parse(textContent) : textContent;
      } catch (e) {
        console.warn('[Ad Creative] Failed to parse textContent:', e);
      }
    }

    let parsedDecorativeElements = [];
    if (decorativeElements) {
      try {
        if (typeof decorativeElements === 'string') {
          // Try JSON first, then comma-separated
          try {
            parsedDecorativeElements = JSON.parse(decorativeElements);
          } catch {
            parsedDecorativeElements = decorativeElements.split(',').map(s => s.trim()).filter(Boolean);
          }
        } else if (Array.isArray(decorativeElements)) {
          parsedDecorativeElements = decorativeElements;
        }
      } catch (e) {
        console.warn('[Ad Creative] Failed to parse decorativeElements:', e);
      }
    }

    // Validate options
    const validation = adCreativeService.validateAdCreativeOptions({
      productCategory,
      outputFormat,
      designTemplate,
      compositionStyle,
      decorativeElements: parsedDecorativeElements,
      customColors: parsedCustomColors,
    });

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid options provided',
        details: validation.errors
      });
    }

    // PRE-CHECK: Verify user has credits BEFORE expensive generation
    try {
      const creditCheck = await creditService.checkCredits(authToken, 'adCreative');
      if (!creditCheck.success || creditCheck.balance < 1) {
        console.log('[Ad Creative] Credit pre-check failed: Insufficient credits');
        return res.status(402).json({
          error: 'Insufficient credits',
          message: 'You need at least 1 credit to generate an ad creative',
          credits: { balance: creditCheck.balance || 0 }
        });
      }
      console.log(`[Ad Creative] Credit pre-check passed: ${creditCheck.balance} credits available`);
    } catch (creditErr) {
      console.warn('[Ad Creative] Credit pre-check failed:', creditErr.message);
      // Continue anyway - credits will be checked again during deduction
    }

    // Build the enhanced prompt
    const promptResult = adCreativeService.buildAdCreativePrompt({
      productCategory,
      outputFormat,
      designTemplate,
      compositionStyle,
      typographyStyle,
      colorScheme,
      customColors: parsedCustomColors,
      decorativeElements: parsedDecorativeElements,
      textContent: parsedTextContent,
      targetAudience,
      customInstructions,
      useReferenceStyle: !!referenceImagePath,
    });

    console.log('\n========================================');
    console.log('[Ad Creative API] NEW REQUEST (Enhanced)');
    console.log('========================================');
    console.log('[Ad Creative] Product Category:', productCategory);
    console.log('[Ad Creative] Design Template:', designTemplate);
    console.log('[Ad Creative] Composition Style:', compositionStyle);
    console.log('[Ad Creative] Typography Style:', typographyStyle);
    console.log('[Ad Creative] Color Scheme:', colorScheme);
    console.log('[Ad Creative] Decorative Elements:', parsedDecorativeElements);
    console.log('[Ad Creative] Output Format:', outputFormat);
    console.log('[Ad Creative] Aspect Ratio:', promptResult.aspectRatio);
    console.log('[Ad Creative] Has Reference:', !!referenceImagePath);
    console.log('[Ad Creative] Prompt Length:', promptResult.prompt.length, 'chars');
    console.log('========================================\n');

    // Map design template to image style for geminiService
    const imageStyleMap = {
      'fitness_energy': 'tiktok_dynamic',
      'modern_gradient': 'ecommerce_soft',
      'luxury_dark': 'luxury_dark',
      'playful_pop': 'ecommerce_bright',
      'tech_futuristic': 'luxury_dark',
      'organic_natural': 'ecommerce_soft',
      'bold_sale': 'tiktok_dynamic',
      'minimal_elegant': 'ecommerce_clean'
    };

    // Generate the image using geminiService
    const result = await geminiService.generateImage(productImagePath, promptResult.prompt, {
      aspectRatio: promptResult.aspectRatio,
      imageStyle: imageStyleMap[designTemplate] || 'ecommerce_clean',
      referenceImagePaths: referenceImagePath ? [referenceImagePath] : [],
      category: 'adCreative'
    });

    // Save image locally to prevent 403 errors
    let finalImageUrl = result.imageUrl;
    let finalDownloadUrl = result.downloadUrl;

    const localPath = await downloadAndSaveImage(result.imageUrl);
    if (localPath) {
      finalImageUrl = localPath;
      finalDownloadUrl = localPath;
      console.log('[Ad Creative] Saved to local path:', localPath);
    }

    // Deduct credits
    let creditInfo = null;
    const deductResult = await creditService.deductCredits(authToken, 'adCreative', {
      productCategory,
      outputFormat,
      designTemplate,
      generatedImageUrl: finalImageUrl,
    });
    if (deductResult.success) {
      creditInfo = {
        deducted: deductResult.deducted,
        remaining: deductResult.newBalance,
      };
      console.log(`[Ad Creative] Credits deducted: ${deductResult.deducted}, remaining: ${deductResult.newBalance}`);
    }

    // Save to generation history with enhanced metadata
    generationHistoryService.saveGeneration(authToken, {
      imageUrl: finalImageUrl,
      downloadUrl: finalDownloadUrl,
      category: 'adCreative',
      prompt: promptResult.prompt,
      metadata: {
        ...promptResult.metadata,
        dimensions: promptResult.dimensions,
      },
    }).catch(err => console.error('[Ad Creative] Failed to save generation history:', err.message));

    res.json({
      success: true,
      imageUrl: finalImageUrl,
      downloadUrl: finalDownloadUrl,
      format: outputFormat,
      aspectRatio: promptResult.aspectRatio,
      dimensions: promptResult.dimensions,
      meta: result.meta,
      credits: creditInfo,
    });

  } catch (error) {
    console.error('[Ad Creative] Generation error:', error.message);

    let clientMessage = 'Failed to generate ad creative. Please try again.';
    if (error.message?.includes('rate limit')) {
      clientMessage = 'AI service rate limit reached. Please wait a minute and try again.';
    } else if (error.message?.includes('timeout')) {
      clientMessage = 'Generation took too long. Please try with a simpler configuration.';
    }

    res.status(500).json({
      error: clientMessage,
      code: 'AD_CREATIVE_GENERATION_FAILED',
    });
  } finally {
    // Clean up uploaded files
    if (productImagePath && fs.existsSync(productImagePath)) {
      fs.unlinkSync(productImagePath);
    }
    if (referenceImagePath && fs.existsSync(referenceImagePath)) {
      fs.unlinkSync(referenceImagePath);
    }
  }
});

// ============================================
// DOWNLOAD PROXY ENDPOINT
// ============================================

/**
 * Download proxy - Fetches external image and streams to client
 * Solves CORS issues with AI-generated image downloads
 * Also handles local files (starting with /uploads/)
 */
app.get('/api/download-image', async (req, res) => {
  const { url, quality = 'original', filename = 'generated-image' } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Sanitize filename
  const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');

  try {
    // Check if this is a local file path (starts with /uploads/)
    if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
      // Handle local file
      const localPath = path.join(__dirname, url.startsWith('/') ? url : `/${url}`);

      if (!fs.existsSync(localPath)) {
        return res.status(404).json({ error: 'File not found', details: 'The requested image does not exist on the server' });
      }

      // Read the local file
      const fileBuffer = fs.readFileSync(localPath);

      // Determine content type from extension
      const ext = path.extname(localPath).toLowerCase();
      let contentType = 'image/png';
      let extension = 'png';
      if (ext === '.jpg' || ext === '.jpeg') {
        contentType = 'image/jpeg';
        extension = 'jpg';
      } else if (ext === '.webp') {
        contentType = 'image/webp';
        extension = 'webp';
      }

      // Set headers for file download
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.${extension}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');

      // Send the file
      res.send(fileBuffer);
      console.log(`Download proxy (local): Served ${safeFilename}.${extension} (${(fileBuffer.length / 1024).toFixed(1)}KB)`);
      return;
    }

    // Validate that it's a proper URL for remote fetching
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        error: 'Invalid URL',
        details: 'The provided URL is not a valid HTTP/HTTPS URL or local path'
      });
    }

    // Fetch the image from the external URL
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    // Determine content type and extension
    const contentType = response.headers['content-type'] || 'image/png';
    let extension = 'png';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      extension = 'jpg';
    } else if (contentType.includes('webp')) {
      extension = 'webp';
    }

    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.${extension}"`);
    res.setHeader('Content-Length', response.data.length);
    res.setHeader('Cache-Control', 'no-cache');

    // Send the image data
    res.send(response.data);

    console.log(`Download proxy (remote): Served ${safeFilename}.${extension} (${(response.data.length / 1024).toFixed(1)}KB)`);
  } catch (error) {
    console.error('Download proxy error:', error.message);
    res.status(500).json({
      error: 'Failed to download image',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 SERVER STARTED ON PORT ${PORT}`);
  console.log(`✨ Video Generation Endpoint: /api/generate-video`);
  console.log(`📥 Download Proxy Endpoint: /api/download-image`);
  console.log(`=================================================`);
  telegramBot.launch();
});

// Global Error Handlers to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});
