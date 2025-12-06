const { Jimp } = require('jimp');

/**
 * Convert RGB to hex color
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Calculate Euclidean distance between two RGB colors
 */
function colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

/**
 * K-means clustering for color quantization
 */
function kMeansClustering(pixels, k = 5, maxIterations = 20) {
    if (pixels.length === 0) return [];

    const clusterCount = Math.max(1, Math.min(k, pixels.length));

    // Initialize centroids
    const centroids = [];
    const step = Math.max(1, Math.floor(pixels.length / clusterCount));
    for (let i = 0; i < clusterCount; i++) {
        const idx = Math.min(i * step, pixels.length - 1);
        centroids.push({ ...pixels[idx] });
    }

    let iterations = 0;
    let hasConverged = false;
    let finalClusters = null;

    while (!hasConverged && iterations < maxIterations) {
        const clusters = Array.from({ length: clusterCount }, () => []);

        pixels.forEach(pixel => {
            let minDist = Infinity;
            let closestCluster = 0;
            centroids.forEach((centroid, i) => {
                const dist = colorDistance(pixel, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    closestCluster = i;
                }
            });
            clusters[closestCluster].push(pixel);
        });

        finalClusters = clusters;
        hasConverged = true;

        centroids.forEach((centroid, i) => {
            if (clusters[i].length === 0) return;
            const newCentroid = {
                r: clusters[i].reduce((sum, p) => sum + p.r, 0) / clusters[i].length,
                g: clusters[i].reduce((sum, p) => sum + p.g, 0) / clusters[i].length,
                b: clusters[i].reduce((sum, p) => sum + p.b, 0) / clusters[i].length,
            };
            if (colorDistance(centroid, newCentroid) > 1) hasConverged = false;
            centroids[i] = newCentroid;
        });
        iterations++;
    }

    const totalPixels = pixels.length;
    const clusterSizes = finalClusters.map(cluster => cluster.length);

    return centroids.map((centroid, i) => ({
        r: Math.round(centroid.r),
        g: Math.round(centroid.g),
        b: Math.round(centroid.b),
        hex: rgbToHex(centroid.r, centroid.g, centroid.b),
        percentage: Math.round((clusterSizes[i] / totalPixels) * 100)
    }));
}

/**
 * Extract dominant color palette from an image file path
 */
async function extractColorPalette(imagePath, numColors = 5) {
    try {
        const image = await Jimp.read(imagePath);

        // Resize for performance (match client logic: max dimension 180)
        image.scaleToFit({ w: 180, h: 180 });

        const pixels = [];
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(centerX, centerY);

        image.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const a = this.bitmap.data[idx + 3];

            if (a <= 120) return;

            // Center Weighting: Scan the center 85% of the image
            // This avoids background noise while capturing full garment
            const dx = x - centerX;
            const dy = y - centerY;
            const distanceRatio = Math.sqrt(dx * dx + dy * dy) / maxRadius;

            // Ignore anything outside the center 85% circle (aligned with client)
            if (distanceRatio > 0.85) return;

            const { s, l } = rgbToHsl(r, g, b);
            const isLightNeutral = l > 88 && s < 18;
            const isDeepNeutral = l < 7 && s < 22;
            const isLikelyBackgroundNeutral = (isLightNeutral || isDeepNeutral) && distanceRatio > 0.85;

            if (isLikelyBackgroundNeutral) return;

            pixels.push({ r, g, b });
        });

        // Fallback
        if (pixels.length === 0) {
            image.scan(0, 0, width, height, function (x, y, idx) {
                pixels.push({
                    r: this.bitmap.data[idx + 0],
                    g: this.bitmap.data[idx + 1],
                    b: this.bitmap.data[idx + 2]
                });
            });
        }

        const paletteSize = Math.max(1, Math.min(numColors, pixels.length));
        let dominantColors = kMeansClustering(pixels, paletteSize);
        dominantColors.sort((a, b) => b.percentage - a.percentage);

        // ============================================
        // CRITICAL: Filter out likely background colors
        // White/light gray backgrounds should not be the dominant color
        // ============================================
        const isLikelyBackground = (color) => {
            const hsl = rgbToHsl(color.r, color.g, color.b);
            // Very light (L > 90) with low saturation = white/light gray background
            if (hsl.l > 90 && hsl.s < 15) return true;
            // Very light (L > 85) and almost no saturation = near-white
            if (hsl.l > 85 && hsl.s < 8) return true;
            return false;
        };

        // If the #1 color looks like a white background, try to use the next actual product color
        if (dominantColors.length > 1 && isLikelyBackground(dominantColors[0])) {
            console.log('[ColorExtraction] ⚠️ Top color looks like background, checking alternatives...');

            // Find first non-background color
            const realProductColor = dominantColors.find(c => !isLikelyBackground(c));

            if (realProductColor) {
                console.log(`[ColorExtraction] ✅ Using ${realProductColor.hex} instead of background color`);
                // Move the real product color to the top
                dominantColors = dominantColors.filter(c => c !== realProductColor);
                dominantColors.unshift(realProductColor);
            }
        }

        // Prefer the brightest plausible cluster when the main cluster is too dark (common for white garments under shadow)
        const withLightness = dominantColors.map(c => ({ ...c, lightness: rgbToHsl(c.r, c.g, c.b).l }));
        const top = withLightness[0];
        const brightest = withLightness.reduce((best, c) => (c.lightness > best.lightness ? c : best), withLightness[0]);

        let primary = top;
        const lightnessGain = brightest.lightness - top.lightness;
        const sufficientShare = brightest.percentage >= Math.max(8, top.percentage * 0.35);
        if (lightnessGain >= 15 && sufficientShare) {
            primary = brightest;
        }

        const reordered = [primary, ...withLightness.filter(c => c !== primary)];

        // EXPLICIT WHITE DETECTION
        // Force "White" classification for very bright clusters
        if (reordered.length > 0) {
            const dominant = reordered[0];
            const avgBrightness = (dominant.r + dominant.g + dominant.b) / 3;
            if (avgBrightness > 210) {
                dominant._forceWhite = true;
            }
        }

        // Add color names for better prompt building
        const { getColorName } = require('./colorNaming');
        return reordered.map(({ lightness, _forceWhite, ...color }) => {
            const fullName = getColorName(color.hex, _forceWhite);
            const simpleName = fullName.split('(')[0].trim();
            return { ...color, name: fullName, simpleName };
        });
    } catch (error) {
        console.error("Color extraction error:", error);
        return [{ hex: '#808080', percentage: 100 }]; // Fallback Grey
    }
}

module.exports = { extractColorPalette };
