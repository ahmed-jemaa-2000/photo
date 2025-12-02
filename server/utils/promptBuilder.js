/**
 * PromptBuilder - Production-grade prompt construction for AI image generation
 *
 * This class builds sophisticated prompts matching the web UI's quality by:
 * - Using weighted priority sections (CRITICAL > IMPORTANT > SUPPORTING > CONTEXT)
 * - Applying category-specific templates (shoes vs clothes)
 * - Implementing color confidence-based adjustments
 * - Using semantic color naming for better AI interpretation
 */

class PromptBuilder {
  constructor({ category, colorPalette, modelPersona, backdrop, colorConfidence }) {
    this.category = category || 'clothes';
    this.colorPalette = colorPalette || [];
    this.modelPersona = modelPersona || {};
    this.backdrop = backdrop || {};
    this.colorConfidence = colorConfidence || 'medium';

    // Semantic color mapping for AI-friendly naming
    this.AI_COLOR_MAP = {
      'Light Red-Orange (Vibrant)': 'coral',
      'Light Red-Orange': 'coral',
      'Red-Orange': 'burnt orange',
      'Very Dark Blue': 'navy',
      'Dark Blue': 'navy',
      'Light Blue': 'sky blue',
      'Very Light Blue': 'powder blue',
      'Yellow-Orange': 'amber',
      'Yellow-Green': 'lime',
      'Light Gray': 'light gray',
      'Very Light Gray': 'off-white',
      'Dark Gray': 'charcoal',
      'Very Dark Gray': 'charcoal',
      'Light Pink': 'blush',
      'Pink': 'pink',
      'Light Purple': 'lavender',
      'Dark Purple': 'deep purple',
      'Light Green': 'mint',
      'Dark Green': 'forest green',
      'Very Dark Red': 'burgundy',
      'Dark Red': 'maroon'
    };

    // Variation cues for pose diversity (randomly selected)
    this.VARIATION_CUES = [
      'Use a fresh pose variation: slight head tilt, relaxed weight shift, natural arm positioning.',
      'Change the stance: a gentle walk mid-step, natural arm swing, confident stride.',
      'Try a seated or leaning pose with natural posture and garment drape visible.',
      'Vary the camera: slightly lower angle for presence, direct eye contact.',
      'Add dynamic energy: a light turn of the torso, fabric in motion, natural movement.'
    ];
  }

  /**
   * Builds the complete prompt with all sections
   */
  build() {
    return [
      this._buildCriticalSection(),
      this._buildImportantSection(),
      this._buildSupportingSection(),
      this._buildContextSection(),
      this._buildNegativeSection()
    ].filter(Boolean).join(' ');
  }

  /**
   * CRITICAL SECTION - Non-negotiable requirements
   * Priority: Highest
   */
  _buildCriticalSection() {
    const parts = [];

    // Color fidelity with semantic naming
    if (this.colorPalette.length > 0) {
      const dominantColor = this.colorPalette[0];
      const semanticName = this._getSemanticColorName(dominantColor.name);
      const hex = dominantColor.hex;

      // Adjust aggressiveness based on confidence
      if (this.colorConfidence === 'high') {
        parts.push(`CRITICAL: The garment is ${semanticName} (${hex}). Match this exact color with precision. No hue shifts, no recoloring.`);
      } else if (this.colorConfidence === 'medium') {
        parts.push(`CRITICAL: The garment is primarily ${semanticName} (${hex}). Use this as the dominant color, maintaining accuracy.`);
      } else {
        parts.push(`IMPORTANT: The garment features ${semanticName} tones (${hex}). Interpret naturally while respecting the overall palette.`);
      }
    }

    // Design preservation rules
    parts.push(
      'CRITICAL: Preserve the exact garment design - logos, text, patterns, prints, embroidery, and all visual details must remain identical. Do not add, remove, or modify any design elements.'
    );

    // Category-specific critical requirements
    if (this.category === 'shoes') {
      parts.push(
        'CRITICAL: This is footwear. Maintain exact shoe type, sole design, upper construction, lacing/closure system, and heel type. Focus on shoe details with appropriate low-angle or profile view.'
      );
    } else {
      parts.push(
        'CRITICAL: Maintain exact garment silhouette, fit, length, fabric texture, and drape. The garment type and construction must stay identical.'
      );
    }

    return parts.join(' ');
  }

  /**
   * IMPORTANT SECTION - Core directives
   * Priority: High
   */
  _buildImportantSection() {
    const parts = [];

    // Model persona description
    if (this.modelPersona.description) {
      parts.push(this.modelPersona.description);
    }

    // Category-specific pose/angle guidance
    if (this.category === 'shoes') {
      parts.push(
        'Camera angle: Low angle 30-45 degrees from ground, or profile view to showcase shoe design. Model feet positioned to display both sole and upper. Natural standing or walking position.'
      );
    } else {
      parts.push(
        'Full-body or 3/4 length shot with garment fully visible. Natural standing pose with relaxed weight shift, arms at sides or naturally positioned. Camera at eye level or slightly below.'
      );
    }

    return parts.join(' ');
  }

  /**
   * SUPPORTING SECTION - Enhancements
   * Priority: Medium
   */
  _buildSupportingSection() {
    const parts = [];

    // Backdrop description
    if (this.backdrop.prompt) {
      parts.push(this.backdrop.prompt);
    }

    // Full palette context (top 3 colors)
    if (this.colorPalette.length > 1) {
      const paletteDesc = this.colorPalette
        .slice(0, 3)
        .map(c => {
          const semantic = this._getSemanticColorName(c.name);
          return `${semantic} (${c.percentage}%)`;
        })
        .join(', ');
      parts.push(`Garment color palette: ${paletteDesc}.`);
    }

    // Random variation cue for diversity
    const variationCue = this.VARIATION_CUES[Math.floor(Math.random() * this.VARIATION_CUES.length)];
    parts.push(variationCue);

    return parts.join(' ');
  }

  /**
   * CONTEXT SECTION - Technical specs
   * Priority: Low-Medium
   */
  _buildContextSection() {
    const parts = [];

    // Quality specifications
    parts.push('Photorealistic rendering, high resolution output (minimum 1024px), professional photography quality.');

    // Lighting requirements
    parts.push('Skin-safe lighting with natural color temperature. Avoid harsh shadows or overexposure. Soft, even illumination that shows fabric texture.');

    // Color accuracy reinforcement
    if (this.colorConfidence === 'high') {
      parts.push('Use the uploaded garment image as ground truth for color matching. Lock to exact hex values.');
    }

    return parts.join(' ');
  }

  /**
   * NEGATIVE SECTION - Avoidance rules
   * Priority: Low (but important)
   */
  _buildNegativeSection() {
    const negatives = [
      'Do not add accessories, jewelry, props, or extra garments not in the original',
      'Do not alter garment colors, patterns, or designs',
      'Do not add text, graphics, or decorative elements',
      'Avoid distortions, warping, or unnatural body proportions',
      'Avoid blurry, low-quality, or artificial-looking results'
    ];

    // Category-specific negatives
    if (this.category === 'shoes') {
      negatives.push('No floating shoes, no disembodied feet, no unnatural shoe deformations');
    } else {
      negatives.push('No wardrobe malfunctions, no garment transparency issues, no inappropriate fit');
    }

    return `Negative prompt: ${negatives.join('; ')}.`;
  }

  /**
   * Converts technical color names to AI-friendly semantic names
   */
  _getSemanticColorName(colorName) {
    if (!colorName) return 'neutral';

    // Check direct mapping first
    if (this.AI_COLOR_MAP[colorName]) {
      return this.AI_COLOR_MAP[colorName];
    }

    // Fallback: extract base color (remove parentheticals and prefixes)
    let semantic = colorName
      .split('(')[0]  // Remove (Vibrant), (Muted), etc.
      .trim()
      .toLowerCase();

    // Simplify "very light/dark" to just "light/dark"
    semantic = semantic.replace(/^very\s+/i, '');

    return semantic;
  }

  /**
   * Static method to assess color palette confidence
   * Returns 'high', 'medium', or 'low'
   */
  static assessColorConfidence(palette) {
    if (!palette || palette.length === 0) return 'low';

    const dominant = palette[0];
    const dominantPercentage = dominant?.percentage || 0;

    // Check if dominant color is a neutral (may indicate background noise)
    const isNeutral = this._isNeutralColor(dominant?.hex);

    // High confidence: Clear dominant color (>40%) and not a neutral
    if (dominantPercentage > 40 && !isNeutral) {
      return 'high';
    }

    // Medium confidence: Moderate dominance (25-40%) or neutral with high coverage
    if (dominantPercentage > 25) {
      return 'medium';
    }

    // Low confidence: Fragmented palette or very low dominance
    return 'low';
  }

  /**
   * Helper to detect neutral colors that might be background
   */
  static _isNeutralColor(hex) {
    if (!hex) return true;

    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(1, 3), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Convert to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2 / 255;
    const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1)) / 255;

    // Neutral if saturation < 15% (very desaturated)
    return s < 0.15;
  }

  /**
   * Utility to get prompt token estimate (rough approximation)
   */
  getTokenEstimate() {
    const prompt = this.build();
    // Rough estimate: 4 characters per token
    return Math.ceil(prompt.length / 4);
  }

  /**
   * Debug method to see all sections separately
   */
  debug() {
    return {
      critical: this._buildCriticalSection(),
      important: this._buildImportantSection(),
      supporting: this._buildSupportingSection(),
      context: this._buildContextSection(),
      negative: this._buildNegativeSection(),
      tokenEstimate: this.getTokenEstimate()
    };
  }
}

module.exports = PromptBuilder;
