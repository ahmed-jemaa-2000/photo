/**
 * Ad Creative Service - Universal Prompt Builder
 * Generates marketing-ready visuals for any product category
 */

const {
    PRODUCT_CATEGORIES,
    OUTPUT_FORMATS,
    BRAND_STYLES,
    MOOD_LIBRARY,
    TARGET_AUDIENCES
} = require('../config/adCreativeConfig');

// ============================================
// QUALITY ENHANCEMENT CONSTANTS
// ============================================

const AD_QUALITY_BOOST = [
    'professional advertising photography',
    'commercial campaign quality',
    'agency-level production value',
    'perfect sharp focus on product',
    '8K ultra high resolution',
    'color managed for print and digital',
    'clean crisp edges suitable for compositing',
    'professional color grading',
    'no lens distortion',
    'product hero shot'
].join(', ');

// ============================================
// NEGATIVE PROMPTS FOR QUALITY CONTROL
// ============================================

const AD_NEGATIVE_PROMPTS = [
    'blurry images',
    'low quality',
    'amateur photography',
    'cluttered backgrounds',
    'distracting elements',
    'wrong aspect ratio',
    'watermarks',
    'stock photo clichés',
    'overexposed',
    'underexposed',
    'noisy grainy image',
    'artifacts',
    'distorted product',
    'text unless specifically requested',
    'logos unless on original product',
    'poor lighting',
    'unflattering angles'
].join(', ');

// ============================================
// PROMPT BUILDER - MAIN FUNCTION
// ============================================

/**
 * Build the master prompt for ad creative generation
 * @param {Object} options - Generation options
 * @returns {Object} { prompt, aspectRatio, style }
 */
function buildAdCreativePrompt({
    category = 'other',
    outputFormat = 'facebook_feed',
    brandStyle = 'premium_minimal',
    mood = 'fresh_clean',
    brandColors = null,
    targetAudience = null,
    embedText = false,
    textContent = null,
    referenceStyleNotes = null,
    customInstructions = null,
    productDescription = null
}) {
    const parts = [];

    // Get configurations
    const categoryConfig = PRODUCT_CATEGORIES[category] || PRODUCT_CATEGORIES.other;
    const formatConfig = OUTPUT_FORMATS[outputFormat] || OUTPUT_FORMATS.facebook_feed;
    const styleConfig = BRAND_STYLES[brandStyle] || BRAND_STYLES.premium_minimal;
    const moodConfig = MOOD_LIBRARY[mood] || MOOD_LIBRARY.fresh_clean;

    // ===== 1. CORE INSTRUCTION - What we're creating =====
    parts.push(
        `Create a professional advertising hero photograph for a ${categoryConfig.keywords} product.`
    );

    // If user provided product description, include it
    if (productDescription) {
        parts.push(`Product details: ${productDescription}.`);
    }

    // ===== 2. FORMAT-SPECIFIC COMPOSITION =====
    parts.push(
        `Output format: ${formatConfig.dimensions.width}x${formatConfig.dimensions.height} pixels (${formatConfig.aspectRatio} aspect ratio).`
    );
    parts.push(`Composition requirement: ${formatConfig.composition}`);

    // ===== 3. BRAND STYLE =====
    parts.push(`Visual style: ${styleConfig.prompt}`);

    // ===== 4. MOOD/ATMOSPHERE =====
    parts.push(`Mood and atmosphere: ${moodConfig.prompt}`);

    // ===== 5. BRAND COLORS (if provided) =====
    if (brandColors?.primary) {
        const colorInstructions = [];
        colorInstructions.push(`primary brand color ${brandColors.primary}`);
        if (brandColors.secondary) {
            colorInstructions.push(`secondary color ${brandColors.secondary}`);
        }
        if (brandColors.accent) {
            colorInstructions.push(`accent color ${brandColors.accent}`);
        }
        parts.push(
            `Incorporate brand colors as subtle accents: ${colorInstructions.join(', ')}. ` +
            'Use these in background gradients, lighting tints, or subtle props - do not alter the product\'s original colors.'
        );
    }

    // ===== 6. TARGET AUDIENCE TONE (if provided) =====
    if (targetAudience) {
        const audienceConfig = TARGET_AUDIENCES[targetAudience];
        if (audienceConfig) {
            parts.push(
                `Visual tone should appeal to: ${audienceConfig.description} (age ${audienceConfig.ageRange}).`
            );
        } else {
            parts.push(`Visual tone should appeal to: ${targetAudience}.`);
        }
    }

    // ===== 7. TEXT HANDLING - CRITICAL =====
    if (!embedText) {
        // DEFAULT: Leave clean zones for post-production text overlay
        const zoneDescription = {
            'left': 'left side of the image',
            'top': 'top area of the image',
            'top-bottom': 'top and bottom areas of the image',
            'right': 'right side of the image'
        };
        const zoneText = zoneDescription[formatConfig.textZone] || 'designated text zone';

        parts.push(
            `CRITICAL: Leave clean negative space in the ${zoneText} for text overlay in post-production. ` +
            'Do NOT render any text, typography, headlines, logos, watermarks, or marketing copy in the generated image. ' +
            'Product packaging labels and original branding on the product are acceptable, but NO additional text elements. ' +
            'The background in the text zone should be clean and uniform enough for text to be readable when added later.'
        );
    } else if (textContent) {
        // User explicitly wants text embedded in the image
        const textInstructions = [];

        if (textContent.headline) {
            textInstructions.push(
                `Bold headline "${textContent.headline}" in prominent typography at the ${formatConfig.textZone} zone`
            );
        }
        if (textContent.subheadline) {
            textInstructions.push(`Subheadline "${textContent.subheadline}" in lighter weight below the headline`);
        }
        if (textContent.offer) {
            textInstructions.push(`Offer text "${textContent.offer}" in a badge or banner style`);
        }
        if (textContent.cta) {
            textInstructions.push(`CTA button "${textContent.cta}" in the brand accent color`);
        }

        if (textInstructions.length > 0) {
            parts.push(`EMBED the following text elements in the image: ${textInstructions.join('. ')}. ` +
                'Ensure text is legible, properly contrasted, and professionally typeset.');
        }
    }

    // ===== 8. REFERENCE STYLE MATCHING (if provided) =====
    if (referenceStyleNotes) {
        parts.push(
            `Style reference guidance: Match the composition style, lighting mood, color palette, and overall aesthetic ` +
            `of the reference: "${referenceStyleNotes}". ` +
            'Create an ORIGINAL composition - do NOT copy any logos, brand names, text, exact layouts, or protected elements. ' +
            'Capture only the visual "spirit" and aesthetic approach without replicating specific designs.'
        );
    }

    // ===== 9. CUSTOM INSTRUCTIONS (if provided) =====
    if (customInstructions) {
        parts.push(`Additional creative requirements: ${customInstructions}`);
    }

    // ===== 10. PRODUCT PRESERVATION =====
    parts.push(
        'IMPORTANT: Preserve the exact appearance of the uploaded product - same colors, design, logos, text on packaging, ' +
        'and all details. Do not alter, recolor, or modify the product itself. The product must be the hero of the image.'
    );

    // ===== 11. QUALITY BOOST =====
    parts.push(AD_QUALITY_BOOST);

    // ===== 12. NEGATIVE PROMPTS =====
    parts.push(`AVOID: ${AD_NEGATIVE_PROMPTS}.`);

    // Build final prompt
    const prompt = parts.join(' ');

    return {
        prompt,
        aspectRatio: formatConfig.aspectRatio,
        style: 'Photorealistic',
        dimensions: formatConfig.dimensions
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all available presets for frontend
 * @returns {Object} All preset configurations
 */
function getAdCreativePresets() {
    return {
        categories: Object.values(PRODUCT_CATEGORIES),
        formats: Object.values(OUTPUT_FORMATS),
        styles: Object.values(BRAND_STYLES),
        moods: Object.values(MOOD_LIBRARY),
        audiences: Object.values(TARGET_AUDIENCES)
    };
}

/**
 * Get default options for a product category
 * @param {string} categoryId - Category ID
 * @returns {Object} Default style and mood for the category
 */
function getCategoryDefaults(categoryId) {
    const category = PRODUCT_CATEGORIES[categoryId];
    if (!category) {
        return { style: 'premium_minimal', mood: 'fresh_clean' };
    }

    // Map default styles to appropriate moods
    const styleMoodMap = {
        'bold_energetic': 'energizing',
        'premium_minimal': 'fresh_clean',
        'organic_natural': 'calming',
        'tech_modern': 'mysterious',
        'professional_trust': 'fresh_clean',
        'luxury_dark': 'luxurious',
        'playful_colorful': 'vibrant_joyful',
        'warm_lifestyle': 'warm_cozy'
    };

    return {
        style: category.defaultStyle || 'premium_minimal',
        mood: styleMoodMap[category.defaultStyle] || 'fresh_clean'
    };
}

/**
 * Validate generation options
 * @param {Object} options - Options to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateAdCreativeOptions(options) {
    const errors = [];

    // Validate category
    if (options.category && !PRODUCT_CATEGORIES[options.category]) {
        errors.push(`Invalid category: ${options.category}`);
    }

    // Validate format
    if (options.outputFormat && !OUTPUT_FORMATS[options.outputFormat]) {
        errors.push(`Invalid output format: ${options.outputFormat}`);
    }

    // Validate style
    if (options.brandStyle && !BRAND_STYLES[options.brandStyle]) {
        errors.push(`Invalid brand style: ${options.brandStyle}`);
    }

    // Validate mood
    if (options.mood && !MOOD_LIBRARY[options.mood]) {
        errors.push(`Invalid mood: ${options.mood}`);
    }

    // Validate brand colors format
    if (options.brandColors?.primary) {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexRegex.test(options.brandColors.primary)) {
            errors.push('Invalid primary brand color format. Use hex format like #FF5722');
        }
        if (options.brandColors.secondary && !hexRegex.test(options.brandColors.secondary)) {
            errors.push('Invalid secondary brand color format. Use hex format like #FFC107');
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    buildAdCreativePrompt,
    getAdCreativePresets,
    getCategoryDefaults,
    validateAdCreativeOptions,
    // Re-export configs for direct access if needed
    PRODUCT_CATEGORIES,
    OUTPUT_FORMATS,
    BRAND_STYLES,
    MOOD_LIBRARY,
    TARGET_AUDIENCES
};
