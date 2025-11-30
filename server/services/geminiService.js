const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Ensure .env is loaded even when this module is required directly
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const API_KEY = process.env.GEMINIGEN_API_KEY;
const BASE_URL = process.env.GEMINIGEN_BASE_URL || 'https://api.geminigen.ai';
const DEFAULT_MODEL = process.env.GEMINIGEN_MODEL || 'imagen-pro';
const POLL_INTERVAL_MS = 3000;
const POLL_LIMIT = 20;
const VIDEO_MODEL = process.env.GEMINIGEN_VIDEO_MODEL || 'veo-3.1-fast';
const VIDEO_RESOLUTION = process.env.GEMINIGEN_VIDEO_RESOLUTION || '1080p';
const VIDEO_ASPECT_RATIO = process.env.GEMINIGEN_VIDEO_ASPECT_RATIO || '16:9';
const VIDEO_POLL_INTERVAL_MS = 5000;
const VIDEO_POLL_LIMIT = 60;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
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
      throw new Error(data?.error_message || 'GeminiGen reported a failure');
    }

    await wait(POLL_INTERVAL_MS);
  }

  throw new Error('Timed out waiting for GeminiGen to finish the render');
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
        throw new Error('GeminiGen finished but did not return a video URL');
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
      throw new Error(data?.error_message || 'GeminiGen reported a failure while rendering video');
    }

    await wait(VIDEO_POLL_INTERVAL_MS);
  }

  throw new Error('Timed out waiting for GeminiGen to finish the video');
}

async function generateImage(imagePath, userPrompt, options = {}) {
  if (!API_KEY) {
    throw new Error('GEMINIGEN_API_KEY is not set');
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(imagePath));

  const fullPrompt = [
    'Create a fashion product photo: a real human model wearing the garment from the reference image.',
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

  console.log('Sending request to GeminiGen API...');

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
    const message = apiError?.detail?.error_message || apiError?.error_message || err.message || 'GeminiGen request failed';
    throw new Error(message);
  }

  if (!data?.uuid) {
    throw new Error('GeminiGen did not return a job id');
  }

  return pollForResult(data.uuid);
}

async function generateVideoFromImage(referenceUrl, prompt) {
  if (!API_KEY) {
    throw new Error('GEMINIGEN_API_KEY is not set');
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

  console.log('Sending request to GeminiGen Veo API...');

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
    const message = apiError?.detail?.error_message || apiError?.error_message || err.message || 'GeminiGen video request failed';
    throw new Error(message);
  }

  if (!data?.uuid) {
    throw new Error('GeminiGen did not return a job id for the video');
  }

  return pollForVideoResult(data.uuid);
}

module.exports = {
  generateImage,
  generateVideoFromImage,
};
