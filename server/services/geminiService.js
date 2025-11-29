const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_KEY = process.env.GEMINIGEN_API_KEY;
const BASE_URL = process.env.GEMINIGEN_BASE_URL || 'https://api.geminigen.ai';
const DEFAULT_MODEL = process.env.GEMINIGEN_MODEL || 'imagen-pro';
const POLL_INTERVAL_MS = 3000;
const POLL_LIMIT = 20;

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
  if (options.gender) {
    formData.append('person_generation', options.gender);
  }

  console.log('Sending request to GeminiGen API…');

  const { data } = await apiClient.post('/uapi/v1/generate_image', formData, {
    headers: {
      ...formData.getHeaders(),
      'x-api-key': API_KEY,
    },
  });

  if (!data?.uuid) {
    throw new Error('GeminiGen did not return a job id');
  }

  return pollForResult(data.uuid);
}

module.exports = {
  generateImage,
};
