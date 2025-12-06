'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import type { Shop, ShopThemeId } from '@busi/types';

// ============================================
// Design Token System
// ============================================

export interface ThemeTokens {
  // Colors
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };

  // Typography
  typography: {
    headlineFamily: string;
    bodyFamily: string;
    headlineWeight: 300 | 400 | 500 | 600 | 700 | 800 | 900;
    bodyWeight: 300 | 400 | 500 | 600;
  };

  // Spacing
  spacingScale: 'dense' | 'normal' | 'airy';
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Borders & Radius
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };

  // Shadows
  shadowDepth: 'none' | 'subtle' | 'medium' | 'heavy';
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Component Styles
  buttonStyle: 'filled' | 'outline' | 'pill' | 'square';
  navStyle: 'underline' | 'pill' | 'boxed';
  heroStyle: 'split' | 'full-bleed' | 'centered';
  cardStyle: 'flat' | 'elevated' | 'outlined' | 'glass';

  // Effects
  effects: {
    blur: string;
    gradient: string;
    borderWidth: string;
  };
}

// ============================================
// Theme Definitions (6 Unique Themes)
// ============================================

export const themeDefinitions: Record<string, ThemeTokens> = {
  // 1. High-contrast Dark - Sharp, Heavy, Dramatic
  'high-contrast-dark': {
    palette: {
      primary: '#FFFFFF',
      secondary: '#FF0080',
      accent: '#00FF94',
      background: '#000000',
      surface: '#0A0A0A',
      text: '#FFFFFF',
      textMuted: '#888888',
    },
    typography: {
      headlineFamily: "'Inter', sans-serif",
      bodyFamily: "'Inter', sans-serif",
      headlineWeight: 900,
      bodyWeight: 500,
    },
    spacingScale: 'dense',
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
    },
    radius: {
      none: '0px',
      sm: '0px',
      md: '2px',
      lg: '4px',
      full: '0px',
    },
    shadowDepth: 'heavy',
    shadows: {
      sm: '0 2px 8px rgba(255, 0, 128, 0.3)',
      md: '0 4px 16px rgba(255, 0, 128, 0.4)',
      lg: '0 8px 32px rgba(255, 0, 128, 0.5)',
      xl: '0 16px 48px rgba(255, 0, 128, 0.6)',
    },
    buttonStyle: 'square',
    navStyle: 'boxed',
    heroStyle: 'full-bleed',
    cardStyle: 'outlined',
    effects: {
      blur: '0px',
      gradient: 'linear-gradient(135deg, rgba(255,0,128,0.1) 0%, rgba(0,255,148,0.1) 100%)',
      borderWidth: '2px',
    },
  },

  // 2. Soft Pastel - Rounded, Light, Airy
  'soft-pastel': {
    palette: {
      primary: '#EC4899',
      secondary: '#A78BFA',
      accent: '#60A5FA',
      background: '#FFF7FB',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#9CA3AF',
    },
    typography: {
      headlineFamily: "'Poppins', sans-serif",
      bodyFamily: "'Inter', sans-serif",
      headlineWeight: 600,
      bodyWeight: 400,
    },
    spacingScale: 'airy',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
    radius: {
      none: '0px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      full: '9999px',
    },
    shadowDepth: 'subtle',
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.08)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    },
    buttonStyle: 'pill',
    navStyle: 'pill',
    heroStyle: 'centered',
    cardStyle: 'elevated',
    effects: {
      blur: '0px',
      gradient: 'linear-gradient(135deg, rgba(236,72,153,0.05) 0%, rgba(167,139,250,0.05) 100%)',
      borderWidth: '1px',
    },
  },

  // 3. Monochrome Editorial - Serif, Underline, Flat
  'monochrome-editorial': {
    palette: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#666666',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#000000',
      textMuted: '#737373',
    },
    typography: {
      headlineFamily: "'Playfair Display', serif",
      bodyFamily: "'Inter', sans-serif",
      headlineWeight: 700,
      bodyWeight: 400,
    },
    spacingScale: 'normal',
    spacing: {
      xs: '0.375rem',
      sm: '0.75rem',
      md: '1.25rem',
      lg: '1.75rem',
      xl: '2.5rem',
    },
    radius: {
      none: '0px',
      sm: '0px',
      md: '0px',
      lg: '4px',
      full: '0px',
    },
    shadowDepth: 'none',
    shadows: {
      sm: 'none',
      md: 'none',
      lg: '0 1px 2px rgba(0, 0, 0, 0.05)',
      xl: '0 2px 4px rgba(0, 0, 0, 0.08)',
    },
    buttonStyle: 'outline',
    navStyle: 'underline',
    heroStyle: 'split',
    cardStyle: 'flat',
    effects: {
      blur: '0px',
      gradient: 'none',
      borderWidth: '1px',
    },
  },

  // 4. Vivid Accent - Geometric, Pill Buttons, Strong CTA
  'vivid-accent': {
    palette: {
      primary: '#0EA5E9',
      secondary: '#F59E0B',
      accent: '#EF4444',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      textMuted: '#64748B',
    },
    typography: {
      headlineFamily: "'Montserrat', sans-serif",
      bodyFamily: "'Inter', sans-serif",
      headlineWeight: 800,
      bodyWeight: 500,
    },
    spacingScale: 'normal',
    spacing: {
      xs: '0.375rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    radius: {
      none: '0px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      full: '9999px',
    },
    shadowDepth: 'medium',
    shadows: {
      sm: '0 1px 2px rgba(14, 165, 233, 0.1)',
      md: '0 4px 6px rgba(14, 165, 233, 0.15)',
      lg: '0 10px 15px rgba(14, 165, 233, 0.2)',
      xl: '0 20px 25px rgba(14, 165, 233, 0.25)',
    },
    buttonStyle: 'pill',
    navStyle: 'pill',
    heroStyle: 'centered',
    cardStyle: 'elevated',
    effects: {
      blur: '0px',
      gradient: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(245,158,11,0.1) 100%)',
      borderWidth: '2px',
    },
  },

  // 5. Brutalist - Big Type, Square, Dense
  'brutalist': {
    palette: {
      primary: '#FFFF00',
      secondary: '#000000',
      accent: '#FF00FF',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#000000',
      textMuted: '#525252',
    },
    typography: {
      headlineFamily: "'Inter', sans-serif",
      bodyFamily: "'Inter', sans-serif",
      headlineWeight: 900,
      bodyWeight: 600,
    },
    spacingScale: 'dense',
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
    },
    radius: {
      none: '0px',
      sm: '0px',
      md: '0px',
      lg: '0px',
      full: '0px',
    },
    shadowDepth: 'heavy',
    shadows: {
      sm: '3px 3px 0px #000000',
      md: '5px 5px 0px #000000',
      lg: '8px 8px 0px #000000',
      xl: '12px 12px 0px #000000',
    },
    buttonStyle: 'square',
    navStyle: 'boxed',
    heroStyle: 'full-bleed',
    cardStyle: 'outlined',
    effects: {
      blur: '0px',
      gradient: 'none',
      borderWidth: '3px',
    },
  },

  // 6. Glassmorphic - Blurred, Thin Borders, Gradients
  'glassmorphic': {
    palette: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F472B6',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.7)',
    },
    typography: {
      headlineFamily: "'Inter', sans-serif",
      bodyFamily: "'Inter', sans-serif",
      headlineWeight: 600,
      bodyWeight: 400,
    },
    spacingScale: 'normal',
    spacing: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    radius: {
      none: '0px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      full: '9999px',
    },
    shadowDepth: 'subtle',
    shadows: {
      sm: '0 4px 6px rgba(0, 0, 0, 0.1)',
      md: '0 10px 15px rgba(0, 0, 0, 0.1)',
      lg: '0 20px 25px rgba(0, 0, 0, 0.15)',
      xl: '0 25px 50px rgba(0, 0, 0, 0.2)',
    },
    buttonStyle: 'pill',
    navStyle: 'pill',
    heroStyle: 'centered',
    cardStyle: 'glass',
    effects: {
      blur: '12px',
      gradient: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      borderWidth: '1px',
    },
  },
};

// ============================================
// Theme Context
// ============================================

interface ThemeContextType {
  shop: Shop;
  tokens: ThemeTokens;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ============================================
// Provider Component
// ============================================

interface ThemeProviderProps {
  shop: Shop;
  children: ReactNode;
}

// Resolve which theme id to use and return its tokens
function getThemeTokens(shop: Shop): { id: ShopThemeId; tokens: ThemeTokens } {
  // Explicit fallback mapping so older template values still give distinct looks
  const templateFallbacks: Record<Shop['template'], ShopThemeId> = {
    minimal: 'monochrome-editorial',
    boutique: 'soft-pastel',
    kids: 'vivid-accent',
    street: 'high-contrast-dark',
  };

  const explicitThemeId = shop.themeId as ShopThemeId | undefined;
  const selectedThemeId: ShopThemeId =
    explicitThemeId && themeDefinitions[explicitThemeId]
      ? explicitThemeId
      : templateFallbacks[shop.template] || 'vivid-accent';

  return { id: selectedThemeId, tokens: themeDefinitions[selectedThemeId] };
}

export function ThemeProvider({ shop, children }: ThemeProviderProps) {
  const { id: themeId, tokens } = getThemeTokens(shop);

  useEffect(() => {
    const root = document.documentElement;

    // Apply color palette
    root.style.setProperty('--color-primary', tokens.palette.primary);
    root.style.setProperty('--color-secondary', tokens.palette.secondary);
    root.style.setProperty('--color-accent', tokens.palette.accent);
    root.style.setProperty('--color-background', tokens.palette.background);
    root.style.setProperty('--color-surface', tokens.palette.surface);
    root.style.setProperty('--color-text', tokens.palette.text);
    root.style.setProperty('--color-text-muted', tokens.palette.textMuted);

    // Apply typography
    root.style.setProperty('--font-headline', tokens.typography.headlineFamily);
    root.style.setProperty('--font-body', tokens.typography.bodyFamily);
    root.style.setProperty('--font-weight-headline', tokens.typography.headlineWeight.toString());
    root.style.setProperty('--font-weight-body', tokens.typography.bodyWeight.toString());

    // Apply spacing
    root.style.setProperty('--spacing-xs', tokens.spacing.xs);
    root.style.setProperty('--spacing-sm', tokens.spacing.sm);
    root.style.setProperty('--spacing-md', tokens.spacing.md);
    root.style.setProperty('--spacing-lg', tokens.spacing.lg);
    root.style.setProperty('--spacing-xl', tokens.spacing.xl);

    // Apply radius
    root.style.setProperty('--radius-none', tokens.radius.none);
    root.style.setProperty('--radius-sm', tokens.radius.sm);
    root.style.setProperty('--radius-md', tokens.radius.md);
    root.style.setProperty('--radius-lg', tokens.radius.lg);
    root.style.setProperty('--radius-full', tokens.radius.full);

    // Apply shadows
    root.style.setProperty('--shadow-sm', tokens.shadows.sm);
    root.style.setProperty('--shadow-md', tokens.shadows.md);
    root.style.setProperty('--shadow-lg', tokens.shadows.lg);
    root.style.setProperty('--shadow-xl', tokens.shadows.xl);

    // Apply effects
    root.style.setProperty('--blur', tokens.effects.blur);
    root.style.setProperty('--gradient', tokens.effects.gradient);
    root.style.setProperty('--border-width', tokens.effects.borderWidth);

    // Apply data attributes for conditional styling
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-button-style', tokens.buttonStyle);
    root.setAttribute('data-nav-style', tokens.navStyle);
    root.setAttribute('data-hero-style', tokens.heroStyle);
    root.setAttribute('data-card-style', tokens.cardStyle);
    root.setAttribute('data-spacing-scale', tokens.spacingScale);
    root.setAttribute('data-shadow-depth', tokens.shadowDepth);

    return () => {
      root.removeAttribute('data-theme');
      root.removeAttribute('data-button-style');
      root.removeAttribute('data-nav-style');
      root.removeAttribute('data-hero-style');
      root.removeAttribute('data-card-style');
      root.removeAttribute('data-spacing-scale');
      root.removeAttribute('data-shadow-depth');
    };
  }, [tokens]);

  return (
    <ThemeContext.Provider value={{ shop, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================
// Validation: Check Distinctness
// ============================================

export function validateThemeDistinctness(
  theme1: ThemeTokens,
  theme2: ThemeTokens
): { similar: boolean; matchCount: number; matches: string[] } {
  const matches: string[] = [];

  if (theme1.palette.primary === theme2.palette.primary) matches.push('primary color');
  if (theme1.typography.headlineFamily === theme2.typography.headlineFamily)
    matches.push('headline font');
  if (theme1.radius.md === theme2.radius.md) matches.push('radius');
  if (theme1.shadowDepth === theme2.shadowDepth) matches.push('shadow depth');
  if (theme1.spacingScale === theme2.spacingScale) matches.push('spacing scale');
  if (theme1.buttonStyle === theme2.buttonStyle) matches.push('button style');
  if (theme1.navStyle === theme2.navStyle) matches.push('nav style');

  return {
    similar: matches.length >= 3,
    matchCount: matches.length,
    matches,
  };
}
