/**
 * Color extraction using k-means clustering
 * Extracts the 5 most dominant colors from an image
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
 * K-means clustering for color quantization
 * @param {Array} pixels - Array of {r, g, b} objects
 * @param {number} k - Number of clusters (colors to extract)
 * @param {number} maxIterations - Maximum iterations for convergence
 * @returns {Array} Array of cluster centroids (dominant colors)
 */
function kMeansClustering(pixels, k = 5, maxIterations = 20) {
  if (pixels.length === 0) return [];

  const clusterCount = Math.max(1, Math.min(k, pixels.length));

  // Initialize centroids with random pixels
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
    // Assign each pixel to nearest centroid
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

    // Store final clusters
    finalClusters = clusters;

    // Recalculate centroids
    hasConverged = true;
    centroids.forEach((centroid, i) => {
      if (clusters[i].length === 0) return;

      const newCentroid = {
        r: clusters[i].reduce((sum, p) => sum + p.r, 0) / clusters[i].length,
        g: clusters[i].reduce((sum, p) => sum + p.g, 0) / clusters[i].length,
        b: clusters[i].reduce((sum, p) => sum + p.b, 0) / clusters[i].length,
      };

      if (colorDistance(centroid, newCentroid) > 1) {
        hasConverged = false;
      }

      centroids[i] = newCentroid;
    });

    iterations++;
  }

  // Use the final cluster assignments to calculate sizes (no re-computation)
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
 * Extract dominant color palette from an image file
 * @param {File} imageFile - The image file to analyze
 * @param {number} numColors - Number of colors to extract (default: 5)
 * @returns {Promise<Array>} Array of color objects with hex, percentage, and name
 */
export async function extractColorPalette(imageFile, numColors = 5) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    let isResolved = false;

    // Cleanup function
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
          // Create canvas and scale down image for performance
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxSize = 180;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Get pixel data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = [];

          // Sample pixels while biasing to center and removing neutral backgrounds
          const sampleRate = 1;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const maxRadius = Math.min(centerX, centerY);

          for (let y = 0; y < canvas.height; y += sampleRate) {
            for (let x = 0; x < canvas.width; x += sampleRate) {
              const idx = (y * canvas.width + x) * 4;
              const r = imageData.data[idx];
              const g = imageData.data[idx + 1];
              const b = imageData.data[idx + 2];
              const a = imageData.data[idx + 3];

              if (a <= 120) continue;

              // Down-weight edges where backgrounds dominate
              const dx = x - centerX;
              const dy = y - centerY;
              const distanceRatio = Math.sqrt(dx * dx + dy * dy) / maxRadius;
              if (distanceRatio > 0.95) continue;

              const { s, l } = rgbToHsl(r, g, b);
              const isLightNeutral = l > 88 && s < 18;
              const isDeepNeutral = l < 7 && s < 22;
              const isLikelyBackgroundNeutral = (isLightNeutral || isDeepNeutral) && distanceRatio > 0.65;
              if (isLikelyBackgroundNeutral) continue;

              pixels.push({ r, g, b });
            }
          }

          // If filtering was too aggressive, fall back to raw sampling
          if (pixels.length === 0) {
            for (let i = 0; i < imageData.data.length; i += 4) {
              const a = imageData.data[i + 3];
              if (a > 120) {
                pixels.push({
                  r: imageData.data[i],
                  g: imageData.data[i + 1],
                  b: imageData.data[i + 2]
                });
              }
            }
          }

          // Fallback to avoid empty palettes
          const paletteSize = Math.max(1, Math.min(numColors, pixels.length));
          // Extract dominant colors using k-means
          const dominantColors = kMeansClustering(pixels, paletteSize);

          // Sort by percentage (most dominant first)
          dominantColors.sort((a, b) => b.percentage - a.percentage);

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
 * @param {File} imageFile
 * @returns {Promise<string>} Hex color code
 */
export async function extractAverageColor(imageFile) {
  const palette = await extractColorPalette(imageFile, 1);
  return palette[0]?.hex || '#808080';
}
