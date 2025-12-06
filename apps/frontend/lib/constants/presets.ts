import type { ShopTemplate, ShopHeroStyle, ShopCardStyle, ShopFont } from '@busi/types';

export interface ThemePreset {
  id: string;
  themeId: string; // Maps to ThemeProvider theme definition
  name: string;
  description: string;
  category: 'fashion' | 'electronics' | 'food' | 'handmade' | 'beauty' | 'general';
  style: 'minimal' | 'bold' | 'elegant' | 'playful';
  colorScheme: 'light' | 'dark' | 'colorful' | 'monochrome';
  badge?: 'popular' | 'premium' | 'new';

  // Key differences from other presets
  changes: string[]; // 3 key visual differences

  // Visual assets
  screenshot: string;
  thumbnail: string;

  // Best for
  bestFor: string[];
  mood: string[];

  // Configuration (deprecated - using themeId now)
  values: {
    template: ShopTemplate;
    heroStyle: ShopHeroStyle;
    cardStyle: ShopCardStyle;
    primaryColor: string;
    secondaryColor: string;
    font: ShopFont;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  // 1. Soft Pastel — rounded + airy + gentle shadows
  {
    id: 'soft-pastel',
    themeId: 'soft-pastel',
    name: 'Soft Pastel',
    description: 'Rounded corners + airy spacing + subtle shadows. Perfect for beauty, wellness, and gentle aesthetics.',
    category: 'beauty',
    style: 'elegant',
    colorScheme: 'light',
    badge: 'popular',
    changes: ['Pill buttons', 'Large rounded corners', 'Airy spacing'],
    screenshot: '/presets/soft-pastel-full.jpg',
    thumbnail: '/presets/soft-pastel-thumb.jpg',
    bestFor: ['Beauty Products', 'Cosmetics', 'Wellness', 'Feminine Brands'],
    mood: ['Soft', 'Gentle', 'Feminine', 'Elegant'],
    values: {
      template: 'boutique',
      heroStyle: 'small-hero',
      cardStyle: 'elevated',
      primaryColor: '#EC4899',
      secondaryColor: '#A78BFA',
      font: 'poppins',
    },
  },

  // 2. Editorial — monochrome + serif + underline nav
  {
    id: 'monochrome-editorial',
    themeId: 'monochrome-editorial',
    name: 'Editorial',
    description: 'Monochrome + serif headlines + underline nav. Clean editorial design for sophisticated brands.',
    category: 'fashion',
    style: 'minimal',
    colorScheme: 'monochrome',
    badge: 'premium',
    changes: ['Serif headlines', 'Underline navigation', 'Flat design with no shadows'],
    screenshot: '/presets/editorial-full.jpg',
    thumbnail: '/presets/editorial-thumb.jpg',
    bestFor: ['Luxury Boutiques', 'High-end Fashion', 'Editorial Brands'],
    mood: ['Sophisticated', 'Editorial', 'Refined', 'Timeless'],
    values: {
      template: 'minimal',
      heroStyle: 'big-banner',
      cardStyle: 'square',
      primaryColor: '#000000',
      secondaryColor: '#404040',
      font: 'playfair',
    },
  },

  // 3. Bold Street — neon + chunky sans + heavy shadows
  {
    id: 'high-contrast-dark',
    themeId: 'high-contrast-dark',
    name: 'Bold Street',
    description: 'Neon accents + chunky sans + heavy shadows. High-energy design for urban and youth brands.',
    category: 'fashion',
    style: 'bold',
    colorScheme: 'dark',
    badge: 'new',
    changes: ['Neon pink accent', 'Square corners', 'Heavy dramatic shadows'],
    screenshot: '/presets/bold-street-full.jpg',
    thumbnail: '/presets/bold-street-thumb.jpg',
    bestFor: ['Streetwear', 'Urban Fashion', 'Electronics', 'Youth Brands'],
    mood: ['Bold', 'Energetic', 'Urban', 'Striking'],
    values: {
      template: 'street',
      heroStyle: 'big-banner',
      cardStyle: 'square',
      primaryColor: '#FFFFFF',
      secondaryColor: '#FF0080',
      font: 'inter',
    },
  },

  // 4. Vivid Accent — geometric + pill buttons + strong CTA
  {
    id: 'vivid-accent',
    themeId: 'vivid-accent',
    name: 'Vivid Accent',
    description: 'Geometric sans + pill buttons + strong CTAs. Eye-catching design with vibrant accents.',
    category: 'general',
    style: 'bold',
    colorScheme: 'colorful',
    changes: ['Vibrant blue/orange accent', 'Geometric pill buttons', 'Medium shadows'],
    screenshot: '/presets/vivid-accent-full.jpg',
    thumbnail: '/presets/vivid-accent-thumb.jpg',
    bestFor: ['General Stores', 'E-commerce', 'Tech Products', 'Modern Brands'],
    mood: ['Energetic', 'Modern', 'Vibrant', 'Professional'],
    values: {
      template: 'minimal',
      heroStyle: 'small-hero',
      cardStyle: 'elevated',
      primaryColor: '#0EA5E9',
      secondaryColor: '#F59E0B',
      font: 'montserrat',
    },
  },

  // 5. Brutalist — big type + square + dense spacing
  {
    id: 'brutalist',
    themeId: 'brutalist',
    name: 'Brutalist',
    description: 'Big type + square corners + dense spacing. Raw, bold design with hard drop shadows.',
    category: 'fashion',
    style: 'bold',
    colorScheme: 'colorful',
    changes: ['Heavy 900 weight headlines', 'Hard drop shadows (8px offset)', 'Dense spacing'],
    screenshot: '/presets/brutalist-full.jpg',
    thumbnail: '/presets/brutalist-thumb.jpg',
    bestFor: ['Artistic Brands', 'Bold Fashion', 'Statement Products'],
    mood: ['Bold', 'Raw', 'Artistic', 'Unconventional'],
    values: {
      template: 'street',
      heroStyle: 'carousel',
      cardStyle: 'square',
      primaryColor: '#FFFF00',
      secondaryColor: '#000000',
      font: 'inter',
    },
  },

  // 6. Glassmorphic — blurred + thin borders + gradients
  {
    id: 'glassmorphic',
    themeId: 'glassmorphic',
    name: 'Glassmorphic',
    description: 'Blurred surfaces + thin borders + subtle gradients. Modern glass effect with depth.',
    category: 'beauty',
    style: 'elegant',
    colorScheme: 'colorful',
    badge: 'premium',
    changes: ['12px blur effect', 'Gradient background', 'Glass card surfaces'],
    screenshot: '/presets/glassmorphic-full.jpg',
    thumbnail: '/presets/glassmorphic-thumb.jpg',
    bestFor: ['Premium Beauty', 'Modern Brands', 'Tech Products', 'Luxury Cosmetics'],
    mood: ['Modern', 'Sophisticated', 'Premium', 'Innovative'],
    values: {
      template: 'minimal',
      heroStyle: 'small-hero',
      cardStyle: 'elevated',
      primaryColor: '#8B5CF6',
      secondaryColor: '#06B6D4',
      font: 'inter',
    },
  },
];

// Helper functions
export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((preset) => preset.id === id);
}

export function getPresetsByCategory(category: ThemePreset['category']): ThemePreset[] {
  return THEME_PRESETS.filter((preset) => preset.category === category);
}

export function getPresetsByStyle(style: ThemePreset['style']): ThemePreset[] {
  return THEME_PRESETS.filter((preset) => preset.style === style);
}

export function getPresetsByColorScheme(colorScheme: ThemePreset['colorScheme']): ThemePreset[] {
  return THEME_PRESETS.filter((preset) => preset.colorScheme === colorScheme);
}

export function searchPresets(query: string): ThemePreset[] {
  const lowerQuery = query.toLowerCase();
  return THEME_PRESETS.filter(
    (preset) =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.description.toLowerCase().includes(lowerQuery) ||
      preset.bestFor.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      preset.mood.some((mood) => mood.toLowerCase().includes(lowerQuery))
  );
}
