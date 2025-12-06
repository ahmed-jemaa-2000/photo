/**
 * Quality Validator - Production-grade prompt and config validation
 * 
 * Ensures prompts meet quality standards before sending to AI API
 */

const MINIMUM_PROMPT_LENGTH = 200;
const REQUIRED_SECTIONS = ['CRITICAL'];

/**
 * Validate a generated prompt for quality requirements
 * @param {string} prompt - The prompt to validate
 * @param {object} options - Validation options
 * @returns {object} { valid: boolean, issues: string[], score: number }
 */
function validatePrompt(prompt, options = {}) {
    const issues = [];
    let score = 100;

    // Check minimum length
    if (prompt.length < MINIMUM_PROMPT_LENGTH) {
        issues.push(`Prompt too short (${prompt.length} chars, min: ${MINIMUM_PROMPT_LENGTH})`);
        score -= 20;
    }

    // Check for CRITICAL section
    if (!prompt.includes('CRITICAL')) {
        issues.push('Missing CRITICAL section - color/design preservation may fail');
        score -= 30;
    }

    // Check for color lock if color provided
    if (options.colorHex && !prompt.includes(options.colorHex)) {
        issues.push(`Color lock not applied: ${options.colorHex} not found in prompt`);
        score -= 25;
    }

    // Check for category-specific keywords
    if (options.category) {
        const categoryKeywords = {
            clothes: ['garment', 'fabric', 'outfit'],
            shoes: ['footwear', 'shoe', 'sole'],
            bags: ['bag', 'hardware', 'strap'],
            accessories: ['accessory', 'jewelry', 'detail']
        };

        const keywords = categoryKeywords[options.category] || [];
        const hasKeyword = keywords.some(kw => prompt.toLowerCase().includes(kw));

        if (!hasKeyword) {
            issues.push(`Category-specific keywords missing for: ${options.category}`);
            score -= 10;
        }
    }

    // Check negative prompt section
    if (!prompt.includes('Negative prompt:') && !prompt.includes('Avoid:')) {
        issues.push('Missing negative prompt section');
        score -= 10;
    }

    // Quality warnings (non-critical)
    if (!prompt.includes('photorealistic') && !prompt.includes('Photorealistic')) {
        issues.push('Consider adding photorealistic quality requirement');
        score -= 5;
    }

    return {
        valid: score >= 70,
        issues,
        score: Math.max(0, score),
        promptLength: prompt.length
    };
}

/**
 * Validate configuration completeness
 * @param {object} config - Configuration object
 * @param {string} category - Category to validate
 * @returns {object} { valid: boolean, missing: string[] }
 */
function validateConfig(config, category) {
    const required = {
        clothes: ['MODELS', 'POSE_PROMPTS', 'BACKGROUNDS'],
        shoes: ['SHOE_MODELS', 'SHOE_CAMERA_ANGLES', 'SHOE_LIGHTING_STYLES', 'BACKGROUNDS'],
        bags: ['BAG_STYLES', 'BAG_DISPLAY_MODES', 'BAG_CAMERA_ANGLES', 'BAG_LIGHTING_OPTIONS'],
        accessories: ['ACCESSORY_TYPES', 'ACCESSORY_SHOT_TYPES', 'ACCESSORY_LIGHTING_OPTIONS']
    };

    const requiredKeys = required[category] || [];
    const missing = requiredKeys.filter(key => !config[key] || config[key].length === 0);

    return {
        valid: missing.length === 0,
        missing,
        category
    };
}

/**
 * Generate a quality report for debugging
 * @param {object} promptBuilder - PromptBuilder instance
 * @returns {object} Quality report
 */
function generateQualityReport(promptBuilder) {
    const fullPrompt = promptBuilder.build();
    const sections = promptBuilder.debug();

    return {
        totalLength: fullPrompt.length,
        tokenEstimate: promptBuilder.getTokenEstimate(),
        sections: {
            critical: sections.critical.length,
            important: sections.important.length,
            supporting: sections.supporting.length,
            context: sections.context.length,
            negative: sections.negative.length
        },
        validation: validatePrompt(fullPrompt, {
            category: promptBuilder.category,
            colorHex: promptBuilder.colorPalette[0]?.hex
        }),
        timestamp: new Date().toISOString()
    };
}

/**
 * Log quality metrics for production monitoring
 * @param {string} requestId - Request identifier
 * @param {object} report - Quality report
 */
function logQualityMetrics(requestId, report) {
    console.log(`[Quality] [${requestId}] Prompt length: ${report.totalLength}, Score: ${report.validation.score}/100`);

    if (report.validation.issues.length > 0) {
        console.warn(`[Quality] [${requestId}] Issues:`, report.validation.issues);
    }
}

module.exports = {
    validatePrompt,
    validateConfig,
    generateQualityReport,
    logQualityMetrics,
    MINIMUM_PROMPT_LENGTH,
    REQUIRED_SECTIONS
};
