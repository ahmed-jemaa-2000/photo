/**
 * Color harmony and theory utilities
 * Generates complementary, analogous, triadic, and other harmonious color schemes
 */

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
 * Convert HSL to RGB
 */
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Rotate hue and return new hex color
 */
function rotateHue(hexColor, degrees) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + degrees + 360) % 360;

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Adjust saturation of a color
 */
function adjustSaturation(hexColor, saturationPercent) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.max(0, Math.min(100, saturationPercent));

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Adjust lightness of a color
 */
function adjustLightness(hexColor, lightnessPercent) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, Math.min(100, lightnessPercent));

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generate backdrop color suggestions based on color harmony theory
 * @param {Array} colorPalette - Array of color objects with hex values
 * @returns {Array} Array of backdrop suggestions with hex, name, and type
 */
export function generateBackdropSuggestions(colorPalette) {
  if (!colorPalette || colorPalette.length === 0) {
    return [];
  }

  const dominantColor = colorPalette[0].hex;
  const suggestions = [];

  // 1. Complementary - 180° opposite
  suggestions.push({
    hex: rotateHue(dominantColor, 180),
    name: 'Complementary Pop',
    type: 'complementary',
    description: 'High contrast, bold statement'
  });

  // 2. Split Complementary - 150° and 210°
  suggestions.push({
    hex: rotateHue(dominantColor, 150),
    name: 'Split Warm',
    type: 'split-complementary',
    description: 'Softer contrast than complementary'
  });

  suggestions.push({
    hex: rotateHue(dominantColor, 210),
    name: 'Split Cool',
    type: 'split-complementary',
    description: 'Balanced alternative contrast'
  });

  // 3. Analogous - Adjacent hues (±30°)
  suggestions.push({
    hex: rotateHue(dominantColor, 30),
    name: 'Warm Harmony',
    type: 'analogous',
    description: 'Warm, cohesive look'
  });

  suggestions.push({
    hex: rotateHue(dominantColor, -30),
    name: 'Cool Harmony',
    type: 'analogous',
    description: 'Cool, peaceful vibe'
  });

  // 4. Triadic - 120° apart
  suggestions.push({
    hex: rotateHue(dominantColor, 120),
    name: 'Triadic Vibrant',
    type: 'triadic',
    description: 'Bold, energetic contrast'
  });

  // 5. Neutral versions - Desaturated
  suggestions.push({
    hex: adjustSaturation(dominantColor, 15),
    name: 'Soft Neutral',
    type: 'neutral',
    description: 'Subtle, professional backdrop'
  });

  // 6. Light neutral - Desaturated and lightened
  const lightNeutral = adjustLightness(adjustSaturation(dominantColor, 20), 85);
  suggestions.push({
    hex: lightNeutral,
    name: 'Light Wash',
    type: 'neutral',
    description: 'Airy, minimal background'
  });

  // 7. Classic whites and grays
  suggestions.push(
    {
      hex: '#FFFFFF',
      name: 'Pure White',
      type: 'classic',
      description: 'E-commerce standard'
    },
    {
      hex: '#F5F5F5',
      name: 'Soft Gray',
      type: 'classic',
      description: 'Studio classic'
    },
    {
      hex: '#E8E8E8',
      name: 'Light Gray',
      type: 'classic',
      description: 'Clean and modern'
    },
    {
      hex: '#2C2C2C',
      name: 'Dark Charcoal',
      type: 'classic',
      description: 'Dramatic, high-end'
    }
  );

  return suggestions;
}

/**
 * Get the best auto-matched backdrop (neutral, non-distracting)
 * @param {Array} colorPalette
 * @returns {Object} Backdrop suggestion object
 */
export function getAutoBackdrop(colorPalette) {
  const suggestions = generateBackdropSuggestions(colorPalette);
  // Return the soft neutral option by default
  return suggestions.find(s => s.name === 'Soft Neutral') || suggestions[0];
}

/**
 * Calculate contrast ratio between two colors (for accessibility)
 */
export function getContrastRatio(hex1, hex2) {
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val /= 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}
