/**
 * ADVANCED COLOR EXTRACTION SYSTEM
 * 
 * This is the MOST CRITICAL part of the system for color accuracy.
 * 
 * Key strategies:
 * 1. Aggressive center-weighting (product is usually centered)
 * 2. Multi-region sampling (sample from multiple areas, compare)
 * 3. Saturation-based filtering (ignore gray/neutral backgrounds)
 * 4. Color name mapping (hex to human-readable names)
 * 5. White balance detection (detect color casts)
 * 6. K-means++ for better clustering
 * 
 * @author Premium Product Platform
 */

// Production-safe logging - only logs in development
const isDev = import.meta.env?.DEV || process.env.NODE_ENV === 'development';
const log = isDev ? console.log.bind(console) : () => { };
const warn = isDev ? console.warn.bind(console) : () => { };

/**
 * Comprehensive color name mapping for accurate AI prompts
 * Organized by hue ranges for fast lookup
 */
const COLOR_NAMES = {
  // Neutrals (special handling)
  neutrals: [
    { name: 'Pure White', hex: '#FFFFFF', rgb: [255, 255, 255], range: { l: [95, 100], s: [0, 10] } },
    { name: 'Off-White', hex: '#FAF9F6', rgb: [250, 249, 246], range: { l: [90, 97], s: [0, 15] } },
    { name: 'Cream', hex: '#FFFDD0', rgb: [255, 253, 208], range: { l: [90, 98], s: [10, 40], h: [40, 60] } },
    { name: 'Ivory', hex: '#FFFFF0', rgb: [255, 255, 240], range: { l: [92, 100], s: [0, 30], h: [50, 70] } },
    { name: 'Light Gray', hex: '#D3D3D3', rgb: [211, 211, 211], range: { l: [75, 90], s: [0, 10] } },
    { name: 'Silver', hex: '#C0C0C0', rgb: [192, 192, 192], range: { l: [70, 82], s: [0, 10] } },
    { name: 'Gray', hex: '#808080', rgb: [128, 128, 128], range: { l: [40, 65], s: [0, 10] } },
    { name: 'Charcoal', hex: '#36454F', rgb: [54, 69, 79], range: { l: [20, 35], s: [0, 20] } },
    { name: 'Black', hex: '#000000', rgb: [0, 0, 0], range: { l: [0, 15], s: [0, 15] } },
  ],

  // Reds (h: 0-15, 345-360)
  reds: [
    { name: 'Bright Red', hex: '#FF0000', h: [0, 10], s: [80, 100], l: [45, 55] },
    { name: 'Cherry Red', hex: '#DE3163', h: [340, 360], s: [60, 85], l: [45, 60] },
    { name: 'Crimson', hex: '#DC143C', h: [345, 360], s: [70, 100], l: [35, 50] },
    { name: 'Dark Red', hex: '#8B0000', h: [0, 10], s: [80, 100], l: [20, 35] },
    { name: 'Burgundy', hex: '#800020', h: [345, 360], s: [60, 100], l: [20, 35] },
    { name: 'Wine Red', hex: '#722F37', h: [350, 10], s: [40, 60], l: [25, 40] },
    { name: 'Rust Red', hex: '#B7410E', h: [15, 25], s: [70, 100], l: [35, 45] },
    { name: 'Coral Red', hex: '#FF6F61', h: [5, 15], s: [80, 100], l: [60, 75] },
    { name: 'Light Red', hex: '#FFCCCB', h: [0, 10], s: [40, 100], l: [80, 95] },
  ],

  // Oranges (h: 15-45)
  oranges: [
    { name: 'Orange', hex: '#FFA500', h: [30, 45], s: [80, 100], l: [45, 60] },
    { name: 'Bright Orange', hex: '#FF7F00', h: [25, 35], s: [90, 100], l: [45, 55] },
    { name: 'Dark Orange', hex: '#FF8C00', h: [30, 40], s: [80, 100], l: [45, 55] },
    { name: 'Burnt Orange', hex: '#CC5500', h: [20, 30], s: [80, 100], l: [35, 45] },
    { name: 'Terracotta', hex: '#E2725B', h: [10, 20], s: [50, 75], l: [50, 65] },
    { name: 'Peach', hex: '#FFCBA4', h: [25, 40], s: [60, 100], l: [75, 90] },
    { name: 'Apricot', hex: '#FBCEB1', h: [25, 35], s: [70, 100], l: [80, 90] },
    { name: 'Copper', hex: '#B87333', h: [25, 35], s: [50, 70], l: [40, 55] },
  ],

  // Yellows (h: 45-70)
  yellows: [
    { name: 'Yellow', hex: '#FFFF00', h: [55, 65], s: [80, 100], l: [45, 55] },
    { name: 'Bright Yellow', hex: '#FFFF00', h: [55, 65], s: [90, 100], l: [50, 60] },
    { name: 'Golden Yellow', hex: '#FFD700', h: [45, 55], s: [80, 100], l: [45, 60] },
    { name: 'Mustard', hex: '#FFDB58', h: [45, 55], s: [70, 100], l: [55, 70] },
    { name: 'Lemon Yellow', hex: '#FFF44F', h: [55, 65], s: [80, 100], l: [60, 75] },
    { name: 'Gold', hex: '#D4AF37', h: [45, 55], s: [50, 70], l: [45, 60] },
    { name: 'Pale Yellow', hex: '#FFFFED', h: [55, 70], s: [40, 100], l: [85, 98] },
    { name: 'Khaki', hex: '#C3B091', h: [35, 50], s: [20, 40], l: [55, 70] },
  ],

  // Greens (h: 70-170)
  greens: [
    { name: 'Green', hex: '#008000', h: [115, 130], s: [80, 100], l: [20, 35] },
    { name: 'Bright Green', hex: '#00FF00', h: [115, 130], s: [90, 100], l: [45, 55] },
    { name: 'Lime Green', hex: '#32CD32', h: [115, 125], s: [50, 70], l: [45, 55] },
    { name: 'Forest Green', hex: '#228B22', h: [115, 125], s: [50, 70], l: [25, 40] },
    { name: 'Dark Green', hex: '#006400', h: [115, 130], s: [80, 100], l: [15, 25] },
    { name: 'Olive Green', hex: '#808000', h: [55, 70], s: [70, 100], l: [20, 35] },
    { name: 'Army Green', hex: '#4B5320', h: [65, 80], s: [40, 70], l: [20, 30] },
    { name: 'Sage Green', hex: '#9DC183', h: [90, 110], s: [30, 50], l: [55, 70] },
    { name: 'Mint Green', hex: '#98FF98', h: [115, 130], s: [60, 100], l: [70, 85] },
    { name: 'Teal', hex: '#008080', h: [175, 185], s: [80, 100], l: [20, 35] },
    { name: 'Emerald', hex: '#50C878', h: [135, 150], s: [50, 70], l: [45, 60] },
    { name: 'Hunter Green', hex: '#355E3B', h: [125, 140], s: [25, 45], l: [25, 35] },
  ],

  // Blues (h: 170-260)
  blues: [
    { name: 'Blue', hex: '#0000FF', h: [235, 245], s: [80, 100], l: [45, 55] },
    { name: 'Navy Blue', hex: '#000080', h: [235, 245], s: [80, 100], l: [20, 35] },
    { name: 'Dark Blue', hex: '#00008B', h: [235, 245], s: [80, 100], l: [25, 35] },
    { name: 'Royal Blue', hex: '#4169E1', h: [220, 230], s: [60, 80], l: [50, 60] },
    { name: 'Sky Blue', hex: '#87CEEB', h: [195, 210], s: [50, 75], l: [70, 85] },
    { name: 'Light Blue', hex: '#ADD8E6', h: [195, 210], s: [40, 60], l: [75, 90] },
    { name: 'Baby Blue', hex: '#89CFF0', h: [195, 210], s: [60, 85], l: [70, 85] },
    { name: 'Powder Blue', hex: '#B0E0E6', h: [185, 200], s: [40, 60], l: [75, 88] },
    { name: 'Steel Blue', hex: '#4682B4', h: [200, 215], s: [40, 55], l: [45, 55] },
    { name: 'Cobalt Blue', hex: '#0047AB', h: [215, 225], s: [80, 100], l: [30, 40] },
    { name: 'Denim Blue', hex: '#1560BD', h: [210, 220], s: [70, 90], l: [35, 50] },
    { name: 'Turquoise', hex: '#40E0D0', h: [175, 185], s: [60, 85], l: [50, 65] },
    { name: 'Aqua', hex: '#00FFFF', h: [180, 190], s: [80, 100], l: [45, 55] },
    { name: 'Cyan', hex: '#00FFFF', h: [180, 190], s: [90, 100], l: [50, 55] },
  ],

  // Purples/Violets (h: 260-310)
  purples: [
    { name: 'Purple', hex: '#800080', h: [290, 310], s: [80, 100], l: [20, 35] },
    { name: 'Violet', hex: '#EE82EE', h: [290, 310], s: [60, 85], l: [65, 80] },
    { name: 'Lavender', hex: '#E6E6FA', h: [240, 260], s: [50, 75], l: [85, 95] },
    { name: 'Lilac', hex: '#C8A2C8', h: [290, 310], s: [25, 45], l: [65, 78] },
    { name: 'Magenta', hex: '#FF00FF', h: [295, 305], s: [90, 100], l: [45, 55] },
    { name: 'Plum', hex: '#8E4585', h: [290, 310], s: [35, 50], l: [35, 50] },
    { name: 'Indigo', hex: '#4B0082', h: [270, 285], s: [80, 100], l: [20, 35] },
    { name: 'Mauve', hex: '#E0B0FF', h: [280, 295], s: [60, 100], l: [75, 88] },
    { name: 'Orchid', hex: '#DA70D6', h: [290, 305], s: [55, 75], l: [60, 72] },
    { name: 'Grape', hex: '#6F2DA8', h: [270, 285], s: [55, 75], l: [35, 50] },
  ],

  // Pinks (h: 310-345)
  pinks: [
    { name: 'Pink', hex: '#FFC0CB', h: [345, 360], s: [60, 100], l: [80, 92] },
    { name: 'Hot Pink', hex: '#FF69B4', h: [325, 340], s: [80, 100], l: [60, 75] },
    { name: 'Light Pink', hex: '#FFB6C1', h: [345, 360], s: [70, 100], l: [83, 93] },
    { name: 'Deep Pink', hex: '#FF1493', h: [325, 335], s: [90, 100], l: [50, 60] },
    { name: 'Salmon Pink', hex: '#FF91A4', h: [350, 360], s: [80, 100], l: [75, 85] },
    { name: 'Blush Pink', hex: '#DE5D83', h: [340, 355], s: [55, 75], l: [55, 70] },
    { name: 'Rose', hex: '#FF007F', h: [330, 345], s: [85, 100], l: [45, 55] },
    { name: 'Dusty Rose', hex: '#DCAE96', h: [20, 35], s: [35, 55], l: [65, 78] },
    { name: 'Fuchsia', hex: '#FF00FF', h: [295, 305], s: [90, 100], l: [45, 55] },
  ],

  // Browns (h: 15-45, low saturation/lightness)
  browns: [
    { name: 'Brown', hex: '#A52A2A', h: [0, 15], s: [50, 70], l: [35, 45] },
    { name: 'Dark Brown', hex: '#5C4033', h: [20, 35], s: [25, 45], l: [22, 35] },
    { name: 'Light Brown', hex: '#C4A484', h: [25, 40], s: [30, 50], l: [55, 70] },
    { name: 'Tan', hex: '#D2B48C', h: [30, 40], s: [35, 55], l: [60, 75] },
    { name: 'Beige', hex: '#F5F5DC', h: [50, 65], s: [30, 60], l: [85, 95] },
    { name: 'Camel', hex: '#C19A6B', h: [30, 40], s: [35, 50], l: [55, 65] },
    { name: 'Chocolate', hex: '#7B3F00', h: [25, 35], s: [80, 100], l: [20, 30] },
    { name: 'Coffee', hex: '#6F4E37', h: [25, 35], s: [30, 45], l: [28, 38] },
    { name: 'Mocha', hex: '#967969', h: [15, 30], s: [18, 32], l: [45, 55] },
    { name: 'Taupe', hex: '#483C32', h: [25, 40], s: [15, 30], l: [22, 32] },
    { name: 'Sand', hex: '#C2B280', h: [45, 55], s: [30, 50], l: [55, 70] },
    { name: 'Espresso', hex: '#3C2218', h: [15, 30], s: [40, 60], l: [14, 22] },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert RGB to hex color
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
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
 * Convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

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
 * Get human-readable color name from HSL values
 */
function getColorName(h, s, l) {
  // FIRST: Check for very light colors (near white) - these should ALWAYS be neutrals
  // regardless of hue or saturation calculations
  if (l > 95) return 'Pure White';
  if (l > 92) return 'Off-White';

  // Check for very dark colors (near black)
  if (l < 5) return 'Black';
  if (l < 12) return 'Near Black';

  // Then check neutrals (low saturation)
  if (s < 15) {
    for (const neutral of COLOR_NAMES.neutrals) {
      const range = neutral.range;
      if (l >= range.l[0] && l <= range.l[1]) {
        if (!range.s || (s >= range.s[0] && s <= range.s[1])) {
          return neutral.name;
        }
      }
    }
    // Default neutral based on lightness
    if (l > 90) return 'White';
    if (l > 70) return 'Light Gray';
    if (l > 40) return 'Gray';
    if (l > 15) return 'Dark Gray';
    return 'Black';
  }

  // Check chromatic colors by hue
  const colorGroups = [
    { group: 'reds', hRange: [[0, 15], [345, 360]] },
    { group: 'oranges', hRange: [[15, 45]] },
    { group: 'yellows', hRange: [[45, 70]] },
    { group: 'greens', hRange: [[70, 170]] },
    { group: 'blues', hRange: [[170, 260]] },
    { group: 'purples', hRange: [[260, 310]] },
    { group: 'pinks', hRange: [[310, 345]] },
  ];

  // Also check browns (special case - orange/red hue but low saturation)
  if (h >= 10 && h <= 45 && s >= 15 && s <= 60 && l >= 15 && l <= 55) {
    for (const color of COLOR_NAMES.browns) {
      if (h >= color.h[0] && h <= color.h[1] &&
        s >= color.s[0] && s <= color.s[1] &&
        l >= color.l[0] && l <= color.l[1]) {
        return color.name;
      }
    }
  }

  // Find matching color group
  for (const { group, hRange } of colorGroups) {
    const inRange = hRange.some(([min, max]) => h >= min && h <= max);
    if (inRange) {
      const colors = COLOR_NAMES[group];
      if (!colors) continue;

      // Find best match within group
      for (const color of colors) {
        if (h >= color.h[0] && h <= color.h[1] &&
          s >= color.s[0] && s <= color.s[1] &&
          l >= color.l[0] && l <= color.l[1]) {
          return color.name;
        }
      }

      // No exact match, return generic name
      const groupNames = {
        reds: 'Red',
        oranges: 'Orange',
        yellows: 'Yellow',
        greens: 'Green',
        blues: 'Blue',
        purples: 'Purple',
        pinks: 'Pink',
      };
      return groupNames[group] || 'Unknown';
    }
  }

  return 'Unknown';
}

/**
 * Calculate color distance (CIE76 approximation)
 */
function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Detect if image has a color cast (white balance issue)
 * Returns correction factors if detected
 */
function detectColorCast(pixels) {
  if (pixels.length < 100) return null;

  // Look for pixels that should be neutral (low saturation, medium brightness)
  const neutralPixels = pixels.filter(p => {
    const hsl = rgbToHsl(p.r, p.g, p.b);
    return hsl.s < 15 && hsl.l > 20 && hsl.l < 80;
  });

  if (neutralPixels.length < 20) return null;

  // Calculate average of neutral pixels
  const avgR = neutralPixels.reduce((sum, p) => sum + p.r, 0) / neutralPixels.length;
  const avgG = neutralPixels.reduce((sum, p) => sum + p.g, 0) / neutralPixels.length;
  const avgB = neutralPixels.reduce((sum, p) => sum + p.b, 0) / neutralPixels.length;

  // If neutral pixels aren't actually neutral, there's a color cast
  const avgGray = (avgR + avgG + avgB) / 3;
  const deviation = Math.abs(avgR - avgGray) + Math.abs(avgG - avgGray) + Math.abs(avgB - avgGray);

  if (deviation > 30) {
    log('[ColorExtraction] Color cast detected, applying correction');
    return {
      r: avgGray / avgR,
      g: avgGray / avgG,
      b: avgGray / avgB,
    };
  }

  return null;
}

/**
 * Apply white balance correction to a pixel
 */
function applyColorCorrection(pixel, correction) {
  if (!correction) return pixel;
  return {
    r: Math.min(255, Math.max(0, pixel.r * correction.r)),
    g: Math.min(255, Math.max(0, pixel.g * correction.g)),
    b: Math.min(255, Math.max(0, pixel.b * correction.b)),
    weight: pixel.weight,
  };
}

// ============================================
// K-MEANS++ CLUSTERING
// ============================================

/**
 * K-means++ initialization for better clustering
 */
function kMeansPlusPlusInit(pixels, k) {
  const centroids = [];

  // First centroid: most saturated pixel (likely product color)
  let maxSaturation = 0;
  let firstCentroid = pixels[0];
  for (const pixel of pixels) {
    const hsl = rgbToHsl(pixel.r, pixel.g, pixel.b);
    if (hsl.s > maxSaturation && hsl.l > 15 && hsl.l < 85) {
      maxSaturation = hsl.s;
      firstCentroid = pixel;
    }
  }
  centroids.push({ ...firstCentroid });

  // Subsequent centroids: weighted random by distance
  while (centroids.length < k) {
    let maxDist = 0;
    let bestPixel = pixels[0];

    for (const pixel of pixels) {
      let minDistToCentroid = Infinity;
      for (const centroid of centroids) {
        const dist = colorDistance(pixel, centroid);
        if (dist < minDistToCentroid) minDistToCentroid = dist;
      }
      // Weight by distance squared
      const weightedDist = minDistToCentroid * minDistToCentroid * (pixel.weight || 1);
      if (weightedDist > maxDist) {
        maxDist = weightedDist;
        bestPixel = pixel;
      }
    }
    centroids.push({ ...bestPixel });
  }

  return centroids;
}

/**
 * K-means clustering with weighted pixels
 */
function kMeansClustering(pixels, k = 5, maxIterations = 30) {
  if (pixels.length === 0) return [];

  const clusterCount = Math.max(1, Math.min(k, pixels.length));

  // Use k-means++ initialization
  const centroids = kMeansPlusPlusInit(pixels, clusterCount);

  let iterations = 0;
  let hasConverged = false;
  let finalClusters = null;

  while (!hasConverged && iterations < maxIterations) {
    const clusters = Array.from({ length: clusterCount }, () => []);

    // Assign pixels to nearest centroid
    for (const pixel of pixels) {
      let minDist = Infinity;
      let closestCluster = 0;

      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(pixel, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = i;
        }
      }

      clusters[closestCluster].push(pixel);
    }

    finalClusters = clusters;

    // Recalculate centroids using weighted average
    hasConverged = true;
    for (let i = 0; i < centroids.length; i++) {
      if (clusters[i].length === 0) continue;

      const totalWeight = clusters[i].reduce((sum, p) => sum + (p.weight || 1), 0);
      const newCentroid = {
        r: clusters[i].reduce((sum, p) => sum + p.r * (p.weight || 1), 0) / totalWeight,
        g: clusters[i].reduce((sum, p) => sum + p.g * (p.weight || 1), 0) / totalWeight,
        b: clusters[i].reduce((sum, p) => sum + p.b * (p.weight || 1), 0) / totalWeight,
      };

      if (colorDistance(centroids[i], newCentroid) > 0.5) {
        hasConverged = false;
      }

      centroids[i] = newCentroid;
    }

    iterations++;
  }

  // Calculate results with color names
  const totalWeight = pixels.reduce((sum, p) => sum + (p.weight || 1), 0);

  return centroids.map((centroid, i) => {
    const clusterWeight = finalClusters[i].reduce((sum, p) => sum + (p.weight || 1), 0);
    const r = Math.round(centroid.r);
    const g = Math.round(centroid.g);
    const b = Math.round(centroid.b);
    const hsl = rgbToHsl(r, g, b);
    const hex = rgbToHex(r, g, b);
    const colorName = getColorName(hsl.h, hsl.s, hsl.l);

    return {
      r, g, b,
      hex,
      h: hsl.h,
      s: hsl.s,
      l: hsl.l,
      percentage: Math.round((clusterWeight / totalWeight) * 100),
      colorName,
      simpleName: colorName, // For backward compatibility
    };
  });
}

// ============================================
// MAIN EXTRACTION FUNCTION
// ============================================

/**
 * Extract dominant color palette from an image file
 * Uses multiple strategies for maximum accuracy even with poor photos
 */
export async function extractColorPalette(imageFile, numColors = 5) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    let isResolved = false;

    const cleanup = () => {
      reader.onload = null;
      reader.onerror = null;
      img.onload = null;
      img.onerror = null;
      img.src = '';
    };

    reader.onload = (e) => {
      img.onload = () => {
        if (isResolved) return;

        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Scale down for performance
          const maxSize = 250;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = Math.floor(img.width * scale);
          canvas.height = Math.floor(img.height * scale);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const allPixels = [];
          const centerPixels = [];

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

          // Define zones
          const innerRadius = maxRadius * 0.30;  // Inner 30% = core product zone
          const midRadius = maxRadius * 0.50;    // 30-50% = product edge
          const outerRadius = maxRadius * 0.70;  // 50-70% = transition

          // Sample pixels with gradient weighting
          const sampleRate = 2;

          for (let y = 0; y < canvas.height; y += sampleRate) {
            for (let x = 0; x < canvas.width; x += sampleRate) {
              const idx = (y * canvas.width + x) * 4;
              const r = imageData.data[idx];
              const g = imageData.data[idx + 1];
              const b = imageData.data[idx + 2];
              const a = imageData.data[idx + 3];

              if (a < 100) continue;

              const dx = x - centerX;
              const dy = y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              // Calculate weight with smoother gradient
              let weight;
              if (distance <= innerRadius) {
                weight = 15; // Maximum weight for center
              } else if (distance <= midRadius) {
                weight = 8;
              } else if (distance <= outerRadius) {
                weight = 3;
              } else {
                weight = 0.5; // Near-zero weight for edges
              }

              const hsl = rgbToHsl(r, g, b);

              // Boost weight for saturated colors (likely product, not background)
              if (hsl.s > 30 && hsl.l > 15 && hsl.l < 85) {
                weight *= 1.5;
              }

              // Skip pure white/black in outer regions (likely background)
              if (distance > midRadius) {
                if ((hsl.l > 92 && hsl.s < 10) || (hsl.l < 8)) {
                  continue;
                }
              }

              const pixel = { r, g, b, weight };
              allPixels.push(pixel);

              // Track center-only pixels for backup
              if (distance <= midRadius) {
                centerPixels.push(pixel);
              }
            }
          }

          // Detect and correct color cast
          const colorCorrection = detectColorCast(allPixels);
          const correctedPixels = colorCorrection
            ? allPixels.map(p => applyColorCorrection(p, colorCorrection))
            : allPixels;

          log(`[ColorExtraction] Sampled ${correctedPixels.length} pixels (${centerPixels.length} center)`);
          if (colorCorrection) {
            log('[ColorExtraction] Applied white balance correction');
          }

          // Fallback if too few pixels
          if (correctedPixels.length < 50) {
            log('[ColorExtraction] Too few pixels, using raw center sampling');
            correctedPixels.length = 0;
            for (let i = 0; i < imageData.data.length; i += 8) {
              if (imageData.data[i + 3] > 100) {
                correctedPixels.push({
                  r: imageData.data[i],
                  g: imageData.data[i + 1],
                  b: imageData.data[i + 2],
                  weight: 1
                });
              }
            }
          }

          // Run clustering
          const paletteSize = Math.max(1, Math.min(numColors, correctedPixels.length));
          let dominantColors = kMeansClustering(correctedPixels, paletteSize);

          // Sort by weighted percentage
          dominantColors.sort((a, b) => b.percentage - a.percentage);

          // ============================================
          // CRITICAL: Filter out likely background colors
          // White/light gray AND tan/beige/brown backgrounds should not be the dominant color
          // ============================================
          const isLikelyBackground = (color) => {
            const hsl = rgbToHsl(color.r, color.g, color.b);

            // Very light (L > 90) with low saturation = white/light gray background
            if (hsl.l > 90 && hsl.s < 15) return true;
            // Very light (L > 85) and almost no saturation = near-white
            if (hsl.l > 85 && hsl.s < 8) return true;

            // NEW: Detect tan/beige/brown backgrounds (very common in product photography)
            // These have: hue 25-55 (orange-yellow range), low-medium saturation, mid lightness
            if (hsl.h >= 25 && hsl.h <= 55 && hsl.s >= 10 && hsl.s <= 45 && hsl.l >= 45 && hsl.l <= 75) {
              // This looks like tan/beige/khaki - likely a floor/table background
              return true;
            }

            // Also detect muted brown/wood colors
            if (hsl.h >= 15 && hsl.h <= 45 && hsl.s >= 15 && hsl.s <= 50 && hsl.l >= 35 && hsl.l <= 65) {
              return true;
            }

            return false;
          };

          // Check if there's a very light (white/cream) color in the palette
          // This is important for white products on colored backgrounds
          const hasLightProductColor = dominantColors.some(c => {
            const hsl = rgbToHsl(c.r, c.g, c.b);
            // Very light color that could be a white product
            return hsl.l > 80 && hsl.s < 20;
          });

          // If the #1 color looks like a background, try to use a better color
          if (dominantColors.length > 1 && isLikelyBackground(dominantColors[0])) {
            log('[ColorExtraction] ⚠️ Top color looks like background, checking alternatives...');

            // Find first non-background color
            let realProductColor = dominantColors.find(c => !isLikelyBackground(c));

            // SPECIAL CASE: If we have a very light color and the current "best" is a background,
            // prefer the light color (likely a white product)
            if (hasLightProductColor) {
              const lightColor = dominantColors.find(c => {
                const hsl = rgbToHsl(c.r, c.g, c.b);
                return hsl.l > 80 && hsl.s < 25;
              });
              if (lightColor && lightColor !== dominantColors[0]) {
                realProductColor = lightColor;
                log(`[ColorExtraction] 🎯 Detected white/light product, prioritizing: ${lightColor.colorName}`);
              }
            }

            if (realProductColor) {
              log(`[ColorExtraction] ✅ Using ${realProductColor.colorName} instead of background color`);
              // Move the real product color to the top
              dominantColors = dominantColors.filter(c => c !== realProductColor);
              dominantColors.unshift(realProductColor);
            } else {
              log('[ColorExtraction] No alternative found, keeping original order');
            }
          }

          // ADDITIONAL CHECK: If the top color is still a tan/beige and there's a white color,
          // the product is likely white (common case: white shoes on wood floor)
          if (dominantColors.length > 1) {
            const topColor = dominantColors[0];
            const topHsl = rgbToHsl(topColor.r, topColor.g, topColor.b);

            // Current top is tan/beige-ish
            if (topHsl.h >= 20 && topHsl.h <= 50 && topHsl.s >= 10 && topHsl.s <= 45) {
              // Look for a white/light color
              const whiteColor = dominantColors.find(c => {
                const hsl = rgbToHsl(c.r, c.g, c.b);
                return hsl.l > 85 && hsl.s < 15 && c !== topColor;
              });

              if (whiteColor && whiteColor.percentage > 15) {
                log(`[ColorExtraction] 🔄 Swapping tan background for white product color`);
                dominantColors = dominantColors.filter(c => c !== whiteColor);
                dominantColors.unshift(whiteColor);
              }
            }
          }

          // Log results
          log('[ColorExtraction] Detected palette:');
          dominantColors.forEach((c, i) => {
            log(`  ${i + 1}. ${c.colorName} (${c.hex}) - ${c.percentage}%`);
          });

          isResolved = true;
          cleanup();
          resolve(dominantColors);
        } catch (error) {
          isResolved = true;
          cleanup();
          reject(error);
        }
      };

      img.onerror = () => {
        if (isResolved) return;
        isResolved = true;
        cleanup();
        reject(new Error('Failed to load image'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      if (isResolved) return;
      isResolved = true;
      cleanup();
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(imageFile);
  });
}

/**
 * Get a single primary color with name
 */
export async function extractPrimaryColor(imageFile) {
  const palette = await extractColorPalette(imageFile, 1);
  const primary = palette[0];
  return {
    hex: primary?.hex || '#808080',
    name: primary?.colorName || 'Gray',
    rgb: primary ? { r: primary.r, g: primary.g, b: primary.b } : null,
  };
}

/**
 * Build a color description for AI prompts
 * This creates STRONG color lock language
 */
export function buildColorLockPrompt(palette) {
  if (!palette || palette.length === 0) {
    return '';
  }

  const primary = palette[0];
  const secondary = palette[1];

  const parts = [];

  // Primary color - VERY strong emphasis
  parts.push(`CRITICAL COLOR ACCURACY: The product's PRIMARY color is ${primary.colorName} (exact hex: ${primary.hex}).`);
  parts.push(`DO NOT change this color under any circumstances.`);
  parts.push(`The product must remain ${primary.colorName} - not cream, not tan, not any other shade.`);
  parts.push(`Maintain exact hex value ${primary.hex} with zero hue shift.`);

  // Secondary color if present
  if (secondary && secondary.percentage > 15) {
    parts.push(`Secondary accent: ${secondary.colorName} (${secondary.hex}).`);
  }

  // Final reinforcement
  parts.push(`Color fidelity is the #1 priority. Any color shift is unacceptable.`);

  return parts.join(' ');
}
