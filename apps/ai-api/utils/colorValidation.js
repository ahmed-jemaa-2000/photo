/**
 * Color Validation Utility
 * 
 * Validates that generated image color matches expected product color
 * Uses Delta E color difference calculation for accurate comparison
 */

const axios = require('axios');

/**
 * Color difference tolerance levels
 */
const COLOR_TOLERANCE = {
    PERFECT: 2,      // Imperceptible difference
    ACCEPTABLE: 5,   // Slight difference, OK for most uses
    NOTICEABLE: 10,  // Noticeable but acceptable
    WARNING: 20,     // Significant difference - should warn user
    FAILURE: 40,     // Severe mismatch - likely wrong color
};

/**
 * Convert hex to Lab color space for accurate comparison
 * Lab is designed to match human perception of color
 */
function hexToLab(hex) {
    // First convert to RGB
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    // Then RGB to XYZ
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    // Gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    r *= 100;
    g *= 100;
    b *= 100;

    // Observer = 2°, Illuminant = D65
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    // XYZ to Lab
    let xn = x / 95.047;
    let yn = y / 100.000;
    let zn = z / 108.883;

    xn = xn > 0.008856 ? Math.pow(xn, 1 / 3) : (7.787 * xn) + (16 / 116);
    yn = yn > 0.008856 ? Math.pow(yn, 1 / 3) : (7.787 * yn) + (16 / 116);
    zn = zn > 0.008856 ? Math.pow(zn, 1 / 3) : (7.787 * zn) + (16 / 116);

    return {
        L: (116 * yn) - 16,
        a: 500 * (xn - yn),
        b: 200 * (yn - zn)
    };
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
 * Calculate Delta E (CIE76) - perceptual color difference
 * Values:
 * 0-2: Imperceptible
 * 2-5: Slight difference
 * 5-10: Noticeable
 * 10-20: Big difference
 * 20+: Very different colors
 */
function calculateDeltaE(hex1, hex2) {
    const lab1 = hexToLab(hex1);
    const lab2 = hexToLab(hex2);

    if (!lab1 || !lab2) {
        return { deltaE: 100, error: 'Invalid hex color' };
    }

    const deltaE = Math.sqrt(
        Math.pow(lab1.L - lab2.L, 2) +
        Math.pow(lab1.a - lab2.a, 2) +
        Math.pow(lab1.b - lab2.b, 2)
    );

    return {
        deltaE: Math.round(deltaE * 100) / 100,
        lab1,
        lab2
    };
}

/**
 * Get human-readable assessment of color difference
 */
function getColorDifferenceAssessment(deltaE) {
    if (deltaE <= COLOR_TOLERANCE.PERFECT) {
        return {
            level: 'perfect',
            message: 'Color match is perfect',
            icon: '✅',
            shouldWarn: false
        };
    }
    if (deltaE <= COLOR_TOLERANCE.ACCEPTABLE) {
        return {
            level: 'acceptable',
            message: 'Color match is excellent',
            icon: '✅',
            shouldWarn: false
        };
    }
    if (deltaE <= COLOR_TOLERANCE.NOTICEABLE) {
        return {
            level: 'noticeable',
            message: 'Slight color variation detected',
            icon: '⚠️',
            shouldWarn: false
        };
    }
    if (deltaE <= COLOR_TOLERANCE.WARNING) {
        return {
            level: 'warning',
            message: 'Color differs from expected - may need regeneration',
            icon: '⚠️',
            shouldWarn: true
        };
    }
    return {
        level: 'failure',
        message: 'Significant color mismatch detected',
        icon: '❌',
        shouldWarn: true
    };
}

/**
 * Validate color match between expected and actual
 * @param {string} expectedHex - Expected product color (hex)
 * @param {string} actualHex - Color detected in generated image (hex)
 * @returns {object} Validation result
 */
function validateColorMatch(expectedHex, actualHex) {
    const { deltaE, error } = calculateDeltaE(expectedHex, actualHex);

    if (error) {
        return {
            valid: false,
            error,
            deltaE: null
        };
    }

    const assessment = getColorDifferenceAssessment(deltaE);

    return {
        valid: !assessment.shouldWarn,
        deltaE,
        expectedHex,
        actualHex,
        assessment,
        tolerances: COLOR_TOLERANCE
    };
}

/**
 * Check if a color is likely White (for special validation)
 */
function isWhiteColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;

    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const lightness = (max + min) / 2 / 255;
    const saturation = max === min ? 0 : (max - min) / (max + min > 255 ? (510 - max - min) : (max + min));

    return lightness > 0.85 && saturation < 0.15;
}

/**
 * Check if a color is likely Black
 */
function isBlackColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;

    const lightness = (rgb.r + rgb.g + rgb.b) / 3 / 255;
    return lightness < 0.15;
}

/**
 * Special validation for white products
 * White is often misinterpreted as cream, beige, or gray
 */
function validateWhiteProduct(actualHex) {
    const isActuallyWhite = isWhiteColor(actualHex);

    if (isActuallyWhite) {
        return {
            valid: true,
            message: 'White product color preserved correctly',
            assessment: { level: 'perfect', icon: '✅' }
        };
    }

    // Check for common white misinterpretations
    const lab = hexToLab(actualHex);
    if (!lab) return { valid: false, message: 'Could not analyze color' };

    // Check if it's cream/beige (yellowish-warm white)
    if (lab.L > 80 && lab.b > 10) {
        return {
            valid: false,
            message: 'Product appears cream/beige instead of white',
            suggestion: 'Try regenerating with manual "White" color override',
            assessment: { level: 'warning', icon: '⚠️' }
        };
    }

    // Check if it's gray (desaturated white)
    if (lab.L > 50 && lab.L < 85 && Math.abs(lab.a) < 5 && Math.abs(lab.b) < 5) {
        return {
            valid: false,
            message: 'Product appears gray instead of white',
            suggestion: 'Try regenerating with "Brighter lighting" style',
            assessment: { level: 'warning', icon: '⚠️' }
        };
    }

    return {
        valid: false,
        message: 'White product color was not preserved',
        assessment: { level: 'failure', icon: '❌' }
    };
}

module.exports = {
    validateColorMatch,
    calculateDeltaE,
    getColorDifferenceAssessment,
    isWhiteColor,
    isBlackColor,
    validateWhiteProduct,
    hexToRgb,
    hexToLab,
    COLOR_TOLERANCE
};
