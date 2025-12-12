/**
 * Ad Creative Service
 * Professional Marketing Poster Prompt Builder
 * 
 * Builds sophisticated AI prompts that generate
 * professional marketing posters comparable to
 * Freepik/Envato templates
 */

const {
    DESIGN_TEMPLATES,
    DECORATIVE_ELEMENTS,
    COMPOSITION_STYLES,
    TYPOGRAPHY_STYLES,
    COLOR_SCHEMES,
    OUTPUT_FORMATS,
    PRODUCT_CATEGORIES,
    getAdCreativePresets,
} = require('../config/adCreativeConfig');

// ============================================
// PROMPT BUILDER ENGINE
// ============================================

/**
 * Build a comprehensive AI prompt for professional poster generation
 * @param {Object} options - User configuration options
 * @returns {Object} - Complete prompt data with metadata
 */
function buildAdCreativePrompt(options) {
    const {
        // Required
        productCategory = 'other',
        outputFormat = 'instagram_feed',

        // Design choices
        designTemplate = 'modern_gradient',
        compositionStyle = 'subject_center',
        typographyStyle = 'modern_clean',

        // Colors
        colorScheme = 'royal_blue',
        customColors = null,

        // Decorative elements (array of IDs)
        decorativeElements = [],

        // Text content for zones (optional)
        textContent = null,

        // Additional options
        targetAudience = null,
        customInstructions = null,

        // Reference image handling
        useReferenceStyle = false,
    } = options;

    const promptSections = [];

    // ========================================
    // 1. OPENING - Set the stage
    // ========================================
    promptSections.push(`
        Create a stunning professional marketing poster design.
        This should look like a premium template from Freepik or Envato.
        Ultra high quality, 8K resolution, professional advertising photography.
    `.trim());

    // ========================================
    // 2. DESIGN TEMPLATE - Core visual style
    // ========================================
    const template = DESIGN_TEMPLATES[designTemplate];
    if (template) {
        promptSections.push(`
            DESIGN STYLE:
            ${template.promptBase}
        `.trim());
    }

    // ========================================
    // 3. COMPOSITION - Layout and structure
    // ========================================
    const composition = COMPOSITION_STYLES[compositionStyle];
    if (composition) {
        promptSections.push(`
            LAYOUT & COMPOSITION:
            ${composition.prompt}
        `.trim());
    }

    // ========================================
    // 4. COLOR PALETTE - Brand colors
    // ========================================
    let activeColors = customColors;
    if (!activeColors && colorScheme !== 'custom') {
        const scheme = COLOR_SCHEMES[colorScheme];
        if (scheme?.colors) {
            activeColors = scheme.colors;
        }
    }

    if (activeColors) {
        promptSections.push(`
            COLOR PALETTE:
            Apply this color scheme throughout the design:
            - PRIMARY COLOR: ${activeColors.primary} (main brand color for key elements, gradients, shapes)
            - SECONDARY COLOR: ${activeColors.secondary} (backgrounds, large areas, contrast)
            - ACCENT COLOR: ${activeColors.accent} (highlights, decorative elements, small details)
            Ensure the product's original colors are preserved - apply palette to decorative elements and background only.
        `.trim());
    }

    // ========================================
    // 5. DECORATIVE ELEMENTS - Visual flair
    // ========================================
    const activeDecorations = decorativeElements.filter(id => id !== 'none');
    if (activeDecorations.length > 0) {
        const decorationPrompts = activeDecorations.map(elemId => {
            const elem = DECORATIVE_ELEMENTS[elemId];
            return elem?.prompt || '';
        }).filter(Boolean);

        if (decorationPrompts.length > 0) {
            promptSections.push(`
                DECORATIVE ELEMENTS:
                ${decorationPrompts.join('\n                ')}
            `.trim());
        }
    }

    // ========================================
    // 6. TYPOGRAPHY ZONES - Text areas
    // ========================================
    const typography = TYPOGRAPHY_STYLES[typographyStyle];
    if (typography) {
        promptSections.push(`
            TYPOGRAPHY STYLE:
            ${typography.prompt}
        `.trim());
    }

    // ========================================
    // 7. TEXT CONTENT ZONES - Clean areas for text overlay
    // ========================================
    if (textContent && Object.values(textContent).some(v => v)) {
        const textZones = [];

        if (textContent.headline) {
            textZones.push(`- Large prominent HEADLINE zone for: "${textContent.headline}" (most important, largest text area)`);
        }
        if (textContent.subheadline) {
            textZones.push(`- SUBHEADLINE zone below headline for: "${textContent.subheadline}" (supporting text)`);
        }
        if (textContent.offer) {
            textZones.push(`- OFFER BADGE zone for: "${textContent.offer}" (eye-catching badge or sticker shape)`);
        }
        if (textContent.cta) {
            textZones.push(`- CTA BUTTON zone for: "${textContent.cta}" (action button shape at bottom)`);
        }
        if (textContent.contact) {
            textZones.push(`- CONTACT INFO zone for: "${textContent.contact}" (small footer area)`);
        }

        if (textZones.length > 0) {
            promptSections.push(`
                TEXT PLACEMENT ZONES (leave clean readable negative space for these elements):
                ${textZones.join('\n                ')}
                
                IMPORTANT: Do NOT render actual text characters in the image.
                Instead, leave clean, well-composed negative space areas where text can be added in post-production.
                These zones should have good contrast for text overlay.
            `.trim());
        }
    } else {
        promptSections.push(`
            TEXT ZONES:
            Leave clean negative space areas suitable for headline, subheadline, and call-to-action text overlay.
            Do NOT render any text in the image - keep areas clean for post-production text addition.
        `.trim());
    }

    // ========================================
    // 8. PRODUCT CATEGORY HINTS
    // ========================================
    const category = PRODUCT_CATEGORIES[productCategory];
    if (category) {
        promptSections.push(`
            PRODUCT CONTEXT:
            This is a ${category.name.en} product.
            ${category.promptHints ? `Product hints: ${category.promptHints}` : ''}
            Ensure the product is the hero of the composition.
            Preserve the product's original appearance, colors, and details exactly.
        `.trim());
    }

    // ========================================
    // 9. TARGET AUDIENCE (if specified)
    // ========================================
    if (targetAudience) {
        promptSections.push(`
            TARGET AUDIENCE:
            Design should appeal to: ${targetAudience}
            Adjust visual elements, energy level, and aesthetic to resonate with this demographic.
        `.trim());
    }

    // ========================================
    // 10. CUSTOM INSTRUCTIONS (if any)
    // ========================================
    if (customInstructions) {
        promptSections.push(`
            ADDITIONAL REQUIREMENTS:
            ${customInstructions}
        `.trim());
    }

    // ========================================
    // 11. OUTPUT FORMAT SPECS
    // ========================================
    const format = OUTPUT_FORMATS[outputFormat];
    if (format) {
        promptSections.push(`
            OUTPUT SPECIFICATIONS:
            Aspect Ratio: ${format.aspectRatio}
            Dimensions: ${format.dimensions.width}x${format.dimensions.height}px
            Platform optimized for: ${format.platform}
            Ensure composition works perfectly for this format.
        `.trim());
    }

    // ========================================
    // 12. QUALITY GUARANTEES & NEGATIVE PROMPTS
    // ========================================
    promptSections.push(`
        ESSENTIAL QUALITY REQUIREMENTS:
        - Professional advertising photography quality
        - Ultra sharp, crisp edges on all elements
        - Perfect lighting with professional shadows
        - Clean separation between design elements
        - Print-ready color accuracy and vibrancy
        - Product must be perfectly preserved and recognizable
        - Social media advertising ready
        - Magazine quality finish
        
        STRICTLY AVOID:
        - Any rendered text, letters, numbers, or words
        - Blurry or low-quality elements
        - Amateur or clip-art looking graphics
        - Cluttered or unbalanced composition
        - Watermarks or stock photo artifacts
        - Distorted or altered product appearance
        - Muddy colors or poor contrast
        - Generic or boring layouts
    `.trim());

    // ========================================
    // BUILD FINAL PROMPT
    // ========================================
    const finalPrompt = promptSections.join('\n\n');

    // Return complete data
    return {
        prompt: finalPrompt,
        format: outputFormat,
        aspectRatio: format?.aspectRatio || '1:1',
        dimensions: format?.dimensions || { width: 1080, height: 1080 },
        metadata: {
            designTemplate,
            compositionStyle,
            typographyStyle,
            colorScheme,
            decorativeElements: activeDecorations,
            productCategory,
            textContent: textContent || null,
        }
    };
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate ad creative options before generation
 */
function validateAdCreativeOptions(options) {
    const errors = [];

    // Required fields
    if (!options.productCategory) {
        errors.push('Product category is required');
    }

    if (!options.outputFormat) {
        errors.push('Output format is required');
    }

    // Validate design template
    if (options.designTemplate && !DESIGN_TEMPLATES[options.designTemplate]) {
        errors.push(`Invalid design template: ${options.designTemplate}`);
    }

    // Validate composition style
    if (options.compositionStyle && !COMPOSITION_STYLES[options.compositionStyle]) {
        errors.push(`Invalid composition style: ${options.compositionStyle}`);
    }

    // Validate output format
    if (options.outputFormat && !OUTPUT_FORMATS[options.outputFormat]) {
        errors.push(`Invalid output format: ${options.outputFormat}`);
    }

    // Validate decorative elements
    if (options.decorativeElements && Array.isArray(options.decorativeElements)) {
        options.decorativeElements.forEach(elemId => {
            if (!DECORATIVE_ELEMENTS[elemId]) {
                errors.push(`Invalid decorative element: ${elemId}`);
            }
        });
    }

    // Validate custom colors format
    if (options.customColors) {
        const colorRegex = /^#[0-9A-Fa-f]{6}$/;
        ['primary', 'secondary', 'accent'].forEach(key => {
            if (options.customColors[key] && !colorRegex.test(options.customColors[key])) {
                errors.push(`Invalid custom color format for ${key}: ${options.customColors[key]}`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================
// HELPERS
// ============================================

/**
 * Get suggested templates for a product category
 */
function getSuggestedTemplates(categoryId) {
    const category = PRODUCT_CATEGORIES[categoryId];
    if (!category) return [];

    return (category.suggestedTemplates || []).map(templateId => {
        const template = DESIGN_TEMPLATES[templateId];
        return template || null;
    }).filter(Boolean);
}

/**
 * Get complete category defaults
 */
function getCategoryDefaults(categoryId) {
    const category = PRODUCT_CATEGORIES[categoryId];
    if (!category) {
        return {
            designTemplate: 'modern_gradient',
            colorScheme: 'royal_blue',
            decorativeElements: ['gradient_waves'],
        };
    }

    const suggestedTemplate = category.suggestedTemplates?.[0] || 'modern_gradient';
    const template = DESIGN_TEMPLATES[suggestedTemplate];

    return {
        designTemplate: suggestedTemplate,
        colorScheme: template?.colorSuggestion ? 'custom' : 'royal_blue',
        customColors: template?.colorSuggestion || null,
        decorativeElements: template?.decorativeSuggestions || [],
        compositionStyle: template?.compositionSuggestion || 'subject_center',
    };
}

/**
 * Build a quick preview prompt (shorter version for thumbnails)
 */
function buildQuickPreviewPrompt(designTemplateId, colorSchemeId) {
    const template = DESIGN_TEMPLATES[designTemplateId];
    const scheme = COLOR_SCHEMES[colorSchemeId];

    if (!template) return 'Professional marketing poster design';

    const colors = scheme?.colors ?
        `Colors: ${scheme.colors.primary}, ${scheme.colors.secondary}` : '';

    return `${template.promptBase}\n${colors}`;
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    buildAdCreativePrompt,
    validateAdCreativeOptions,
    getSuggestedTemplates,
    getCategoryDefaults,
    buildQuickPreviewPrompt,
    getAdCreativePresets,
};
