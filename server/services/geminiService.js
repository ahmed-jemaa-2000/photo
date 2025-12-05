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

// ============================================
// IMAGE GENERATION STYLE PRESETS
// ============================================

/**
 * Professional photography style presets for image generation
 * Each preset contains optimized prompts for specific use cases
 */
const IMAGE_STYLE_PRESETS = {
  // E-commerce / Clean
  ecommerce_clean: {
    id: 'ecommerce_clean',
    name: 'E-commerce Clean',
    description: 'Pure white background, perfect for product listings',
    prompt: 'Clean white studio backdrop, even diffused lighting, no shadows on background, product-focused composition, pure white (#FFFFFF) background, professional e-commerce photography, high-key lighting, crisp sharp focus',
    aspectRatio: '3:4',
    category: 'commercial',
  },
  ecommerce_soft: {
    id: 'ecommerce_soft',
    name: 'E-commerce Soft',
    description: 'Soft gradient background with subtle shadows',
    prompt: 'Soft gradient studio background, gentle shadow beneath model, professional catalog photography, neutral gray-to-white gradient, balanced exposure, commercial quality, Amazon/Zalando style product shot',
    aspectRatio: '3:4',
    category: 'commercial',
  },

  // Editorial / Magazine
  editorial_vogue: {
    id: 'editorial_vogue',
    name: 'Editorial Vogue',
    description: 'High-fashion magazine editorial style',
    prompt: 'High-fashion editorial photography, Vogue magazine aesthetic, dramatic studio lighting with strong key light, sophisticated pose, fashion-forward composition, deep shadows and highlights, artistic color grading, luxury fashion campaign quality',
    aspectRatio: '3:4',
    category: 'editorial',
  },
  editorial_minimal: {
    id: 'editorial_minimal',
    name: 'Editorial Minimal',
    description: 'Clean minimalist editorial look',
    prompt: 'Minimalist editorial photography, clean lines, negative space utilization, understated elegance, modern Scandinavian aesthetic, muted color palette, architectural simplicity, high-end brand campaign style',
    aspectRatio: '3:4',
    category: 'editorial',
  },

  // Lifestyle
  lifestyle_urban: {
    id: 'lifestyle_urban',
    name: 'Street Style Urban',
    description: 'Urban street photography aesthetic',
    prompt: 'Street style photography, urban city backdrop, natural candid feel, golden hour sunlight, authentic street fashion vibe, brick walls or city architecture, contemporary urban lifestyle, Instagram influencer aesthetic',
    aspectRatio: '4:5',
    category: 'lifestyle',
  },
  lifestyle_outdoor: {
    id: 'lifestyle_outdoor',
    name: 'Outdoor Natural',
    description: 'Natural outdoor lifestyle setting',
    prompt: 'Outdoor lifestyle photography, natural daylight, lush greenery or beach setting, relaxed authentic pose, warm golden tones, aspirational lifestyle imagery, vacation editorial feel, natural environment',
    aspectRatio: '4:5',
    category: 'lifestyle',
  },
  lifestyle_cafe: {
    id: 'lifestyle_cafe',
    name: 'Cafe & Indoor',
    description: 'Cozy indoor cafe or home setting',
    prompt: 'Indoor lifestyle photography, cozy cafe or modern interior setting, warm ambient lighting, bokeh background, casual relaxed atmosphere, lifestyle brand aesthetic, social media ready',
    aspectRatio: '4:5',
    category: 'lifestyle',
  },

  // Luxury / Premium
  luxury_campaign: {
    id: 'luxury_campaign',
    name: 'Luxury Campaign',
    description: 'High-end luxury brand advertising',
    prompt: 'Luxury brand campaign photography, premium studio setup, dramatic Rembrandt lighting, rich deep shadows, opulent atmosphere, Gucci/Chanel advertising aesthetic, sophisticated color palette, ultra-premium quality',
    aspectRatio: '3:4',
    category: 'luxury',
  },
  luxury_dark: {
    id: 'luxury_dark',
    name: 'Dark Luxury',
    description: 'Moody dark premium aesthetic',
    prompt: 'Dark luxury photography, low-key dramatic lighting, deep black background, spotlight on product, mysterious sophisticated mood, high-end watch/jewelry campaign style, cinematic shadows',
    aspectRatio: '3:4',
    category: 'luxury',
  },

  // Social Media
  instagram_aesthetic: {
    id: 'instagram_aesthetic',
    name: 'Instagram Aesthetic',
    description: 'Optimized for Instagram feed',
    prompt: 'Instagram-optimized photography, trendy aesthetic, soft warm tones, lifestyle influencer style, perfectly composed for social media, aspirational yet authentic feel, engagement-optimized composition, warm color filter',
    aspectRatio: '4:5',
    category: 'social',
  },
  tiktok_dynamic: {
    id: 'tiktok_dynamic',
    name: 'TikTok Dynamic',
    description: 'Bold and eye-catching for short-form',
    prompt: 'Bold dynamic photography, vibrant saturated colors, high contrast, attention-grabbing composition, Gen-Z aesthetic, trendy and energetic, perfect for vertical video thumbnails, pop-culture inspired',
    aspectRatio: '9:16',
    category: 'social',
  },

  // Artistic
  artistic_film: {
    id: 'artistic_film',
    name: 'Film Grain Vintage',
    description: 'Nostalgic film photography look',
    prompt: 'Vintage film photography aesthetic, subtle film grain, slightly faded colors, nostalgic 35mm film look, soft analog warmth, Kodak Portra or Fuji color palette, authentic retro feel',
    aspectRatio: '3:4',
    category: 'artistic',
  },
};

/**
 * Quality enhancement keywords for image generation
 */
const IMAGE_QUALITY_BOOST = [
  'ultra high resolution',
  '8K quality',
  'professional DSLR photography',
  'sharp focus on product details',
  'natural skin texture',
  'authentic fabric rendering',
  'color-accurate product representation',
  'photorealistic',
].join(', ');

/**
 * Color fidelity guard - critical for product accuracy
 */
const COLOR_FIDELITY_GUARD = 'CRITICAL: Preserve EXACT product colors from the reference image. No color shifting, no hue changes, no saturation alterations. Match the original product color precisely.';

/**
 * Build optimized image generation prompt
 * @param {string} basePrompt - Base prompt from existing logic
 * @param {string} userPrompt - User's additional instructions
 * @param {object} options - Style and category options
 * @returns {object} { prompt, aspectRatio }
 */
function buildImagePrompt(basePrompt, userPrompt, options = {}) {
  const parts = [];

  // 1. Start with base prompt (product/model instructions)
  parts.push(basePrompt);

  // 2. Add style preset if specified
  const styleId = options.imageStyle || 'ecommerce_clean';
  const stylePreset = IMAGE_STYLE_PRESETS[styleId];

  if (stylePreset) {
    parts.push(stylePreset.prompt);
    console.log(`[Image Gen] Using style preset: ${stylePreset.name}`);
  }

  // 3. Add user's custom prompt
  if (userPrompt && userPrompt.trim()) {
    parts.push(userPrompt.trim());
  }

  // 4. Add quality boosters
  parts.push(IMAGE_QUALITY_BOOST);

  // 5. Add color fidelity guard (most important for product photos!)
  parts.push(COLOR_FIDELITY_GUARD);

  // 6. Add negative prompts
  parts.push('Avoid: blurry images, color shifts, distorted proportions, extra limbs, unnatural poses, watermarks, text overlays, low quality compression artifacts.');

  return {
    prompt: parts.join(' '),
    aspectRatio: stylePreset?.aspectRatio || options.aspectRatio || '3:4',
  };
}

async function generateImage(imagePath, userPrompt, options = {}) {
  if (!API_KEY) {
    throw new Error('giminigen_API_KEY is not set');
  }

  const formData = new FormData();
  formData.append('files', fs.createReadStream(imagePath));

  let basePrompt = 'Create a high-fidelity fashion product photo: a real human model wearing the exact same garment from the reference image. Preserve all logos, text, details, and EXACT garment color with no hue/brightness shifts.';

  // Handle shoe category with leg reference
  if (options.category === 'shoes' && options.modelReferencePath && fs.existsSync(options.modelReferencePath)) {
    console.log('Using shoe/leg model reference image:', options.modelReferencePath);
    formData.append('files', fs.createReadStream(options.modelReferencePath));

    let shoePromptParts = ['Create a high-fidelity product photo of the shoes from the first image. Use the second image as reference for leg/feet type and outfit style.'];

    if (options.shoeCameraAngle) {
      shoePromptParts.push(options.shoeCameraAngle);
    }

    if (options.shoeLighting) {
      shoePromptParts.push(options.shoeLighting);
    }

    shoePromptParts.push('Focus on shoe details while maintaining natural leg positioning. Preserve all logos, text, and details from the shoes. LOCK shoe color and design exactly to the first image.');

    basePrompt = shoePromptParts.join(' ');
  }
  // Handle regular clothes category with full model reference
  else if (options.modelReferencePath && fs.existsSync(options.modelReferencePath)) {
    console.log('Using model reference image:', options.modelReferencePath);
    formData.append('files', fs.createReadStream(options.modelReferencePath));
    basePrompt = 'Create a high-fidelity fashion product photo using the first image as the exact garment reference and the second image as the model reference. The model in the output should resemble the person in the second image. Preserve all logos, text, and details from the garment. LOCK garment color and graphics exactly to the first image.';
  }

  // Build enhanced prompt with style presets
  const { prompt: enhancedPrompt, aspectRatio } = buildImagePrompt(basePrompt, userPrompt, options);

  console.log('[Image Gen] Enhanced prompt length:', enhancedPrompt.length);
  console.log('[Image Gen] Aspect ratio:', aspectRatio);

  formData.append('prompt', enhancedPrompt);
  formData.append('model', DEFAULT_MODEL);
  formData.append('aspect_ratio', aspectRatio);

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

// ============================================
// VIDEO MOTION PROMPT TEMPLATES
// ============================================

/**
 * Professional motion prompts for different video styles
 */
const VIDEO_MOTION_PRESETS = {
  // Fashion/Product focused
  fashion_walk: {
    name: 'Fashion Walk',
    prompt: 'Smooth slow-motion runway walk, confident stride, subtle hip movement, professional lighting consistent throughout, camera follows model smoothly, high-end fashion commercial quality, 4K cinematic, shallow depth of field, no camera shake',
  },
  product_showcase: {
    name: 'Product Showcase',
    prompt: 'Gentle rotation reveal, slow orbit around product, professional studio lighting, seamless loop potential, focus maintained on product details, commercial quality, smooth camera movement, no abrupt changes',
  },
  lifestyle_natural: {
    name: 'Lifestyle Natural',
    prompt: 'Natural candid movement, subtle head turn or body shift, relaxed breathing animation, warm ambient lighting, lifestyle commercial aesthetic, smooth transitions, realistic motion blur',
  },

  // Movement types
  subtle_sway: {
    name: 'Subtle Sway',
    prompt: 'Minimal elegant movement, gentle weight shift from foot to foot, slight arm adjustment, maintaining fashion pose, professional model micro-movements, high-end lookbook style',
  },
  confident_pose: {
    name: 'Confident Pose',
    prompt: 'Model transitions between confident poses, smooth weight shifts, intentional hand placements, strong eye contact with camera, editorial fashion video quality',
  },

  // Shoe-specific
  shoe_walk: {
    name: 'Shoe Walk',
    prompt: 'Focus on feet and legs, natural walking motion, each step clearly visible, shoe details maintained, clean floor reflection, professional footwear commercial, steady low-angle tracking shot',
  },
  shoe_display: {
    name: 'Shoe Display',
    prompt: 'Feet movement showcase, subtle ankle rotation, weight shift highlighting shoe design, close focus on footwear, product photography in motion',
  },

  // Bag-specific
  bag_carry: {
    name: 'Bag Carry',
    prompt: 'Model walking with bag naturally, arm swing with bag visible, lifestyle context, bag moves realistically with body motion, fashion accessory commercial style',
  },

  // Dynamic
  dynamic_turn: {
    name: 'Dynamic Turn',
    prompt: 'Graceful 180-degree turn, fabric movement visible, hair movement natural, smooth pivot, fashion show quality, professional lighting maintained through rotation',
  },

  // Cinematic
  cinematic_slow: {
    name: 'Cinematic Slow-Mo',
    prompt: 'Ultra slow motion capture, 120fps aesthetic, dramatic lighting, every detail visible, high-fashion editorial, film-grain optional, premium commercial quality',
  },
};

/**
 * Quality enhancement keywords for video generation
 */
const VIDEO_QUALITY_BOOST = [
  '8K resolution quality',
  'professional color grading',
  'smooth 60fps motion',
  'studio lighting consistency',
  'no flickering or artifacts',
  'natural motion blur',
  'high dynamic range',
  'commercial broadcast quality',
].join(', ');

/**
 * Build optimized video generation prompt
 * @param {string} userPrompt - User's base prompt or style preference
 * @param {object} options - Additional options (category, style, etc.)
 * @returns {string} Optimized video prompt
 */
function buildVideoPrompt(userPrompt, options = {}) {
  const parts = [];

  // 1. Core instruction - animate the static image
  parts.push('Transform this static fashion product image into a smooth, professional video.');

  // 2. Add motion style based on category or user preference
  const category = options.category || 'clothes';
  const motionStyle = options.motionStyle || 'subtle_sway';

  // Select appropriate motion preset
  let motionPreset = VIDEO_MOTION_PRESETS[motionStyle];

  // Fallback to category-appropriate motion if custom style not found
  if (!motionPreset) {
    switch (category) {
      case 'shoes':
        motionPreset = VIDEO_MOTION_PRESETS.shoe_walk;
        break;
      case 'bags':
        motionPreset = VIDEO_MOTION_PRESETS.bag_carry;
        break;
      case 'accessories':
        motionPreset = VIDEO_MOTION_PRESETS.lifestyle_natural;
        break;
      default:
        motionPreset = VIDEO_MOTION_PRESETS.subtle_sway;
    }
  }

  parts.push(motionPreset.prompt);

  // 3. Add user's custom prompt if provided
  if (userPrompt && userPrompt.trim()) {
    parts.push(userPrompt.trim());
  }

  // 4. Add quality boosters
  parts.push(VIDEO_QUALITY_BOOST);

  // 5. Add safety/consistency guards
  parts.push('Maintain exact product appearance, colors, and details from the source image. No morphing or distortion of product features. Consistent lighting throughout.');

  // 6. Negative prompts (what to avoid)
  parts.push('Avoid: jump cuts, camera shake, sudden movements, unnatural poses, color shifts, blurry frames, low quality compression.');

  return parts.join(' ');
}

async function generateVideoFromImage(referenceUrl, prompt, options = {}) {
  if (!API_KEY) {
    throw new Error('giminigen_API_KEY is not set');
  }

  if (!referenceUrl) {
    throw new Error('Reference image URL is required to animate the result');
  }

  // Build enhanced prompt
  const enhancedPrompt = buildVideoPrompt(prompt, options);

  console.log('[Video Gen] Enhanced prompt:', enhancedPrompt.substring(0, 200) + '...');

  const formData = new FormData();

  formData.append('prompt', enhancedPrompt);
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
