/**
 * ADVANCED COLOR EXTRACTION for Product Photography
 * 
 * Problem: Background colors (like brick walls) were being detected instead of product colors.
 * Solution: Aggressive center-focused sampling with smart product isolation.
 * 
 * Uses k-means clustering with heavy center-weighting to extract the actual product color.
 */

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
  let h;
  let s;
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
 * Check if a color is likely "background" noise (very common in product photos)
 * Things like: white/gray studio backdrops, brick walls, wood textures
 */
function isLikelyBackground(r, g, b, hsl) {
  const { h, s, l } = hsl;

  // Pure white/off-white backgrounds
  if (l > 90 && s < 15) return true;

  // Very dark backgrounds (black, dark gray)
  if (l < 8 && s < 15) return true;

  // Brown/tan background tones (like brick walls, wooden surfaces)
  // Hue 15-45 is orange-brown range with low-medium saturation
  if (h >= 15 && h <= 50 && s >= 20 && s <= 60 && l >= 25 && l <= 55) {
    // This is likely a brown background, not a product
    // But we need to be careful - shoes can be brown too!
    // We'll use position-based weighting instead of outright exclusion
    return false; // Don't exclude, let position weighting handle it
  }

  return false;
}

/**
 * K-means clustering for color quantization with weighted pixels
 */
function kMeansClustering(pixels, k = 5, maxIterations = 25) {
  if (pixels.length === 0) return [];

  const clusterCount = Math.max(1, Math.min(k, pixels.length));

  // Initialize centroids using k-means++ for better convergence
  const centroids = [];
  centroids.push({ ...pixels[Math.floor(Math.random() * pixels.length)] });

  while (centroids.length < clusterCount) {
    // Find pixel furthest from all current centroids
    let maxDist = 0;
    let bestPixel = pixels[0];

    for (const pixel of pixels) {
      let minDistToCentroid = Infinity;
      for (const centroid of centroids) {
        const dist = colorDistance(pixel, centroid);
        if (dist < minDistToCentroid) minDistToCentroid = dist;
      }
      if (minDistToCentroid > maxDist) {
        maxDist = minDistToCentroid;
        bestPixel = pixel;
      }
    }
    centroids.push({ ...bestPixel });
  }

  let iterations = 0;
  let hasConverged = false;
  let finalClusters = null;

  while (!hasConverged && iterations < maxIterations) {
    const clusters = Array.from({ length: clusterCount }, () => []);
    const clusterWeights = Array.from({ length: clusterCount }, () => 0);

    // Assign each pixel to nearest centroid (using weights)
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
      clusterWeights[closestCluster] += pixel.weight || 1;
    });

    finalClusters = clusters;

    // Recalculate centroids using weighted average
    hasConverged = true;
    centroids.forEach((centroid, i) => {
      if (clusters[i].length === 0) return;

      const totalWeight = clusters[i].reduce((sum, p) => sum + (p.weight || 1), 0);
      const newCentroid = {
        r: clusters[i].reduce((sum, p) => sum + p.r * (p.weight || 1), 0) / totalWeight,
        g: clusters[i].reduce((sum, p) => sum + p.g * (p.weight || 1), 0) / totalWeight,
        b: clusters[i].reduce((sum, p) => sum + p.b * (p.weight || 1), 0) / totalWeight,
      };

      if (colorDistance(centroid, newCentroid) > 0.5) {
        hasConverged = false;
      }

      centroids[i] = newCentroid;
    });

    iterations++;
  }

  // Calculate weighted percentages
  const totalWeight = pixels.reduce((sum, p) => sum + (p.weight || 1), 0);
  const clusterWeights = finalClusters.map(cluster =>
    cluster.reduce((sum, p) => sum + (p.weight || 1), 0)
  );

  return centroids.map((centroid, i) => {
    const hsl = rgbToHsl(centroid.r, centroid.g, centroid.b);
    return {
      r: Math.round(centroid.r),
      g: Math.round(centroid.g),
      b: Math.round(centroid.b),
      hex: rgbToHex(centroid.r, centroid.g, centroid.b),
      percentage: Math.round((clusterWeights[i] / totalWeight) * 100),
      h: hsl.h,
      s: hsl.s,
      l: hsl.l,
    };
  });
}

/**
 * MAIN FUNCTION: Extract dominant color palette from an image file
 * 
 * Uses aggressive center-weighting to focus on the PRODUCT, not the background.
 * 
 * @param {File} imageFile - The image file to analyze
 * @param {number} numColors - Number of colors to extract (default: 5)
 * @returns {Promise<Array>} Array of color objects with hex, percentage, and name
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

          // Scale down for performance but keep enough detail
          const maxSize = 200;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = Math.floor(img.width * scale);
          canvas.height = Math.floor(img.height * scale);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = [];

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          // ======================================================
          // AGGRESSIVE CENTER FOCUS - The key to fixing the bug!
          // ======================================================
          // For product photos, the product is almost always centered.
          // We use a Gaussian-like falloff to heavily weight center pixels.
          // 
          // Center 20% of image = weight 10 (very high priority)
          // 20-40% = weight 5
          // 40-60% = weight 2
          // 60-80% = weight 0.5
          // 80-100% = weight 0.1 (nearly ignored)

          const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
          const innerRadius = maxRadius * 0.25;  // Inner 25% = product zone
          const midRadius = maxRadius * 0.45;    // 25-45% = product edge
          const outerRadius = maxRadius * 0.65;  // 45-65% = transition

          // Sample every other pixel for performance
          const sampleRate = 2;

          for (let y = 0; y < canvas.height; y += sampleRate) {
            for (let x = 0; x < canvas.width; x += sampleRate) {
              const idx = (y * canvas.width + x) * 4;
              const r = imageData.data[idx];
              const g = imageData.data[idx + 1];
              const b = imageData.data[idx + 2];
              const a = imageData.data[idx + 3];

              // Skip transparent pixels
              if (a < 100) continue;

              // Calculate distance from center
              const dx = x - centerX;
              const dy = y - centerY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              // Calculate weight based on distance from center
              let weight;
              if (distance <= innerRadius) {
                // PRODUCT ZONE - Maximum priority
                weight = 10;
              } else if (distance <= midRadius) {
                // Product edge - High priority
                weight = 6;
              } else if (distance <= outerRadius) {
                // Transition zone
                weight = 2;
              } else {
                // Background zone - Very low priority (but not zero)
                // We still sample it in case product extends to edges
                weight = 0.3;
              }

              // Check if this looks like a pure background color
              const hsl = rgbToHsl(r, g, b);

              // Skip pure white/black backgrounds in outer areas
              if (distance > midRadius) {
                if (isLikelyBackground(r, g, b, hsl)) {
                  continue; // Skip entirely
                }
              }

              pixels.push({ r, g, b, weight });
            }
          }

          // Fallback if too few pixels collected
          if (pixels.length < 50) {
            console.log('[ColorExtraction] Too few pixels, using raw sampling');
            pixels.length = 0; // Clear
            for (let i = 0; i < imageData.data.length; i += 8) {
              if (imageData.data[i + 3] > 100) {
                pixels.push({
                  r: imageData.data[i],
                  g: imageData.data[i + 1],
                  b: imageData.data[i + 2],
                  weight: 1
                });
              }
            }
          }

          console.log(`[ColorExtraction] Sampled ${pixels.length} weighted pixels`);

          // Run clustering
          const paletteSize = Math.max(1, Math.min(numColors, pixels.length));
          const dominantColors = kMeansClustering(pixels, paletteSize);

          // Sort by weighted percentage
          dominantColors.sort((a, b) => b.percentage - a.percentage);

          // Log the detected colors for debugging
          console.log('[ColorExtraction] Detected palette:',
            dominantColors.map(c => `${c.hex} (${c.percentage}%)`).join(', ')
          );

          // Mark white if detected
          if (dominantColors.length > 0) {
            const top = dominantColors[0];
            const avgBrightness = (top.r + top.g + top.b) / 3;
            if (avgBrightness > 215 && top.s < 12) {
              top._forceWhite = true;
            }
          }

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
 * Extract a single average color (legacy fallback)
 */
export async function extractAverageColor(imageFile) {
  const palette = await extractColorPalette(imageFile, 1);
  return palette[0]?.hex || '#808080';
}
