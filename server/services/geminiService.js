const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Ensure .env is loaded even when this module is required directly
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Support both legacy env names (giminigen_*) and corrected ones (GEMINIGEN_*)
const API_KEY = process.env.giminigen_API_KEY || process.env.GEMINIGEN_API_KEY;
const BASE_URL = process.env.giminigen_BASE_URL || process.env.GEMINIGEN_BASE_URL || 'https://api.geminigen.ai';
const DEFAULT_MODEL = process.env.giminigen_MODEL || 'imagen-pro';
const POLL_INTERVAL_MS = 5000;
const POLL_LIMIT = 60;
const VIDEO_MODEL = process.env.giminigen_VIDEO_MODEL || 'veo-3.1-fast';
const VIDEO_RESOLUTION = process.env.giminigen_VIDEO_RESOLUTION || '1080p';
const VIDEO_ASPECT_RATIO = process.env.giminigen_VIDEO_ASPECT_RATIO || '16:9';
const VIDEO_POLL_INTERVAL_MS = 5000;
const VIDEO_POLL_LIMIT = 60;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pollForResult(uuid) {
  for (let attempt = 0; attempt < POLL_LIMIT; attempt++) {
    const { data } = await apiClient.get(`/uapi/v1/history/${uuid}`, {
      headers: { 'x-api-key': API_KEY },
    });

    const images = data?.generated_image || [];
    const status = data?.status ?? 0;

    if (images.length && status >= 2) {
      const primary = images[0];
      return {
        imageUrl: primary.image_url || primary.file_download_url || data.thumbnail_url,
        downloadUrl: primary.file_download_url || primary.image_url,
        historyUrl: `${BASE_URL}/uapi/v1/history/${uuid}`,
        meta: {
          status,
          statusDesc: data?.status_desc || '',
          queuePosition: data?.queue_position,
          thumbnail: data?.thumbnail_url,
          model: primary.model || data?.model_name,
          generatedAt: data?.updated_at || data?.created_at,
        },
      };
    }

    if (status < 0 || data?.error_message) {
      throw new Error(data?.error_message || 'giminigen reported a failure');
    }

    await wait(POLL_INTERVAL_MS);
  }

  throw new Error('Timed out waiting for giminigen to finish the render');
}

async function pollForVideoResult(uuid) {
  for (let attempt = 0; attempt < VIDEO_POLL_LIMIT; attempt++) {
    const { data } = await apiClient.get(`/uapi/v1/history/${uuid}`, {
      headers: { 'x-api-key': API_KEY },
    });

    const videos = data?.generated_video ||
      data?.generated_videos ||
      data?.generated_file ||
      data?.generated_files ||
      [];

    const status = data?.status ?? 0;

    if (Array.isArray(videos) && videos.length && status >= 2) {
      const primary = videos[0];
      const videoUrl = primary.video_url || primary.file_download_url || primary.url || data?.video_url;
      const downloadUrl = primary.file_download_url || primary.video_url || primary.url || data?.video_url;

      if (!videoUrl && !downloadUrl) {
        throw new Error('giminigen finished but did not return a video URL');
      }

      return {
        videoUrl: videoUrl || downloadUrl,
        downloadUrl: downloadUrl || videoUrl,
        historyUrl: `${BASE_URL}/uapi/v1/history/${uuid}`,
        meta: {
          status,
          statusDesc: data?.status_desc || '',
          queuePosition: data?.queue_position,
          thumbnail: data?.thumbnail_url,
          model: primary.model || data?.model_name,
          generatedAt: data?.updated_at || data?.created_at,
        },
      };
    }

    if (status === 3 || status < 0 || data?.error_message) {
      throw new Error(data?.error_message || 'giminigen reported a failure while rendering video');
    }

    await wait(VIDEO_POLL_INTERVAL_MS);
  }

  throw new Error('Timed out waiting for giminigen to finish the video');
}

async function generateImage(imagePath, userPrompt, options = {}) {
  if (!API_KEY) {
    throw new Error('giminigen_API_KEY is not set');
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(imagePath)); // File 1: Garment/Product/Shoes

  let promptPrefix = 'Create a high-fidelity fashion product photo: a real human model wearing the exact same garment from the reference image. Preserve all logos, text, details, and EXACT garment color with no hue/brightness shifts.';

  // Handle shoe category with leg reference
  if (options.category === 'shoes' && options.modelReferencePath && fs.existsSync(options.modelReferencePath)) {
    console.log('Using shoe/leg model reference image:', options.modelReferencePath);
    formData.append('files', fs.createReadStream(options.modelReferencePath)); // File 2: Leg Reference

    // Build shoe-specific prompt with camera angle and lighting
    let shoePromptParts = ['Create a high-fidelity product photo of the shoes from the first image. Use the second image as reference for leg/feet type and outfit style.'];

    // Add camera angle instruction if specified
    if (options.shoeCameraAngle) {
      shoePromptParts.push(options.shoeCameraAngle);
    }

    // Add lighting instruction if specified
    if (options.shoeLighting) {
      shoePromptParts.push(options.shoeLighting);
    }

    shoePromptParts.push('Focus on shoe details while maintaining natural leg positioning. Preserve all logos, text, and details from the shoes. LOCK shoe color and design exactly to the first image.');

    promptPrefix = shoePromptParts.join(' ');
  }
  // Handle regular clothes category with full model reference
  else if (options.modelReferencePath && fs.existsSync(options.modelReferencePath)) {
    console.log('Using model reference image:', options.modelReferencePath);
    formData.append('files', fs.createReadStream(options.modelReferencePath)); // File 2: Model Reference
    promptPrefix = 'Create a high-fidelity fashion product photo using the first image as the exact garment reference and the second image as the model reference. The model in the output should resemble the person in the second image. Preserve all logos, text, and details from the garment. LOCK garment color and graphics exactly to the first image.';
  }

  const fullPrompt = [
    promptPrefix,
    'Use studio-quality lighting, soft shadows, high resolution, natural skin tone and authentic fabric texture.',
    userPrompt || '',
  ].join(' ');

  formData.append('prompt', fullPrompt.trim());
  formData.append('model', DEFAULT_MODEL);
  formData.append('aspect_ratio', '3:4');

  if (options.modelPersona?.gender) {
    formData.append('person_generation', options.modelPersona.gender);
  } else if (options.gender) {
    formData.append('person_generation', options.gender);
  }

  console.log('Sending request to giminigen API...');

  let data;
  try {
    const response = await apiClient.post('/uapi/v1/generate_image', formData, {
      headers: {
        ...formData.getHeaders(),
        'x-api-key': API_KEY,
      },
    });
    data = response.data;
  } catch (err) {
    const apiError = err?.response?.data;
    const message = apiError?.detail?.error_message || apiError?.error_message || err.message || 'giminigen request failed';
    throw new Error(message);
  }

  if (!data?.uuid) {
    throw new Error('giminigen did not return a job id');
  }

  return pollForResult(data.uuid);
}

async function generateVideoFromImage(referenceUrl, prompt) {
  if (!API_KEY) {
    throw new Error('giminigen_API_KEY is not set');
  }

  if (!referenceUrl) {
    throw new Error('Reference image URL is required to animate the result');
  }

  const formData = new FormData();

  formData.append('prompt', prompt.trim());
  formData.append('model', VIDEO_MODEL);
  formData.append('resolution', VIDEO_RESOLUTION);
  formData.append('aspect_ratio', VIDEO_ASPECT_RATIO);
  formData.append('file_urls', referenceUrl);

  console.log('Sending request to giminigen Veo API...');

  let data;
  try {
    const response = await apiClient.post('/uapi/v1/video-gen/veo', formData, {
      headers: {
        ...formData.getHeaders(),
        'x-api-key': API_KEY,
      },
    });
    data = response.data;
  } catch (err) {
    const apiError = err?.response?.data;
    const message = apiError?.detail?.error_message || apiError?.error_message || err.message || 'giminigen video request failed';
    throw new Error(message);
  }

  if (!data?.uuid) {
    throw new Error('giminigen did not return a job id for the video');
  }

  return pollForVideoResult(data.uuid);
}

module.exports = {
  generateImage,
  generateVideoFromImage,
};
