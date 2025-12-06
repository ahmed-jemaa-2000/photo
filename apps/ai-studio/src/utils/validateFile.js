/**
 * File validation utilities for image uploads
 * Provides comprehensive client-side validation before upload
 */

// Configuration
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_SIZE = 5 * 1024; // 5KB minimum
const MIN_DIMENSION = 256; // Minimum width/height in pixels
const MAX_DIMENSION = 8192; // Maximum width/height in pixels
const RECOMMENDED_MIN_DIMENSION = 512; // Recommended minimum for best results

/**
 * Gets the dimensions of an image file
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>}
 */
function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(url);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/**
 * Formats file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates an image file before upload
 * 
 * @param {File} file - The file to validate
 * @returns {Promise<{
 *   valid: boolean,
 *   error?: string,
 *   warnings?: string[],
 *   info?: {
 *     dimensions: {width: number, height: number},
 *     size: string,
 *     type: string
 *   }
 * }>}
 */
export async function validateImageFile(file) {
    const warnings = [];

    // 1. Check file exists
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    // 2. Check file type by MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
        const friendlyTypes = ALLOWED_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ');
        return {
            valid: false,
            error: `Invalid file type. Supported formats: ${friendlyTypes}`
        };
    }

    // 3. Check file size - too large
    if (file.size > MAX_SIZE) {
        return {
            valid: false,
            error: `File too large (${formatFileSize(file.size)}). Maximum size: ${formatFileSize(MAX_SIZE)}`
        };
    }

    // 4. Check file size - too small (warn)
    if (file.size < MIN_SIZE) {
        return {
            valid: false,
            error: `File too small (${formatFileSize(file.size)}). Image may be corrupted or very low quality.`
        };
    }

    if (file.size < 50 * 1024) { // Less than 50KB
        warnings.push('Small file size may result in lower quality output');
    }

    // 5. Check image dimensions
    let dimensions;
    try {
        dimensions = await getImageDimensions(file);
    } catch (err) {
        return {
            valid: false,
            error: 'Could not read image. File may be corrupted.'
        };
    }

    // Too small
    if (dimensions.width < MIN_DIMENSION || dimensions.height < MIN_DIMENSION) {
        return {
            valid: false,
            error: `Image too small (${dimensions.width}×${dimensions.height}px). Minimum: ${MIN_DIMENSION}×${MIN_DIMENSION}px`
        };
    }

    // Too large (will be resized, but warn)
    if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
        warnings.push(`Large image (${dimensions.width}×${dimensions.height}px) will be resized for processing`);
    }

    // Below recommended size
    if (dimensions.width < RECOMMENDED_MIN_DIMENSION || dimensions.height < RECOMMENDED_MIN_DIMENSION) {
        warnings.push(`For best results, use images at least ${RECOMMENDED_MIN_DIMENSION}×${RECOMMENDED_MIN_DIMENSION}px`);
    }

    // Check aspect ratio (warn if extreme)
    const ratio = dimensions.width / dimensions.height;
    if (ratio > 4) {
        warnings.push('Very wide image - some parts may be cropped');
    } else if (ratio < 0.25) {
        warnings.push('Very tall image - some parts may be cropped');
    }

    // 6. Check file name for potential issues
    const fileName = file.name.toLowerCase();
    if (fileName.includes('screenshot')) {
        warnings.push('Screenshots may have lower quality than original photos');
    }

    return {
        valid: true,
        warnings: warnings.length > 0 ? warnings : undefined,
        info: {
            dimensions,
            size: formatFileSize(file.size),
            type: file.type.split('/')[1].toUpperCase()
        }
    };
}

/**
 * Quick validation for file type only (for drag detection)
 * @param {File} file
 * @returns {boolean}
 */
export function isValidImageType(file) {
    return file && ALLOWED_TYPES.includes(file.type);
}

/**
 * Get friendly file type from MIME type
 * @param {string} mimeType
 * @returns {string}
 */
export function getFriendlyType(mimeType) {
    const typeMap = {
        'image/jpeg': 'JPEG',
        'image/jpg': 'JPEG',
        'image/png': 'PNG',
        'image/webp': 'WebP',
    };
    return typeMap[mimeType] || 'Image';
}

export { ALLOWED_TYPES, MAX_SIZE, MIN_DIMENSION, MAX_DIMENSION };
