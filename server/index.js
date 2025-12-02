const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./db/database');
const geminiService = require('./services/geminiService');
const telegramBot = require('./services/telegramBot');

// Connect to MongoDB
db.connectDB();


const app = express();
const PORT = process.env.PORT || 3000;

// CORS: allow only configured origins (or all if none set)
const corsOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  }
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve static assets for models and backgrounds
app.use('/api/assets/models', express.static(path.join(__dirname, 'assets/models')));
app.use('/api/assets/backgrounds', express.static(path.join(__dirname, 'assets/background')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Configure Multer for file uploads
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

const upload = multer({ storage: storage });

// Routes
// Config endpoint - Share botConfig data with web client
app.get('/api/config', (req, res) => {
  try {
    const { MODELS, BACKGROUNDS, POSE_PROMPTS, SHOE_POSE_PROMPTS } = require('./config/botConfig');

    // Transform model paths to web URLs
    const modelsWithUrls = MODELS.map(model => ({
      ...model,
      previewUrl: `/api/assets/models/${path.basename(model.path)}`,
      path: undefined // Don't expose server paths to client
    }));

    // Transform background paths to web URLs
    const backgroundsWithUrls = BACKGROUNDS.map(bg => ({
      ...bg,
      previewUrl: `/api/assets/backgrounds/${path.basename(bg.path)}`,
      path: undefined // Don't expose server paths to client
    }));

    res.json({
      models: modelsWithUrls,
      backgrounds: backgroundsWithUrls,
      posePrompts: POSE_PROMPTS,
      shoePosePrompts: SHOE_POSE_PROMPTS
    });
  } catch (error) {
    console.error('Error loading config:', error);
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

app.post('/api/generate', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'modelReference', maxCount: 1 }
]), async (req, res) => {
  const imagePath = req.files?.image?.[0]?.path;
  const modelReferencePath = req.files?.modelReference?.[0]?.path;

  try {
    if (!imagePath) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { prompt, gender, modelPersona, modelId, category, backgroundPrompt } = req.body;

    console.log('Received image:', imagePath);
    console.log('Prompt:', prompt);
    console.log('Model ID:', modelId);
    console.log('Category:', category);

    // Parse modelPersona if it's a JSON string
    let parsedPersona = null;
    if (modelPersona) {
      try {
        parsedPersona = typeof modelPersona === 'string' ? JSON.parse(modelPersona) : modelPersona;
      } catch (e) {
        console.warn('Failed to parse modelPersona:', e);
      }
    }

    // Resolve model reference path from modelId if provided
    let resolvedModelPath = modelReferencePath;
    if (modelId && !resolvedModelPath) {
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
    });

    res.json({
      imageUrl: result.imageUrl,
      downloadUrl: result.downloadUrl,
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
  const { imageUrl, prompt } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    console.log('Starting video generation for image:', imageUrl);
    const result = await geminiService.generateVideoFromImage(imageUrl, prompt || 'Fashion model moving naturally');

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

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 SERVER STARTED ON PORT ${PORT}`);
  console.log(`✨ Video Generation Endpoint: /api/generate-video`);
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

