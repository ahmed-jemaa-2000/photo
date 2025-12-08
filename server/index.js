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


// Connect to MongoDB
db.connectDB();


const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

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

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Serve static assets for models, legs, and backgrounds
app.use('/api/assets/models', express.static(path.join(__dirname, 'assets/models')));
app.use('/api/assets/legs', express.static(path.join(__dirname, 'assets/legs')));
app.use('/api/assets/backgrounds', express.static(path.join(__dirname, 'assets/background')));

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
    });
  } catch (error) {
    console.error('Error loading config:', error);
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Apply stricter rate limit to generation endpoints
app.post('/api/generate', generateLimiter, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'modelReference', maxCount: 1 }
]), async (req, res) => {
  const imagePath = req.files?.image?.[0]?.path;
  const modelReferencePath = req.files?.modelReference?.[0]?.path;

  try {
    if (!imagePath) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

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

    const { prompt, gender, modelPersona, modelId, shoeModelId, category, backgroundPrompt, shoeCameraAngle, shoeLighting, imageStyle } = req.body;

    console.log('Received image:', imagePath);
    console.log('Prompt:', prompt);
    console.log('Model ID:', modelId);
    console.log('Shoe Model ID:', shoeModelId);
    console.log('Category:', category);
    console.log('Image Style:', imageStyle || 'ecommerce_clean (default)');

    // Parse modelPersona if it's a JSON string
    let parsedPersona = null;
    if (modelPersona) {
      try {
        parsedPersona = typeof modelPersona === 'string' ? JSON.parse(modelPersona) : modelPersona;
      } catch (e) {
        console.warn('Failed to parse modelPersona:', e);
      }
    }

    // Resolve model reference path from modelId or shoeModelId if provided
    let resolvedModelPath = modelReferencePath;

    // Handle shoe category with shoe model selection
    if (category === 'shoes' && shoeModelId && !resolvedModelPath) {
      const { SHOE_MODELS } = require('./config/botConfig');
      const selectedShoeModel = SHOE_MODELS.find(m => m.id === shoeModelId);
      if (selectedShoeModel && fs.existsSync(selectedShoeModel.path)) {
        resolvedModelPath = selectedShoeModel.path;
        console.log('Using shoe model reference:', selectedShoeModel.name.en, '(' + resolvedModelPath + ')');
      }
    }
    // Handle regular clothes category with full model selection
    else if (modelId && !resolvedModelPath) {
      const { MODELS } = require('./config/botConfig');
      const selectedModel = MODELS.find(m => m.id === modelId);
      if (selectedModel && fs.existsSync(selectedModel.path)) {
        resolvedModelPath = selectedModel.path;
        console.log('Using model reference:', selectedModel.name.en, '(' + resolvedModelPath + ')');
      }
    }

    const result = await geminiService.generateImage(imagePath, prompt, {
      gender: gender || parsedPersona?.gender || undefined,
      modelPersona: parsedPersona,
      modelReferencePath: resolvedModelPath,
      category,
      shoeCameraAngle,
      shoeLighting,
      imageStyle: imageStyle || 'ecommerce_clean',
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


    res.json({
      imageUrl: finalImageUrl,
      downloadUrl: finalDownloadUrl,
      meta: result.meta,
      prompt,
      category,
      modelId: modelId || null,
    });

  } catch (error) {
    console.error('Error generating image:', error?.response?.data || error.message);
    res.status(500).json({ error: error?.message || 'Failed to generate image' });
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

  try {
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

    res.json({
      videoUrl: result.videoUrl,
      downloadUrl: result.downloadUrl,
      meta: result.meta,
    });
  } catch (error) {
    console.error('Error generating video:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
  }
});

// ============================================
// DOWNLOAD PROXY ENDPOINT
// ============================================

/**
 * Download proxy - Fetches external image and streams to client
 * Solves CORS issues with AI-generated image downloads
 */
app.get('/api/download-image', async (req, res) => {
  const { url, quality = 'original', filename = 'generated-image' } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // const axios = require('axios'); // Moved to top

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

    // Sanitize filename
    const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '_');

    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.${extension}"`);
    res.setHeader('Content-Length', response.data.length);
    res.setHeader('Cache-Control', 'no-cache');

    // Send the image data
    res.send(response.data);

    console.log(`Download proxy: Served ${safeFilename}.${extension} (${(response.data.length / 1024).toFixed(1)}KB)`);
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

