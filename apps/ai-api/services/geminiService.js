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
const VIDEO_POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes hard timeout

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeHistoryResponse(data) {
  return data?.result ?? data;
}

function extractErrorMessage(history) {
  return history?.error_message || history?.detail?.error_message;
}

function extractGenerateResultUrl(history) {
  return (
    history?.generate_result ||
    history?.generateResult ||
    history?.generated_result ||
    history?.generatedResult ||
    null
  );
}

function extractGeneratedImages(history) {
  const images = history?.generated_image || history?.generated_images;
  return Array.isArray(images) ? images : [];
}

function extractGeneratedVideos(history) {
  const videos =
    history?.generated_video ||
    history?.generated_videos ||
    history?.generated_file ||
    history?.generated_files;
  return Array.isArray(videos) ? videos : [];
}

function getPrimaryImageUrl(primary, history) {
  const generateResult = extractGenerateResultUrl(history);
  const thumbnailFromItem = primary?.thumbnails?.[0]?.url;
  return (
    primary?.image_url ||
    generateResult ||
    thumbnailFromItem ||
    primary?.file_download_url ||
    history?.thumbnail_url ||
    null
  );
}

function getPrimaryImageDownloadUrl(primary, history) {
  const generateResult = extractGenerateResultUrl(history);
  return primary?.file_download_url || primary?.image_url || generateResult || null;
}

function getPrimaryVideoUrl(primary, history) {
  const generateResult = extractGenerateResultUrl(history);
  return (
    primary?.video_url ||
    generateResult ||
    primary?.file_download_url ||
    primary?.url ||
    history?.video_url ||
    null
  );
}

function getPrimaryVideoDownloadUrl(primary, history) {
  const generateResult = extractGenerateResultUrl(history);
  return primary?.file_download_url || primary?.video_url || generateResult || primary?.url || null;
}

/**
 * Wrap a promise with a timeout
 * @param {Promise} promise - Promise to wrap
 * @param {number} ms - Timeout in milliseconds
 * @param {string} errorMessage - Error message on timeout
 */
const withTimeout = (promise, ms, errorMessage = 'Operation timed out') => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    )
  ]);
};

async function pollForResult(uuid) {
  for (let attempt = 0; attempt < POLL_LIMIT; attempt++) {
    const { data } = await apiClient.get(`/uapi/v1/history/${uuid}`, {
      headers: { 'x-api-key': API_KEY },
    });

    const history = normalizeHistoryResponse(data);
    const images = extractGeneratedImages(history);
    const status = history?.status ?? 0;
    const errorMessage = extractErrorMessage(history);
    const generateResult = extractGenerateResultUrl(history);

    if (status >= 2 && (images.length || generateResult)) {
      const primary = images[0] || null;
      const imageUrl = getPrimaryImageUrl(primary, history);
      const downloadUrl = getPrimaryImageDownloadUrl(primary, history);

      if (!imageUrl && !downloadUrl) {
        throw new Error('giminigen finished but did not return an image URL');
      }

      return {
        imageUrl: imageUrl || downloadUrl,
        downloadUrl: downloadUrl || imageUrl,
        historyUrl: `${BASE_URL}/uapi/v1/history/${uuid}`,
        meta: {
          status,
          statusDesc: history?.status_desc || '',
          queuePosition: history?.queue_position,
          thumbnail: history?.thumbnail_url,
          model: primary?.model || history?.model_name,
          generatedAt: history?.updated_at || history?.created_at,
          statusPercentage: history?.status_percentage,
        },
      };
    }

    if (status === 3 || status < 0 || errorMessage) {
      throw new Error(errorMessage || 'giminigen reported a failure');
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

    const history = normalizeHistoryResponse(data);
    const videos = extractGeneratedVideos(history);
    const status = history?.status ?? 0;
    const errorMessage = extractErrorMessage(history);
    const generateResult = extractGenerateResultUrl(history);

    if (status >= 2 && (videos.length || generateResult)) {
      const primary = videos[0] || null;
      const videoUrl = getPrimaryVideoUrl(primary, history);
      const downloadUrl = getPrimaryVideoDownloadUrl(primary, history);

      if (!videoUrl && !downloadUrl) {
        throw new Error('giminigen finished but did not return a video URL');
      }

      return {
        videoUrl: videoUrl || downloadUrl,
        downloadUrl: downloadUrl || videoUrl,
        historyUrl: `${BASE_URL}/uapi/v1/history/${uuid}`,
        meta: {
          status,
          statusDesc: history?.status_desc || '',
          queuePosition: history?.queue_position,
          thumbnail: history?.thumbnail_url,
          model: primary?.model || history?.model_name,
          generatedAt: history?.updated_at || history?.created_at,
          statusPercentage: history?.status_percentage,
        },
      };
    }

    if (status === 3 || status < 0 || errorMessage) {
      throw new Error(errorMessage || 'giminigen reported a failure while rendering video');
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
    aspectRatio: '3:4',
    category: 'lifestyle',
  },
  lifestyle_outdoor: {
    id: 'lifestyle_outdoor',
    name: 'Outdoor Natural',
    description: 'Natural outdoor lifestyle setting',
    prompt: 'Outdoor lifestyle photography, natural daylight, lush greenery or beach setting, relaxed authentic pose, warm golden tones, aspirational lifestyle imagery, vacation editorial feel, natural environment',
    aspectRatio: '3:4',
    category: 'lifestyle',
  },
  lifestyle_cafe: {
    id: 'lifestyle_cafe',
    name: 'Cafe & Indoor',
    description: 'Cozy indoor cafe or home setting',
    prompt: 'Indoor lifestyle photography, cozy cafe or modern interior setting, warm ambient lighting, bokeh background, casual relaxed atmosphere, lifestyle brand aesthetic, social media ready',
    aspectRatio: '3:4',
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
    aspectRatio: '3:4',
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
 * Uses professional camera terminology for best AI interpretation
 */
const IMAGE_QUALITY_BOOST = [
  // Camera & Equipment
  'captured on Hasselblad H6D-400c medium format',
  'Phase One IQ4 150MP sensor quality',
  'Zeiss Otus 85mm f/1.4 lens sharpness',
  // Lighting
  'professional Broncolor studio lighting',
  'softbox diffused key light',
  'clean catchlights in eyes',
  // Quality
  'ultra high resolution 8K',
  'razor sharp focus on product',
  'natural skin texture and pores',
  'authentic fabric weave and material texture',
  // Technical
  'photorealistic rendering',
  'color managed workflow',
  'proper exposure and white balance',
].join(', ');

/**
 * Build a STRONG color lock clause with semantic reinforcement
 * This is critical for color accuracy in AI generation
 * Uses triple-mention strategy: beginning, middle semantic, and reminder
 */
function buildColorLockClause(colorHex, colorName, colorPalette, isManualOverride = false) {
  if (!colorHex) return '';

  const parts = [];
  const semanticColor = colorName || getSemanticColorName(colorHex);
  const emphasis = isManualOverride ? 'USER SPECIFIED' : 'DETECTED';

  // Handle special cases for commonly misidentified colors
  const isWhiteProduct = isWhiteColor(colorHex);
  const isBlackProduct = isBlackColor(colorHex);

  // Layer 1: Direct color instruction at START (highest attention)
  if (isWhiteProduct) {
    parts.push(`[${emphasis} COLOR: PURE WHITE ${colorHex}] This product is WHITE - not cream, not beige, not off-white, not tan. It is PURE WHITE.`);
  } else if (isBlackProduct) {
    parts.push(`[${emphasis} COLOR: BLACK ${colorHex}] This product is BLACK - not dark gray, not charcoal, not navy. It is TRUE BLACK.`);
  } else {
    parts.push(`[${emphasis} COLOR: ${semanticColor.toUpperCase()} ${colorHex}] Product is ${semanticColor}. Preserve this EXACT color - no hue shift, no brightness change.`);
  }

  // Layer 2: Semantic reinforcement with context
  if (colorPalette && colorPalette.length > 0) {
    const primaryPercent = colorPalette[0]?.percentage || 80;
    parts.push(`Primary color ${semanticColor} covers ${primaryPercent}% of product.`);
  }

  return parts.join(' ');
}

/**
 * Helper to detect white colors
 */
function isWhiteColor(hex) {
  if (!hex) return false;
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // White: high R, G, B values, low saturation
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const lightness = (min + max) / 2 / 255;
  const saturation = max === min ? 0 : (max - min) / (max + min > 255 ? (510 - max - min) : (max + min));
  return lightness > 0.85 && saturation < 0.15;
}

/**
 * Helper to detect black colors
 */
function isBlackColor(hex) {
  if (!hex) return false;
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const lightness = (rgb.r + rgb.g + rgb.b) / 3 / 255;
  return lightness < 0.15;
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get semantic color name from hex
 */
function getSemanticColorName(hex) {
  if (!hex) return 'unknown';
  const rgb = hexToRgb(hex);
  if (!rgb) return 'unknown';

  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  const s = max === min ? 0 : (max - min) / (l > 0.5 ? (510 - max - min) : (max + min));

  // Calculate hue
  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  h *= 360;

  // Neutrals
  if (s < 0.1) {
    if (l > 0.9) return 'pure white';
    if (l > 0.7) return 'light gray';
    if (l > 0.4) return 'gray';
    if (l > 0.15) return 'dark gray';
    return 'black';
  }

  // Chromatic colors
  if (h < 15 || h >= 345) return l > 0.6 ? 'light red' : (l < 0.35 ? 'dark red' : 'red');
  if (h < 45) return l > 0.6 ? 'peach' : (l < 0.35 ? 'brown' : 'orange');
  if (h < 70) return l > 0.6 ? 'light yellow' : 'yellow';
  if (h < 170) return l > 0.6 ? 'light green' : (l < 0.35 ? 'dark green' : 'green');
  if (h < 200) return l > 0.6 ? 'light cyan' : 'teal';
  if (h < 260) return l > 0.6 ? 'light blue' : (l < 0.35 ? 'navy' : 'blue');
  if (h < 290) return l > 0.6 ? 'lavender' : 'purple';
  if (h < 345) return l > 0.6 ? 'light pink' : 'pink';

  return 'unknown';
}

/**
 * Build comprehensive negative prompt for color protection and quality
 * Prevents common AI generation issues
 */
function buildColorNegativePrompt(options = {}) {
  const negatives = [
    // Color protection (highest priority)
    'no color shift',
    'no color cast',
    'no tint',
    'no warm filter',
    'no cool filter',
    'no sepia',
    'no vintage filter',
    'no instagram filter',
    'no saturation change',
    'no hue rotation',

    // Quality issues
    'no blurry',
    'no soft focus',
    'no jpeg artifacts',
    'no noise',
    'no pixelation',

    // AI artifacts
    'no extra fingers',
    'no deformed hands',
    'no distorted face',
    'no extra limbs',
    'no floating objects',
    'no unnatural poses',

    // Product preservation
    'no logo alteration',
    'no pattern change',
    'no texture modification',
    'no product deformation',
    'no brand modification',
  ];

  // Add white-specific negatives
  if (options.isWhiteProduct) {
    negatives.push('no yellowing', 'no cream tint', 'no beige cast', 'no tan color');
  }

  return negatives.join(', ');
}

/**
 * Build optimized image generation prompt
 * @param {string} basePrompt - Base prompt from existing logic
 * @param {string} userPrompt - User's additional instructions
 * @param {object} options - Style and category options
 * @returns {object} { prompt, aspectRatio }
 */
function buildImagePrompt(basePrompt, userPrompt, options = {}) {
  const parts = [];

  // 1. COLOR LOCK FIRST (AI pays most attention to beginning of prompt)
  // IMPORTANT: For adCreative category, the colorHex is the BRAND color scheme,
  // NOT the product color. We want to preserve the product's ORIGINAL color,
  // so we skip color lock and add a strong preservation instruction instead.

  const isAdCreative = options.category === 'adCreative';

  if (isAdCreative) {
    // For Ad Creative: Strong instruction to preserve original product colors
    parts.push(`[CRITICAL: PRODUCT COLOR PRESERVATION] The product in the reference image must be preserved with its ORIGINAL colors exactly as shown. Do NOT change the product's color to match the brand color scheme. Apply brand colors ONLY to decorative elements, backgrounds, and effects - NEVER to the product itself.`);
    console.log('[Image Gen] Ad Creative mode: Product color preservation activated (skipping brand color lock)');
  } else {
    // Original color lock behavior for other categories
    // Try to get color from options first (manual override), then from userPrompt
    let colorHex = options.colorHex || options.manualColorHex;
    const isManualOverride = !!options.manualColorHex;

    if (!colorHex) {
      const colorHexMatch = userPrompt?.match(/#[A-Fa-f0-9]{6}/);
      colorHex = colorHexMatch ? colorHexMatch[0].toUpperCase() : null;
    }

    // Check if this is a white product for special handling
    const isWhiteProduct = colorHex ? isWhiteColor(colorHex) : false;
    const colorName = options.colorName || null;
    const colorPalette = options.colorPalette || null;

    if (colorHex) {
      const colorLock = buildColorLockClause(colorHex, colorName, colorPalette, isManualOverride);
      parts.push(colorLock);
      console.log(`[Image Gen] Color lock activated: ${colorHex}${isManualOverride ? ' (MANUAL OVERRIDE)' : ''}`);
      if (isWhiteProduct) console.log(`[Image Gen] White product detected - applying special protection`);
    }
  }

  // 2. Base prompt (product/model instructions)
  parts.push(basePrompt);

  // 3. Add style preset if specified
  const styleId = options.imageStyle || 'ecommerce_clean';
  const stylePreset = IMAGE_STYLE_PRESETS[styleId];

  if (stylePreset) {
    parts.push(stylePreset.prompt);
    console.log(`[Image Gen] Using style preset: ${stylePreset.name}`);
  }

  // 4. Add user's custom prompt
  if (userPrompt && userPrompt.trim()) {
    parts.push(userPrompt.trim());
  }

  // 5. Quality boost
  parts.push(IMAGE_QUALITY_BOOST);

  // 6. Enhanced negative prompts
  const negatives = `Avoid: ${buildColorNegativePrompt({})}.`;
  parts.push(negatives);

  // 7. END reminder (3rd strategic mention)
  if (isAdCreative) {
    // For Ad Creative: Repeat the product preservation instruction
    parts.push(`FINAL REMINDER: PRESERVE THE PRODUCT'S ORIGINAL COLORS EXACTLY. Brand color palette is for decorative elements ONLY. Do not recolor the product.`);
  } else {
    // For other categories: Color reminder if colorHex was set
    const colorHexFromOptions = options.colorHex || options.manualColorHex;
    const colorHexFromPrompt = userPrompt?.match(/#[A-Fa-f0-9]{6}/)?.[0]?.toUpperCase();
    const finalColorHex = colorHexFromOptions || colorHexFromPrompt;

    if (finalColorHex) {
      const isWhiteProduct = isWhiteColor(finalColorHex);
      const semanticColor = getSemanticColorName(finalColorHex);
      if (isWhiteProduct) {
        parts.push(`REMINDER: This product is PURE WHITE (${finalColorHex}). Output must show a WHITE product.`);
      } else {
        parts.push(`FINAL REMINDER: Product color is ${semanticColor} (${finalColorHex}) - preserve exactly.`);
      }
    }
  }

  // Supported aspect ratios by the API
  const SUPPORTED_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'];

  let finalAspectRatio = stylePreset?.aspectRatio || options.aspectRatio || '3:4';

  // Validate and map unsupported ratios to closest supported ones
  if (!SUPPORTED_RATIOS.includes(finalAspectRatio)) {
    console.warn(`[Image Gen] Warning: Unsupported aspect ratio '${finalAspectRatio}' detected.`);

    // Comprehensive mapping for all output formats
    const RATIO_MAPPINGS = {
      '4:5': '3:4',        // Instagram 4:5 → 3:4 (Portrait)
      '2:3': '3:4',        // Pinterest 2:3 → 3:4 (Portrait)
      '820:312': '16:9',   // Facebook Cover → 16:9 (Landscape)
      '1.91:1': '16:9',    // LinkedIn 1.91:1 → 16:9 (Landscape)
      '1200:628': '16:9',  // LinkedIn alternative → 16:9
      '1600:900': '16:9',  // Twitter → already 16:9 equivalent
    };

    if (RATIO_MAPPINGS[finalAspectRatio]) {
      const mappedRatio = RATIO_MAPPINGS[finalAspectRatio];
      console.log(`[Image Gen] Auto-mapped ${finalAspectRatio} to ${mappedRatio}`);
      finalAspectRatio = mappedRatio;
    } else {
      // Parse ratio to determine if landscape or portrait, then map accordingly
      const parts = finalAspectRatio.split(':').map(Number);
      if (parts.length === 2 && parts[0] > parts[1]) {
        finalAspectRatio = '16:9'; // Landscape
        console.log('[Image Gen] Auto-mapped unknown landscape ratio to 16:9');
      } else if (parts.length === 2 && parts[1] > parts[0]) {
        finalAspectRatio = '9:16'; // Portrait
        console.log('[Image Gen] Auto-mapped unknown portrait ratio to 9:16');
      } else {
        finalAspectRatio = '1:1'; // Square fallback
        console.log('[Image Gen] Auto-mapped unknown ratio to 1:1');
      }
    }
  }

  return {
    prompt: parts.join(' '),
    aspectRatio: finalAspectRatio,
  };
}

async function generateImage(imagePath, userPrompt, options = {}) {
  if (!API_KEY) {
    throw new Error('giminigen_API_KEY is not set');
  }

  const formData = new FormData();

  // Primary input/reference image (product)
  formData.append('files', fs.createReadStream(imagePath));

  // Optional model/reference image (2nd reference) + extra references
  const modelReferencePath = options.modelReferencePath;
  const hasModelReferencePath = !!(modelReferencePath && fs.existsSync(modelReferencePath));

  if (hasModelReferencePath) {
    console.log('[Image Gen] Using model reference image:', modelReferencePath);
    formData.append('files', fs.createReadStream(modelReferencePath));
  }

  const extraReferencePaths = Array.isArray(options.referenceImagePaths) ? options.referenceImagePaths : [];
  for (const refPath of extraReferencePaths) {
    if (!refPath || refPath === imagePath || refPath === modelReferencePath) continue;
    if (!fs.existsSync(refPath)) continue;
    formData.append('files', fs.createReadStream(refPath));
  }

  const fileUrls = Array.isArray(options.fileUrls) ? options.fileUrls : [];
  for (const url of fileUrls) {
    if (!url) continue;
    formData.append('file_urls', url);
  }

  if (options.refHistory) {
    formData.append('ref_history', options.refHistory);
  }

  // Build the base prompt based on category and model description
  let basePrompt = '';
  const modelDescription = options.modelDescription || '';
  const shoeModelDescription = options.shoeModelDescription || '';

  // Handle SHOES category
  if (options.category === 'shoes') {
    let shoePromptParts = [
      'Create a high-fidelity professional product photo of these shoes worn by a real person.',
      'The shoes in the reference image must be preserved EXACTLY - same color, design, logos, text, and all details.',
    ];

    // Add shoe model (leg/outfit) description if provided
    if (hasModelReferencePath) {
      shoePromptParts.push('Use the second reference image as the leg/feet and outfit reference. The legs/feet in the output should resemble the person in the second image.');
    } else if (shoeModelDescription) {
      shoePromptParts.push(`The model should have: ${shoeModelDescription}.`);
      console.log('[Image Gen] Using shoe model description:', shoeModelDescription);
    } else {
      shoePromptParts.push('Show the shoes on natural-looking human legs with appropriate casual attire.');
    }

    // Add camera angle instruction
    if (options.shoeCameraAngle) {
      shoePromptParts.push(options.shoeCameraAngle);
    }

    // Add lighting instruction
    if (options.shoeLighting) {
      shoePromptParts.push(options.shoeLighting);
    }

    shoePromptParts.push('Focus sharply on shoe details. LOCK shoe color and design exactly to the reference image.');
    basePrompt = shoePromptParts.join(' ');
  }
  // Handle BAGS category
  else if (options.category === 'bags') {
    let bagPromptParts = [
      'Create a high-fidelity professional product photo of this bag.',
      'The bag in the reference image must be preserved EXACTLY - same color, material, hardware, logos, and all details.',
    ];

    if (hasModelReferencePath) {
      bagPromptParts.push('Use the second reference image as the model reference for pose and overall look.');
    }

    if (modelDescription) {
      bagPromptParts.push(`Show the bag styled with a model who has: ${modelDescription}.`);
      console.log('[Image Gen] Using bag model description:', modelDescription);
    }

    basePrompt = bagPromptParts.join(' ');
  }
  // Handle ACCESSORIES category
  else if (options.category === 'accessories') {
    let accessoryPromptParts = [
      'Create a high-fidelity professional product photo of this accessory.',
      'The accessory in the reference image must be preserved EXACTLY - same color, material, design, and all details.',
    ];

    if (hasModelReferencePath) {
      accessoryPromptParts.push('Use the second reference image as the model reference for pose and overall look.');
    }

    if (modelDescription) {
      accessoryPromptParts.push(`Show the accessory on a model who has: ${modelDescription}.`);
      console.log('[Image Gen] Using accessory model description:', modelDescription);
    }

    basePrompt = accessoryPromptParts.join(' ');
  }
  // Handle CLOTHES category (default)
  else {
    let clothesPromptParts = [
      'Create a high-fidelity fashion product photo: a real human model wearing the EXACT same garment from the reference image.',
      'Preserve all logos, text, patterns, graphics, and details. LOCK the EXACT garment color with no hue or brightness shifts.',
    ];

    // Add model persona description if provided
    if (hasModelReferencePath) {
      clothesPromptParts.push('Use the second reference image as the model reference. The model in the output should resemble the person in the second image.');
    }

    if (modelDescription) {
      clothesPromptParts.push(`The model should be: ${modelDescription}.`);
      console.log('[Image Gen] Using model description:', modelDescription);
    } else if (options.modelPersona) {
      // Fallback to modelPersona object if available
      const persona = options.modelPersona;
      const personaDesc = [];
      if (persona.gender) personaDesc.push(persona.gender);
      if (persona.ethnicity) personaDesc.push(`${persona.ethnicity} ethnicity`);
      if (persona.style) personaDesc.push(`${persona.style} style`);
      if (personaDesc.length > 0) {
        clothesPromptParts.push(`The model should be: ${personaDesc.join(', ')}.`);
      }
    }

    basePrompt = clothesPromptParts.join(' ');
  }

  // Build enhanced prompt with style presets
  const { prompt: enhancedPrompt, aspectRatio } = buildImagePrompt(basePrompt, userPrompt, options);

  console.log('[Image Gen] Enhanced prompt length:', enhancedPrompt.length);
  console.log('[Image Gen] Aspect ratio:', aspectRatio);
  console.log('[Image Gen] Category:', options.category || 'clothes');

  formData.append('prompt', enhancedPrompt);
  formData.append('model', DEFAULT_MODEL);
  formData.append('aspect_ratio', aspectRatio);

  // Add style parameter based on imageStyle preset
  // Map our internal style presets to API-supported style values
  const styleMap = {
    'ecommerce_clean': 'Stock Photo',
    'ecommerce_soft': 'Stock Photo',
    'editorial_vogue': 'Portrait Fashion',
    'editorial_minimal': 'Photorealistic',
    'lifestyle_urban': 'Dynamic',
    'lifestyle_outdoor': 'Photorealistic',
    'lifestyle_cafe': 'Photorealistic',
    'luxury_campaign': 'Portrait Cinematic',
    'luxury_dark': 'Portrait Cinematic',
    'instagram_aesthetic': 'Fashion',
    'tiktok_dynamic': 'Dynamic',
    'artistic_film': 'Creative',
  };
  const apiStyle = styleMap[options.imageStyle] || 'Photorealistic';
  formData.append('style', apiStyle);
  console.log('[Image Gen] API Style:', apiStyle);

  // Add person_generation parameter for gender guidance
  if (options.modelPersona?.gender) {
    formData.append('person_generation', options.modelPersona.gender);
  } else if (options.gender) {
    formData.append('person_generation', options.gender);
  }

  // Build curl command for debugging with API admin
  const curlCommand = `curl -X POST "${BASE_URL}/uapi/v1/generate_image" \\
  -H "x-api-key: ${API_KEY?.substring(0, 8)}...REDACTED" \\
  -F "files=@${imagePath}" \\
  -F "prompt=${enhancedPrompt.replace(/"/g, '\\"').substring(0, 300)}..." \\
  -F "model=${DEFAULT_MODEL}" \\
  -F "aspect_ratio=${aspectRatio}" \\
  -F "style=${apiStyle}" \\
  ${options.gender ? `-F "person_generation=${options.gender}"` : ''}`;

  // Debug logging
  console.log('[Image Gen] ===== API REQUEST DEBUG =====');
  console.log('[Image Gen] Single file attached (API limit: 1)');
  console.log('[Image Gen] Model:', DEFAULT_MODEL);
  console.log('[Image Gen] Prompt (first 500 chars):', enhancedPrompt.substring(0, 500));
  console.log('[Image Gen] API URL:', apiClient.defaults.baseURL + '/uapi/v1/generate_image');
  console.log('[Image Gen] API Key set:', !!API_KEY);
  console.log('[Image Gen] ================================');
  console.log('[Image Gen] CURL COMMAND FOR DEBUG:');
  console.log(curlCommand);
  console.log('[Image Gen] ================================');

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
    console.error('[Image Gen] ===== API ERROR DEBUG =====');
    console.error('[Image Gen] Status Code:', err?.response?.status);
    console.error('[Image Gen] Status Text:', err?.response?.statusText);
    console.error('[Image Gen] Response Headers:', JSON.stringify(err?.response?.headers, null, 2));
    console.error('[Image Gen] Error Data:', JSON.stringify(apiError, null, 2));
    console.error('[Image Gen] Request URL:', err?.config?.url);
    console.error('[Image Gen] ================================');
    const message = apiError?.detail?.error_message || apiError?.error_message || apiError?.message || err.message || 'giminigen request failed';
    throw new Error(message);
  }

  if (!data?.uuid) {
    throw new Error('giminigen did not return a job id');
  }

  return pollForResult(data.uuid);
}

// ============================================
// VIDEO MOTION PROMPT TEMPLATES - CATEGORY SPECIFIC
// ============================================

/**
 * Category-specific video motion presets
 * Each category has its own optimized animation styles
 */
const VIDEO_MOTION_PRESETS = {
  // ===== CLOTHES / FASHION =====
  clothes: {
    runway_walk: {
      id: 'runway_walk',
      name: 'Runway Walk',
      description: 'Model walks like on a fashion runway',
      prompt: 'Smooth runway walk, confident stride, subtle hip movement, fabric flowing naturally, professional lighting consistent, camera follows model smoothly, high-end fashion commercial, 4K cinematic, garment details visible throughout',
      recommended: true,
    },
    model_turn: {
      id: 'model_turn',
      name: 'Model Turn',
      description: '360° turn to show all angles',
      prompt: 'Graceful 360-degree turn on spot, fabric movement visible, smooth pivot, showing front, side, and back of garment, professional lighting maintained through rotation, fashion show quality',
      recommended: true,
    },
    subtle_pose: {
      id: 'subtle_pose',
      name: 'Subtle Movement',
      description: 'Gentle pose transitions',
      prompt: 'Minimal elegant movement, gentle weight shift, slight arm adjustment, breathing animation, maintaining fashion pose, professional model micro-movements, high-end lookbook style',
    },
    fabric_flow: {
      id: 'fabric_flow',
      name: 'Fabric in Motion',
      description: 'Highlight fabric movement',
      prompt: 'Dramatic fabric movement, wind-blown effect, material flowing and draping, showcasing texture and flow, editorial fashion aesthetic, slow motion fabric physics, premium commercial quality',
    },
  },

  // ===== SHOES / FOOTWEAR =====
  shoes: {
    walking_feet: {
      id: 'walking_feet',
      name: 'Walking Feet',
      description: 'Natural walking motion close-up',
      prompt: 'Focus on feet and legs, natural walking motion from low angle, each step clearly visible, shoe flex and movement shown, clean floor reflection, professional footwear commercial, steady tracking shot',
      recommended: true,
    },
    shoe_rotation: {
      id: 'shoe_rotation',
      name: '360° Rotation',
      description: 'Orbit around the shoe',
      prompt: 'Smooth 360-degree orbit around the shoe, revealing all angles, focus on design details and craftsmanship, professional product photography in motion, studio lighting, no model visible',
      recommended: true,
    },
    step_detail: {
      id: 'step_detail',
      name: 'Step Detail',
      description: 'Close-up stepping motion',
      prompt: 'Close-up shot of foot stepping forward, slow motion, sole flex visible, heel-to-toe motion, showcasing shoe performance and comfort, athletic commercial style',
    },
    lacing_focus: {
      id: 'lacing_focus',
      name: 'Lacing Focus',
      description: 'Zoom on lacing and details',
      prompt: 'Camera slowly zooms and pans across shoe details, focusing on lacing, stitching, material texture, tongue, and branding, macro product video style',
    },
  },

  // ===== BAGS / ACCESSORIES =====
  bags: {
    carry_walk: {
      id: 'carry_walk',
      name: 'Carry & Walk',
      description: 'Model walking with bag',
      prompt: 'Model walking naturally with bag, arm swing with bag visible, lifestyle context, bag moves realistically with body motion, fashion accessory commercial, focus on bag throughout',
      recommended: true,
    },
    bag_360: {
      id: 'bag_360',
      name: '360° Display',
      description: 'Full rotation product shot',
      prompt: 'Smooth 360-degree rotation of bag, floating or on display stand, studio lighting, showing all sides, hardware details, interior briefly visible, luxury product commercial',
      recommended: true,
    },
    open_close: {
      id: 'open_close',
      name: 'Open & Close',
      description: 'Show interior and closure',
      prompt: 'Hands opening bag to reveal interior, showing pockets and organization, then closing with click of clasp or zipper, luxury detail shot, close-up hands product video',
    },
    strap_adjust: {
      id: 'strap_adjust',
      name: 'Strap Adjustment',
      description: 'Adjusting shoulder strap',
      prompt: 'Model adjusting bag strap on shoulder, showing strap length and comfort, lifestyle natural movement, casual confident styling, fashion accessory lifestyle video',
    },
  },

  // ===== ACCESSORIES (Watches, Jewelry, etc.) =====
  accessories: {
    sparkle_reveal: {
      id: 'sparkle_reveal',
      name: 'Sparkle Reveal',
      description: 'Light catching details',
      prompt: 'Slow elegant movement, light catching on jewelry/watch surfaces, subtle sparkle effects, rotating to show facets and details, luxury commercial style, dramatic lighting',
      recommended: true,
    },
    wrist_gesture: {
      id: 'wrist_gesture',
      name: 'Wrist Gesture',
      description: 'Natural wrist/hand movement',
      prompt: 'Natural wrist and hand movement, watch or bracelet visible, elegant gestures, checking time or adjusting cuff, lifestyle context, premium accessory commercial',
      recommended: true,
    },
    zoom_detail: {
      id: 'zoom_detail',
      name: 'Zoom Detail',
      description: 'Macro zoom on details',
      prompt: 'Camera slowly zooms into product details, extreme close-up on craftsmanship, engravings, gemstones, mechanism, premium macro photography in motion',
    },
    floating_orbit: {
      id: 'floating_orbit',
      name: 'Floating Orbit',
      description: 'Product floating with camera orbit',
      prompt: 'Product floating in space with gentle rotation, camera orbiting slowly, dramatic rim lighting, luxury product video, clean dark background, jewelry commercial quality',
    },
  },
};

/**
 * Get motion presets for a specific category
 */
function getMotionPresetsForCategory(category) {
  const presets = VIDEO_MOTION_PRESETS[category];
  if (!presets) {
    return VIDEO_MOTION_PRESETS.clothes; // Fallback to clothes
  }
  return presets;
}

/**
 * Get default motion preset for category
 */
function getDefaultMotionPreset(category) {
  const presets = getMotionPresetsForCategory(category);
  const recommended = Object.values(presets).find(p => p.recommended);
  return recommended || Object.values(presets)[0];
}

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
 * @param {object} options - Additional options (category, motionStyle, etc.)
 * @returns {string} Optimized video prompt
 */
function buildVideoPrompt(userPrompt, options = {}) {
  const parts = [];
  const category = options.category || 'clothes';
  const motionStyleId = options.motionStyle;

  // 1. Core instruction - animate the static image
  parts.push('Transform this static fashion product image into a smooth, professional video.');

  // 2. Get motion preset based on category and selected style
  let motionPreset;

  // Get category-specific presets
  const categoryPresets = VIDEO_MOTION_PRESETS[category] || VIDEO_MOTION_PRESETS.clothes;

  // If a specific motion style was selected, use it
  if (motionStyleId && categoryPresets[motionStyleId]) {
    motionPreset = categoryPresets[motionStyleId];
  } else {
    // Fall back to recommended or first preset for this category
    motionPreset = Object.values(categoryPresets).find(p => p.recommended) || Object.values(categoryPresets)[0];
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
  // Poll with hard timeout to prevent hanging
  return withTimeout(
    pollForVideoResult(data.uuid),
    VIDEO_POLL_TIMEOUT_MS,
    'Video generation timed out after 5 minutes'
  );
}

module.exports = {
  generateImage,
  generateVideoFromImage,
  VIDEO_MOTION_PRESETS,
  getMotionPresetsForCategory,
  getDefaultMotionPreset,
};
