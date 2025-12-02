/**
 * colorEmoji - Telegram-friendly color palette display utilities
 *
 * Formats color palettes with emojis and confidence messages for user-facing display
 */

/**
 * Generates a formatted palette message for Telegram
 * @param {Array} palette - Color palette array with {hex, name, simpleName, percentage}
 * @param {String} lang - Language code ('en' or 'tn')
 * @returns {String} Formatted message with emojis
 */
function generatePaletteMessage(palette, lang = 'en') {
  if (!palette || palette.length === 0) {
    return lang === 'en'
      ? '🎨 No colors detected'
      : '🎨 Ma lqitých lawén';
  }

  const dominant = palette[0];
  const secondary = palette.slice(1, 3);

  const emoji = getColorEmoji(dominant.hex);

  let message = lang === 'en'
    ? `🎨 **Detected**: ${emoji} ${dominant.simpleName || dominant.name} (${dominant.percentage}%)`
    : `🎨 **Lawén msakkén**: ${emoji} ${dominant.simpleName || dominant.name} (${dominant.percentage}%)`;

  // Add secondary colors if present
  if (secondary.length > 0) {
    const secList = secondary
      .map(c => {
        const secEmoji = getColorEmoji(c.hex);
        return `${secEmoji} ${c.simpleName || c.name} (${c.percentage}%)`;
      })
      .join(', ');

    message += lang === 'en'
      ? `\n   Secondary: ${secList}`
      : `\n   Theniyin: ${secList}`;
  }

  return message;
}

/**
 * Generates confidence message based on color analysis quality
 * @param {String} confidence - 'high', 'medium', or 'low'
 * @param {Array} colorPalette - The color palette
 * @param {String} lang - Language code
 * @returns {String} Confidence message
 */
function getConfidenceMessage(confidence, colorPalette, lang = 'en') {
  const messages = {
    high: {
      en: '✅ High confidence - color lock engaged',
      tn: '✅ Theqa 3aliya - lawén msakkén mezyan'
    },
    medium: {
      en: '⚠️ Multi-color garment - using colors as guide',
      tn: '⚠️ Hweyyej bel barcha alwen - nestaamel kif guide'
    },
    low: {
      en: '⚠️ Complex pattern - AI will interpret colors',
      tn: '⚠️ Pattern m3a9ed - AI bech ye5tar el alwen'
    }
  };

  return messages[confidence][lang] || messages.medium[lang];
}

/**
 * Maps hex colors to appropriate emoji representations
 * @param {String} hex - Hex color code
 * @returns {String} Emoji representing the color
 */
function getColorEmoji(hex) {
  if (!hex) return '⚪';

  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convert to HSL for better color categorization
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const delta = max - min;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Calculate hue
  let h = 0;
  if (delta !== 0) {
    if (max === r / 255) {
      h = ((g / 255 - b / 255) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g / 255) {
      h = ((b / 255 - r / 255) / delta + 2) / 6;
    } else {
      h = ((r / 255 - g / 255) / delta + 4) / 6;
    }
  }
  h = h * 360;

  // Achromatic (grays, black, white)
  if (s < 0.15) {
    if (l > 0.9) return '⚪'; // White
    if (l > 0.7) return '◻️'; // Light gray
    if (l > 0.3) return '◽'; // Gray
    if (l > 0.15) return '◾'; // Dark gray
    return '⬛'; // Black
  }

  // Chromatic colors based on hue
  if (h >= 0 && h < 15) return '🔴'; // Red
  if (h >= 15 && h < 45) return '🟠'; // Orange-red / Orange
  if (h >= 45 && h < 70) return '🟡'; // Yellow-orange / Yellow
  if (h >= 70 && h < 150) return '🟢'; // Yellow-green / Green
  if (h >= 150 && h < 200) return '💚'; // Cyan / Turquoise
  if (h >= 200 && h < 250) return '🔵'; // Blue
  if (h >= 250 && h < 290) return '🟣'; // Indigo / Purple
  if (h >= 290 && h < 330) return '🟣'; // Purple / Magenta
  if (h >= 330) return '🌸'; // Pink / Red

  return '🎨'; // Fallback
}

/**
 * Generates a compact palette bar (visual representation)
 * @param {Array} palette - Color palette
 * @param {Number} maxWidth - Maximum bar width in characters
 * @returns {String} Visual bar representation
 */
function generatePaletteBar(palette, maxWidth = 20) {
  if (!palette || palette.length === 0) return '';

  const blocks = palette.map(color => {
    const emoji = getColorEmoji(color.hex);
    const count = Math.max(1, Math.round((color.percentage / 100) * maxWidth));
    return emoji.repeat(count);
  });

  return blocks.join('');
}

/**
 * Formats a detailed palette breakdown for admin/debugging
 * @param {Array} palette - Color palette
 * @returns {String} Detailed breakdown
 */
function formatDetailedPalette(palette) {
  if (!palette || palette.length === 0) return 'No palette data';

  return palette
    .map((color, index) => {
      const emoji = getColorEmoji(color.hex);
      return `${index + 1}. ${emoji} ${color.name} - ${color.hex} (${color.percentage}%)`;
    })
    .join('\n');
}

/**
 * Gets a color description for the given palette (for prompt building)
 * @param {Array} palette - Color palette
 * @returns {String} Natural language description
 */
function getColorDescription(palette) {
  if (!palette || palette.length === 0) return 'neutral colored';

  const dominant = palette[0];
  const simpleName = (dominant.simpleName || dominant.name).toLowerCase();

  if (palette.length === 1 || dominant.percentage > 70) {
    return `${simpleName}`;
  }

  const secondary = palette[1];
  const secName = (secondary.simpleName || secondary.name).toLowerCase();

  return `${simpleName} with ${secName} accents`;
}

module.exports = {
  generatePaletteMessage,
  getConfidenceMessage,
  getColorEmoji,
  generatePaletteBar,
  formatDetailedPalette,
  getColorDescription
};
