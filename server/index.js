const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const geminiService = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)){
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
app.post('/api/generate', upload.single('image'), async (req, res) => {
  const imagePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const { prompt, gender } = req.body;

    console.log('Received image:', imagePath);
    console.log('Prompt:', prompt);

    const result = await geminiService.generateImage(imagePath, prompt, {
      gender: gender || undefined,
    });

    res.json({
      imageUrl: result.imageUrl,
      downloadUrl: result.downloadUrl,
      meta: result.meta,
      prompt,
    });
  } catch (error) {
    console.error('Error generating image:', error?.response?.data || error.message);
    res.status(500).json({ error: error?.message || 'Failed to generate image' });
  } finally {
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
