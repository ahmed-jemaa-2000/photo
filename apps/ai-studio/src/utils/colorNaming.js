/**
 * Convert hex color codes to human-readable color names
 * Uses hue-based categorization with saturation and lightness considerations
 */

/**
 * Convert hex to HSL
 */
function hexToHsl(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

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

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}

/**
 * Get color name from hex code
 * @param {string} hex - Hex color code (e.g., "#FF5733")
 * @param {boolean} forceWhite - Force white classification for bright garments
 * @returns {string} Human-readable color name
 */
export function getColorName(hex, forceWhite = false) {
  const hsl = hexToHsl(hex);
  if (!hsl) return 'Unknown';

  // Force white if explicitly flagged (from RGB brightness detection in extraction)
  if (forceWhite) return 'White';

  const { h, s, l } = hsl;

  // BRIGHTNESS-FIRST DETECTION
  // Extract RGB values for brightness check
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const avgRGB = (r + g + b) / 3;

    // If RGB average is very high, it's white regardless of HSL
    if (avgRGB > 240) return 'White';
    if (avgRGB > 220 && s < 15) return 'Off-White';
  }

  // Handle achromatic colors (grays, black, white)
  // Aggressive White detection for cool lighting (shadows on white fabric often look blue/cyan)
  // If it's bright enough, call it white regardless of saturation (within reason)

  // Lower threshold to catch slightly shadowed whites
  if (l > 85 && s < 10) return 'White';  // Very desaturated light colors
  if (l > 90) return 'White';  // Pure whites

  // If it's reasonably bright and low saturation, it's off-white/white
  if (l > 80 && s < 30) return 'Off-White';

  // Special handling for "Blue/Cyan" shadows on white
  // If hue is Cyan/Blue (150-250) and lightness is decent (>60) and saturation isn't too high (<40)
  // It's likely a white garment in shadow
  if ((h > 150 && h < 260) && l > 60 && s < 40) {
    return 'White';
  }

  // Expanded White/Off-White detection for very low saturation (shadowed white)
  if (s < 10) {
    if (l > 85) return 'White';
    if (l > 65) return 'Off-White'; // Lowered from 80 to catch gray-ish whites
    if (l > 50) return 'Gray';
    if (l > 30) return 'Dark Gray';
    if (l > 15) return 'Charcoal';
    return 'Black';
  }

  if (s < 15) {
    if (l > 70) return 'Light Gray';
    if (l > 50) return 'Gray';
    if (l > 30) return 'Dark Gray';
    if (l > 15) return 'Charcoal';
    return 'Black';
  }


  // Determine lightness modifier
  let lightnessPrefix = '';
  if (l > 85) lightnessPrefix = 'Very Light ';
  else if (l > 70) lightnessPrefix = 'Light ';
  else if (l > 50) lightnessPrefix = '';
  else if (l > 30) lightnessPrefix = 'Dark ';
  else lightnessPrefix = 'Very Dark ';

  // Determine saturation modifier
  let saturationSuffix = '';
  if (s < 25) saturationSuffix = ' (Muted)';
  else if (s < 50) saturationSuffix = '';
  else if (s < 75) saturationSuffix = ' (Vibrant)';
  else saturationSuffix = ' (Bold)';

  // Determine base hue name
  let baseName = '';
  if (h >= 0 && h < 15) baseName = 'Red';
  else if (h >= 15 && h < 30) baseName = 'Red-Orange';
  else if (h >= 30 && h < 45) baseName = 'Orange';
  else if (h >= 45 && h < 60) baseName = 'Yellow-Orange';
  else if (h >= 60 && h < 75) baseName = 'Yellow';
  else if (h >= 75 && h < 90) baseName = 'Yellow-Green';
  else if (h >= 90 && h < 150) baseName = 'Green';
  else if (h >= 150 && h < 180) baseName = 'Cyan';
  else if (h >= 180 && h < 210) baseName = 'Light Blue';
  else if (h >= 210 && h < 240) baseName = 'Blue';
  else if (h >= 240 && h < 270) baseName = 'Indigo';
  else if (h >= 270 && h < 300) baseName = 'Purple';
  else if (h >= 300 && h < 330) baseName = 'Magenta';
  else if (h >= 330 && h < 345) baseName = 'Pink';
  else baseName = 'Red';

  // Special cases for browns
  if ((h >= 20 && h < 45) && l < 50 && s < 60) {
    baseName = 'Brown';
    saturationSuffix = '';
  }

  // Special cases for pinks
  if ((h >= 330 || h < 30) && l > 70 && s > 20) {
    baseName = 'Pink';
  }

  // Simplify for very light or very dark colors
  if (l > 85 || l < 15) {
    saturationSuffix = '';
  }

  return `${lightnessPrefix}${baseName}${saturationSuffix}`.trim();
}

/**
 * Get a simplified, single-word color name
 * @param {string} hex - Hex color code
 * @returns {string} Simple color name
 */
export function getSimpleColorName(hex) {
  const hsl = hexToHsl(hex);
  if (!hsl) return 'Gray';

  const { h, s, l } = hsl;

  // Achromatic
  if (s < 10) {
    if (l > 90) return 'White';
    if (l > 70) return 'Light Gray';
    if (l > 30) return 'Gray';
    return 'Black';
  }

  // Browns
  if ((h >= 20 && h < 45) && l < 50) return 'Brown';

  // Main hues
  if (h >= 0 && h < 30) return 'Red';
  if (h >= 30 && h < 60) return 'Orange';
  if (h >= 60 && h < 90) return 'Yellow';
  if (h >= 90 && h < 150) return 'Green';
  if (h >= 150 && h < 210) return 'Cyan';
  if (h >= 210 && h < 270) return 'Blue';
  if (h >= 270 && h < 300) return 'Purple';
  if (h >= 300 && h < 330) return 'Magenta';
  return 'Pink';
}

/**
 * Add color names to a palette array
 * @param {Array} palette - Array of color objects with hex property
 * @returns {Array} Palette with added name property
 */
export function addColorNames(palette) {
  return palette.map(color => ({
    ...color,
    name: getColorName(color.hex),
    simpleName: getSimpleColorName(color.hex)
  }));
}
