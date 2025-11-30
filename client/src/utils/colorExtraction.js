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

  // Initialize centroids with random pixels
  const centroids = [];
  const step = Math.floor(pixels.length / k);
  for (let i = 0; i < k; i++) {
    const idx = Math.min(i * step, pixels.length - 1);
    centroids.push({ ...pixels[idx] });
  }

  let iterations = 0;
  let hasConverged = false;

  while (!hasConverged && iterations < maxIterations) {
    // Assign each pixel to nearest centroid
    const clusters = Array.from({ length: k }, () => []);

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

  // Calculate cluster sizes for percentages
  const clusterSizes = centroids.map((_, i) => {
    const size = pixels.filter(pixel => {
      let minDist = Infinity;
      let closestCluster = 0;
      centroids.forEach((centroid, j) => {
        const dist = colorDistance(pixel, centroid);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = j;
        }
      });
      return closestCluster === i;
    }).length;
    return size;
  });

  const totalPixels = pixels.length;

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

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas and scale down image for performance
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = 100;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = [];

        // Sample pixels (skip some for performance)
        const sampleRate = 2;
        for (let i = 0; i < imageData.data.length; i += 4 * sampleRate) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];

          // Skip transparent or near-transparent pixels
          if (a > 128) {
            pixels.push({ r, g, b });
          }
        }

        // Extract dominant colors using k-means
        const dominantColors = kMeansClustering(pixels, numColors);

        // Sort by percentage (most dominant first)
        dominantColors.sort((a, b) => b.percentage - a.percentage);

        resolve(dominantColors);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
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
