/**
 * Ad Creative Configuration
 * Professional marketing poster design system
 * 
 * Includes:
 * - Design Templates (complete poster styles)
 * - Decorative Elements (3D shapes, textures, effects)
 * - Composition Styles (layout patterns)
 * - Typography Styles (font aesthetics)
 * - Color Schemes (preset palettes)
 * - Output Formats (aspect ratios)
 * - Product Categories
 */

// ============================================
// DESIGN TEMPLATES - Complete poster styles
// ============================================

const DESIGN_TEMPLATES = {
    fitness_energy: {
        id: 'fitness_energy',
        name: { en: 'Fitness Energy', ar: 'طاقة رياضية', fr: 'Énergie Fitness' },
        preview: '💪',
        category: 'sports',
        description: {
            en: 'Bold, dynamic gym/fitness style with geometric shapes',
            ar: 'أسلوب رياضي جريء مع أشكال هندسية',
            fr: 'Style gym/fitness audacieux avec formes géométriques'
        },
        promptBase: `Dynamic high-energy fitness marketing poster design. Bold diagonal composition with subject appearing to break through the frame boundaries. Dramatic high-contrast lighting creating powerful shadows on the subject. Floating 3D geometric cubes and shapes in vibrant neon brand colors scattered dynamically around the composition. Torn paper grunge texture effect at the bottom edge creating urban street art feel. Motion blur energy lines and light streaks radiating outward from the center. Industrial gym aesthetic with concrete texture hints. Professional sports advertising quality.`,
        colorSuggestion: { primary: '#00FF66', secondary: '#1A1A2E', accent: '#FFFFFF' },
        decorativeSuggestions: ['geometric_3d', 'grunge_texture', 'abstract_lines'],
        compositionSuggestion: 'subject_breaking'
    },

    modern_gradient: {
        id: 'modern_gradient',
        name: { en: 'Modern Gradient', ar: 'تدرج حديث', fr: 'Dégradé Moderne' },
        preview: '🔵',
        category: 'corporate',
        description: {
            en: 'Clean modern look with smooth gradient overlays',
            ar: 'مظهر عصري نظيف مع تدرجات ناعمة',
            fr: 'Look moderne et épuré avec dégradés fluides'
        },
        promptBase: `Modern sophisticated marketing poster with smooth flowing gradient overlays. Blue to purple gradient wave sweeping elegantly across the bottom third of the composition. Subject positioned on left side with clean professional studio lighting creating soft shadows. Large clean white negative space area on right side perfect for text placement. Geometric corner accent shapes in translucent brand colors. Subtle triangular and circular decorative elements floating with soft drop shadows. Professional minimalist aesthetic. Clean crisp edges throughout. Corporate advertising quality.`,
        colorSuggestion: { primary: '#4A3AFF', secondary: '#FFFFFF', accent: '#7C3AED' },
        decorativeSuggestions: ['gradient_waves', 'geometric_3d'],
        compositionSuggestion: 'subject_left'
    },

    luxury_dark: {
        id: 'luxury_dark',
        name: { en: 'Luxury Dark', ar: 'فخامة داكنة', fr: 'Luxe Sombre' },
        preview: '⬛',
        category: 'luxury',
        description: {
            en: 'Premium dark aesthetic with gold accents',
            ar: 'جمالية داكنة فاخرة مع لمسات ذهبية',
            fr: 'Esthétique sombre premium avec accents dorés'
        },
        promptBase: `Premium luxury marketing poster on deep rich black velvet background. Dramatic spotlight illumination creating a hero glow effect around the product. Elegant thin golden decorative lines, borders and geometric frame accents. Subtle champagne gold particle dust floating in the light. Sophisticated high-end brand aesthetic. Subtle marble or silk texture overlay adding depth. Art deco inspired geometric patterns in corners. Dramatic rim lighting highlighting product edges. Luxury cosmetics or jewelry advertising quality. Ultra premium feel.`,
        colorSuggestion: { primary: '#D4AF37', secondary: '#0A0A0A', accent: '#FFFFFF' },
        decorativeSuggestions: ['neon_glow', 'abstract_lines'],
        compositionSuggestion: 'subject_center'
    },

    playful_pop: {
        id: 'playful_pop',
        name: { en: 'Playful Pop', ar: 'مرح ملون', fr: 'Pop Ludique' },
        preview: '🌈',
        category: 'fun',
        description: {
            en: 'Fun colorful style with confetti and geometric shapes',
            ar: 'أسلوب ممتع وملون مع قصاصات ورقية',
            fr: 'Style fun et coloré avec confettis'
        },
        promptBase: `Fun playful vibrant marketing poster with energetic colorful aesthetic. Memphis design pattern inspired elements floating throughout. Colorful confetti pieces and geometric shapes (circles, triangles, squiggles) scattered joyfully. Wavy colorful lines and playful brush strokes adding movement. Bright candy-like saturated color palette. Cartoon-style drop shadows on elements. Rounded friendly bubble shapes as decorative accents. Cheerful and approachable feel. Kids or casual brand advertising quality. Celebratory party atmosphere.`,
        colorSuggestion: { primary: '#FF69B4', secondary: '#FFFFFF', accent: '#44D7B6' },
        decorativeSuggestions: ['confetti', 'gradient_waves'],
        compositionSuggestion: 'subject_center'
    },

    tech_futuristic: {
        id: 'tech_futuristic',
        name: { en: 'Tech Futuristic', ar: 'تقني مستقبلي', fr: 'Tech Futuriste' },
        preview: '🔮',
        category: 'technology',
        description: {
            en: 'Sci-fi tech aesthetic with holographic effects',
            ar: 'جمالية تقنية مستقبلية مع تأثيرات هولوغرام',
            fr: 'Esthétique tech sci-fi avec effets holographiques'
        },
        promptBase: `Futuristic high-tech marketing poster design. Dark navy to black background with vibrant cyan and purple neon glow effects. Holographic light streaks, lens flares and anamorphic light leaks. Digital circuit board patterns and flowing data stream lines. Glowing UI elements and HUD-style tech decorations. Metallic chrome reflections on the product surface. Hexagonal grid pattern overlay with subtle transparency. Cyberpunk aesthetic. Technology product or gaming advertising quality. Science fiction atmosphere.`,
        colorSuggestion: { primary: '#00FFFF', secondary: '#0A0A2E', accent: '#FF00FF' },
        decorativeSuggestions: ['neon_glow', 'abstract_lines', 'halftone_dots'],
        compositionSuggestion: 'subject_center'
    },

    organic_natural: {
        id: 'organic_natural',
        name: { en: 'Organic Natural', ar: 'طبيعي عضوي', fr: 'Naturel Organique' },
        preview: '🌿',
        category: 'wellness',
        description: {
            en: 'Nature-inspired with botanical elements',
            ar: 'مستوحى من الطبيعة مع عناصر نباتية',
            fr: 'Inspiré de la nature avec éléments botaniques'
        },
        promptBase: `Organic natural wellness marketing poster design. Soft warm earth tone color palette with cream, sage green and terracotta. Elegant botanical leaf illustrations creating a natural decorative frame around composition. Hand-drawn organic flowing line elements. Kraft paper or natural linen texture background adding warmth. Delicate watercolor splash accents in muted tones. Soft natural daylight creating gentle shadows. Sustainable eco-friendly aesthetic. Wellness, skincare or organic food advertising quality. Calming and pure atmosphere.`,
        colorSuggestion: { primary: '#4A7C59', secondary: '#F5F0E6', accent: '#8B5E3C' },
        decorativeSuggestions: ['botanical', 'abstract_lines'],
        compositionSuggestion: 'subject_left'
    },

    bold_sale: {
        id: 'bold_sale',
        name: { en: 'Bold Sale', ar: 'تخفيضات جريئة', fr: 'Soldes Audacieuses' },
        preview: '🏷️',
        category: 'retail',
        description: {
            en: 'Eye-catching promotional sale design',
            ar: 'تصميم ترويجي جذاب للتخفيضات',
            fr: 'Design promotionnel accrocheur'
        },
        promptBase: `Bold attention-grabbing sale promotional poster design. High contrast red and yellow vibrant color scheme creating urgency. Starburst explosion effect radiating from center. Bold diagonal stripes and dynamic zigzag patterns. Price tag and badge shapes as decorative elements. Confetti and excitement particles. Retail store advertising aesthetic. Flash sale urgency feel. Black Friday or clearance sale style. Maximum visual impact and energy.`,
        colorSuggestion: { primary: '#FF0000', secondary: '#FFFF00', accent: '#000000' },
        decorativeSuggestions: ['confetti', 'abstract_lines'],
        compositionSuggestion: 'subject_center'
    },

    minimal_elegant: {
        id: 'minimal_elegant',
        name: { en: 'Minimal Elegant', ar: 'أنيق بسيط', fr: 'Élégant Minimaliste' },
        preview: '⬜',
        category: 'luxury',
        description: {
            en: 'Ultra-clean minimal high-end aesthetic',
            ar: 'جمالية بسيطة وراقية للغاية',
            fr: 'Esthétique haut de gamme ultra-épurée'
        },
        promptBase: `Ultra-minimal elegant marketing poster design. Pure clean white or soft grey background with maximum negative space. Product perfectly centered with precise studio lighting and soft shadows. Very subtle thin line geometric accents. Refined sophisticated minimal aesthetic. High-end fashion or luxury brand feel. Scandinavian design influence. Less is more philosophy. Perfect for premium product showcase. Editorial magazine advertising quality.`,
        colorSuggestion: { primary: '#1A1A1A', secondary: '#FFFFFF', accent: '#C0C0C0' },
        decorativeSuggestions: ['none'],
        compositionSuggestion: 'subject_center'
    }
};

// ============================================
// DECORATIVE ELEMENTS
// ============================================

const DECORATIVE_ELEMENTS = {
    geometric_3d: {
        id: 'geometric_3d',
        name: { en: 'Floating 3D Shapes', ar: 'أشكال ثلاثية الأبعاد', fr: 'Formes 3D Flottantes' },
        icon: '🔷',
        prompt: 'Add floating 3D geometric shapes (cubes, spheres, pyramids, dodecahedrons) in the brand colors with realistic soft shadows and subtle reflections, scattered dynamically around the composition at various depths creating parallax effect'
    },

    abstract_lines: {
        id: 'abstract_lines',
        name: { en: 'Dynamic Lines', ar: 'خطوط ديناميكية', fr: 'Lignes Dynamiques' },
        icon: '〰️',
        prompt: 'Add dynamic swooping curved lines and straight diagonal lines creating energy, movement and flow, radiating outward from the product, speed lines and motion trails in brand colors'
    },

    grunge_texture: {
        id: 'grunge_texture',
        name: { en: 'Grunge Texture', ar: 'نسيج خشن', fr: 'Texture Grunge' },
        icon: '🎨',
        prompt: 'Add distressed grunge texture overlay, torn ripped paper edges, paint splatter marks, urban street art spray paint aesthetic, worn vintage distressed feel'
    },

    confetti: {
        id: 'confetti',
        name: { en: 'Confetti & Celebration', ar: 'قصاصات احتفالية', fr: 'Confettis & Célébration' },
        icon: '🎊',
        prompt: 'Add scattered colorful confetti pieces, sparkling glitter particles, celebration streamers, party atmosphere elements floating joyfully throughout the composition'
    },

    botanical: {
        id: 'botanical',
        name: { en: 'Botanical Leaves', ar: 'أوراق نباتية', fr: 'Feuilles Botaniques' },
        icon: '🌿',
        prompt: 'Add elegant botanical leaf illustrations (monstera, eucalyptus, palm fronds, ferns) creating a natural decorative frame around the edges of the composition, tropical or minimalist botanical style'
    },

    neon_glow: {
        id: 'neon_glow',
        name: { en: 'Neon Glow Effects', ar: 'تأثيرات نيون متوهجة', fr: 'Effets Néon Lumineux' },
        icon: '✨',
        prompt: 'Add vibrant glowing neon light effects, colorful light trails and streaks, dramatic lens flares, cyberpunk neon glow halos, atmospheric light fog, anamorphic light leaks'
    },

    gradient_waves: {
        id: 'gradient_waves',
        name: { en: 'Gradient Waves', ar: 'موجات متدرجة', fr: 'Vagues Dégradées' },
        icon: '🌊',
        prompt: 'Add smooth flowing gradient wave shapes, organic liquid blob forms, fluid abstract shapes with beautiful color gradients transitioning across the design creating depth and movement'
    },

    halftone_dots: {
        id: 'halftone_dots',
        name: { en: 'Halftone Pattern', ar: 'نمط نقطي', fr: 'Motif Demi-teinte' },
        icon: '⚫',
        prompt: 'Add retro halftone dot pattern overlay, classic comic book style print effect, Ben-Day dots, newspaper print texture, pop art aesthetic'
    },

    sparkles: {
        id: 'sparkles',
        name: { en: 'Sparkles & Stars', ar: 'بريق ونجوم', fr: 'Étincelles & Étoiles' },
        icon: '⭐',
        prompt: 'Add twinkling sparkle effects, shimmering star shapes, magical fairy dust particles, glamorous glitter highlights catching the light, premium quality indicators'
    },

    smoke_mist: {
        id: 'smoke_mist',
        name: { en: 'Smoke & Mist', ar: 'دخان وضباب', fr: 'Fumée & Brume' },
        icon: '💨',
        prompt: 'Add atmospheric smoke wisps, mysterious fog and mist effects, ethereal vapor clouds, dramatic haze creating depth and mood, cinematic atmosphere'
    },

    none: {
        id: 'none',
        name: { en: 'No Extra Elements', ar: 'بدون عناصر إضافية', fr: 'Pas d\'éléments' },
        icon: '➖',
        prompt: ''
    }
};

// ============================================
// COMPOSITION STYLES
// ============================================

const COMPOSITION_STYLES = {
    subject_left: {
        id: 'subject_left',
        name: { en: 'Subject Left, Text Right', ar: 'المنتج يسار، النص يمين', fr: 'Sujet Gauche, Texte Droite' },
        icon: '◀️',
        diagram: '[ PRODUCT |        TEXT AREA        ]',
        prompt: 'Composition with subject/product prominently positioned on the left third of the frame, facing right. Large open clean negative space area on the right side reserved for headline text, subheadline, and call-to-action. Diagonal energy flowing from bottom-left to top-right. Rule of thirds alignment.'
    },

    subject_right: {
        id: 'subject_right',
        name: { en: 'Subject Right, Text Left', ar: 'المنتج يمين، النص يسار', fr: 'Sujet Droite, Texte Gauche' },
        icon: '▶️',
        diagram: '[        TEXT AREA        | PRODUCT ]',
        prompt: 'Composition with subject/product prominently positioned on the right third of the frame, facing left. Large open clean negative space area on the left side reserved for headline text, subheadline, and call-to-action. Flow from right to left.'
    },

    subject_center: {
        id: 'subject_center',
        name: { en: 'Subject Center, Text Around', ar: 'المنتج في المنتصف', fr: 'Sujet Centré' },
        icon: '⏺️',
        diagram: '[    TEXT    | PRODUCT |    TEXT    ]',
        prompt: 'Composition with subject/product perfectly centered as the hero focal point. Text zones arranged symmetrically around the product - headline area at top, supporting text and CTA at bottom. Radial balance with energy emanating from the center. Spotlight focus on product.'
    },

    subject_breaking: {
        id: 'subject_breaking',
        name: { en: 'Subject Breaking Frame', ar: 'المنتج يتجاوز الإطار', fr: 'Sujet Dépassant le Cadre' },
        icon: '💥',
        diagram: '[ PRODUCT EXTENDS BEYOND EDGES >> ]',
        prompt: 'Dynamic composition where the subject/product dramatically extends beyond the frame boundaries, appearing to pop out of the design with 3D depth and parallax effect. Creates powerful visual impact and energy. Parts of the subject cropped by frame edges intentionally. Maximum drama and movement.'
    },

    diagonal_split: {
        id: 'diagonal_split',
        name: { en: 'Diagonal Split', ar: 'تقسيم قطري', fr: 'Division Diagonale' },
        icon: '📐',
        diagram: '[ COLOR1 / PRODUCT / COLOR2 ]',
        prompt: 'Composition split diagonally into two distinct color zones creating dynamic modern feel. Product positioned at the intersection of the diagonal split. One side darker, one side lighter. Strong visual tension and contemporary design aesthetic. Diagonal line from corner to corner dividing the layout.'
    },

    full_bleed: {
        id: 'full_bleed',
        name: { en: 'Full Bleed Hero', ar: 'صورة كاملة', fr: 'Héros Plein Cadre' },
        icon: '🖼️',
        diagram: '[ PRODUCT FILLS ENTIRE FRAME ]',
        prompt: 'Full bleed hero composition where the subject/product fills most of the frame at large scale. Bold and immersive. Text overlay areas created using semi-transparent backdrop strips, gradient overlays, or solid color blocks to ensure text readability. Magazine cover style.'
    },

    layered_depth: {
        id: 'layered_depth',
        name: { en: 'Layered Depth', ar: 'طبقات متعددة', fr: 'Profondeur en Couches' },
        icon: '📚',
        diagram: '[ BG << MID << PRODUCT << FORE ]',
        prompt: 'Multi-layered composition with clear foreground, midground and background layers creating cinematic depth. Product in sharp focus in the midground. Blurred or decorative elements in foreground partially overlapping. Atmospheric background with bokeh or gradient. Parallax depth effect.'
    }
};

// ============================================
// TYPOGRAPHY STYLES
// ============================================

const TYPOGRAPHY_STYLES = {
    bold_impact: {
        id: 'bold_impact',
        name: { en: 'Bold Impact', ar: 'تأثير جريء', fr: 'Impact Gras' },
        icon: '🔤',
        description: { en: 'Maximum visual impact, sports/fitness style', ar: 'تأثير بصري أقصى', fr: 'Impact visuel maximum' },
        prompt: 'Design space for extra bold condensed heavy-weight sans-serif typography with maximum visual impact. All caps headline area. Extremely thick letter strokes. Italicized energetic feel. Sports advertising poster typography style.'
    },

    modern_clean: {
        id: 'modern_clean',
        name: { en: 'Modern Clean', ar: 'عصري نظيف', fr: 'Moderne Épuré' },
        icon: '✨',
        description: { en: 'Corporate professional clean look', ar: 'مظهر مهني نظيف', fr: 'Look professionnel épuré' },
        prompt: 'Design space for clean modern geometric sans-serif typography. Clear visual hierarchy with good contrast. Professional corporate feel. Medium weight balanced typeface. Tech company or startup aesthetic.'
    },

    elegant_serif: {
        id: 'elegant_serif',
        name: { en: 'Elegant Serif', ar: 'أنيق كلاسيكي', fr: 'Serif Élégant' },
        icon: '👑',
        description: { en: 'Luxury brand sophisticated feel', ar: 'شعور فاخر ومتطور', fr: 'Sensation luxueuse sophistiquée' },
        prompt: 'Design space for sophisticated elegant serif typography. Classic timeless luxury brand feel. Refined thin hairline serifs. Fashion magazine or high-end cosmetics aesthetic. Uppercase headline with refined letter-spacing.'
    },

    playful_rounded: {
        id: 'playful_rounded',
        name: { en: 'Playful Rounded', ar: 'مرح ومستدير', fr: 'Ludique Arrondi' },
        icon: '🎈',
        description: { en: 'Fun friendly approachable style', ar: 'أسلوب ممتع وودود', fr: 'Style fun et accessible' },
        prompt: 'Design space for friendly rounded bubbly typography. Approachable and fun aesthetic. Soft rounded letter corners. Kids brand or casual food product feel. Cheerful and inviting personality.'
    },

    tech_geometric: {
        id: 'tech_geometric',
        name: { en: 'Tech Geometric', ar: 'تقني هندسي', fr: 'Tech Géométrique' },
        icon: '🔷',
        description: { en: 'Futuristic angular digital style', ar: 'أسلوب رقمي مستقبلي', fr: 'Style digital futuriste' },
        prompt: 'Design space for futuristic geometric angular typography. Sharp precise edges and exact proportions. Tech startup or gaming aesthetic. Digital display font style. Monospace or extended character widths.'
    },

    handwritten_script: {
        id: 'handwritten_script',
        name: { en: 'Handwritten Script', ar: 'خط يدوي', fr: 'Script Manuscrit' },
        icon: '✍️',
        description: { en: 'Personal authentic artisan feel', ar: 'شعور شخصي وحرفي', fr: 'Sensation personnelle artisanale' },
        prompt: 'Design space for organic handwritten script typography. Personal authentic artisan feel. Brush lettering or calligraphy style accent text. Coffee shop or handmade product aesthetic. Secondary headline in flowing script.'
    }
};

// ============================================
// COLOR SCHEME PRESETS
// ============================================

const COLOR_SCHEMES = {
    custom: {
        id: 'custom',
        name: { en: 'Custom Colors', ar: 'ألوان مخصصة', fr: 'Couleurs Personnalisées' },
        icon: '🎨',
        colors: null
    },

    energetic_green: {
        id: 'energetic_green',
        name: { en: 'Energetic Green', ar: 'أخضر نشط', fr: 'Vert Énergique' },
        icon: '💚',
        colors: { primary: '#00FF66', secondary: '#1A1A2E', accent: '#FFFFFF' },
        industries: ['fitness', 'health', 'sports']
    },

    royal_blue: {
        id: 'royal_blue',
        name: { en: 'Royal Blue', ar: 'أزرق ملكي', fr: 'Bleu Royal' },
        icon: '💙',
        colors: { primary: '#4A3AFF', secondary: '#FFFFFF', accent: '#7C3AED' },
        industries: ['corporate', 'tech', 'finance']
    },

    sunset_orange: {
        id: 'sunset_orange',
        name: { en: 'Sunset Orange', ar: 'برتقالي غروب', fr: 'Orange Coucher de Soleil' },
        icon: '🧡',
        colors: { primary: '#FF6B35', secondary: '#1A0A2E', accent: '#FFD93D' },
        industries: ['food', 'travel', 'entertainment']
    },

    nature_green: {
        id: 'nature_green',
        name: { en: 'Nature Green', ar: 'أخضر طبيعي', fr: 'Vert Nature' },
        icon: '🌿',
        colors: { primary: '#4A7C59', secondary: '#F5F0E6', accent: '#8B5E3C' },
        industries: ['organic', 'wellness', 'eco']
    },

    luxury_gold: {
        id: 'luxury_gold',
        name: { en: 'Luxury Gold', ar: 'ذهبي فاخر', fr: 'Or Luxueux' },
        icon: '💛',
        colors: { primary: '#D4AF37', secondary: '#0A0A0A', accent: '#FFFFFF' },
        industries: ['luxury', 'jewelry', 'premium']
    },

    candy_pink: {
        id: 'candy_pink',
        name: { en: 'Candy Pink', ar: 'وردي حلوى', fr: 'Rose Bonbon' },
        icon: '💖',
        colors: { primary: '#FF69B4', secondary: '#FFFFFF', accent: '#44D7B6' },
        industries: ['beauty', 'fashion', 'kids']
    },

    ocean_blue: {
        id: 'ocean_blue',
        name: { en: 'Ocean Blue', ar: 'أزرق محيطي', fr: 'Bleu Océan' },
        icon: '🌊',
        colors: { primary: '#0077B6', secondary: '#CAF0F8', accent: '#03045E' },
        industries: ['travel', 'spa', 'water']
    },

    fire_red: {
        id: 'fire_red',
        name: { en: 'Fire Red', ar: 'أحمر ناري', fr: 'Rouge Feu' },
        icon: '❤️',
        colors: { primary: '#E63946', secondary: '#F1FAEE', accent: '#1D3557' },
        industries: ['food', 'sale', 'urgent']
    },

    midnight_purple: {
        id: 'midnight_purple',
        name: { en: 'Midnight Purple', ar: 'بنفسجي منتصف الليل', fr: 'Violet Minuit' },
        icon: '💜',
        colors: { primary: '#7B2CBF', secondary: '#10002B', accent: '#E0AAFF' },
        industries: ['gaming', 'tech', 'music']
    },

    earthy_terracotta: {
        id: 'earthy_terracotta',
        name: { en: 'Earthy Terracotta', ar: 'تيراكوتا ترابي', fr: 'Terre Cuite' },
        icon: '🤎',
        colors: { primary: '#BC6C25', secondary: '#FEFAE0', accent: '#283618' },
        industries: ['home', 'craft', 'organic']
    }
};

// ============================================
// OUTPUT FORMATS
// ============================================

const OUTPUT_FORMATS = {
    // Social Media Feed
    instagram_feed: {
        id: 'instagram_feed',
        name: { en: 'Instagram Feed', ar: 'منشور انستغرام', fr: 'Feed Instagram' },
        icon: '📸',
        aspectRatio: '1:1',
        dimensions: { width: 1080, height: 1080 },
        platform: 'Instagram',
        description: { en: 'Square post for Instagram feed', ar: 'منشور مربع', fr: 'Post carré' }
    },

    instagram_story: {
        id: 'instagram_story',
        name: { en: 'Instagram Story/Reels', ar: 'ستوري انستغرام', fr: 'Story Instagram' },
        icon: '📱',
        aspectRatio: '9:16',
        dimensions: { width: 1080, height: 1920 },
        platform: 'Instagram',
        description: { en: 'Vertical format for Stories & Reels', ar: 'تنسيق عمودي للستوري', fr: 'Format vertical' }
    },

    facebook_feed: {
        id: 'facebook_feed',
        name: { en: 'Facebook Feed', ar: 'منشور فيسبوك', fr: 'Feed Facebook' },
        icon: '📘',
        aspectRatio: '1:1',
        dimensions: { width: 1080, height: 1080 },
        platform: 'Facebook',
        description: { en: 'Square post for Facebook', ar: 'منشور فيسبوك مربع', fr: 'Post Facebook carré' }
    },

    facebook_cover: {
        id: 'facebook_cover',
        name: { en: 'Facebook Cover', ar: 'غلاف فيسبوك', fr: 'Couverture Facebook' },
        icon: '🖼️',
        aspectRatio: '820:312',
        dimensions: { width: 820, height: 312 },
        platform: 'Facebook',
        description: { en: 'Page cover photo', ar: 'صورة غلاف الصفحة', fr: 'Photo de couverture' }
    },

    website_hero: {
        id: 'website_hero',
        name: { en: 'Website Hero', ar: 'بانر الموقع', fr: 'Bannière Site Web' },
        icon: '🖥️',
        aspectRatio: '16:9',
        dimensions: { width: 1920, height: 1080 },
        platform: 'Web',
        description: { en: 'Full-width website banner', ar: 'بانر موقع عريض', fr: 'Bannière large' }
    },

    twitter_post: {
        id: 'twitter_post',
        name: { en: 'Twitter/X Post', ar: 'منشور تويتر', fr: 'Post Twitter/X' },
        icon: '🐦',
        aspectRatio: '16:9',
        dimensions: { width: 1600, height: 900 },
        platform: 'Twitter',
        description: { en: 'Optimal for Twitter timeline', ar: 'مثالي لتويتر', fr: 'Optimal pour Twitter' }
    },

    linkedin_post: {
        id: 'linkedin_post',
        name: { en: 'LinkedIn Post', ar: 'منشور لينكدإن', fr: 'Post LinkedIn' },
        icon: '💼',
        aspectRatio: '1.91:1',
        dimensions: { width: 1200, height: 628 },
        platform: 'LinkedIn',
        description: { en: 'Professional network post', ar: 'منشور مهني', fr: 'Post professionnel' }
    },

    pinterest_pin: {
        id: 'pinterest_pin',
        name: { en: 'Pinterest Pin', ar: 'دبوس بنترست', fr: 'Pin Pinterest' },
        icon: '📌',
        aspectRatio: '2:3',
        dimensions: { width: 1000, height: 1500 },
        platform: 'Pinterest',
        description: { en: 'Tall pin format', ar: 'تنسيق طويل', fr: 'Format épingle' }
    }
};

// ============================================
// PRODUCT CATEGORIES
// ============================================

const PRODUCT_CATEGORIES = {
    supplements: {
        id: 'supplements',
        name: { en: 'Supplements & Protein', ar: 'مكملات وبروتين', fr: 'Suppléments & Protéines' },
        icon: '💪',
        suggestedTemplates: ['fitness_energy', 'bold_sale'],
        promptHints: 'fitness supplement protein powder bottle jar container with nutrition label'
    },

    cosmetics: {
        id: 'cosmetics',
        name: { en: 'Cosmetics & Beauty', ar: 'مستحضرات التجميل', fr: 'Cosmétiques & Beauté' },
        icon: '💄',
        suggestedTemplates: ['luxury_dark', 'minimal_elegant', 'organic_natural'],
        promptHints: 'cosmetic beauty skincare makeup product bottle cream serum lipstick'
    },

    food_beverage: {
        id: 'food_beverage',
        name: { en: 'Food & Beverages', ar: 'طعام ومشروبات', fr: 'Alimentation & Boissons' },
        icon: '🍕',
        suggestedTemplates: ['playful_pop', 'organic_natural', 'bold_sale'],
        promptHints: 'food product beverage drink snack fresh delicious appetizing'
    },

    electronics: {
        id: 'electronics',
        name: { en: 'Electronics & Tech', ar: 'إلكترونيات وتقنية', fr: 'Électronique & Tech' },
        icon: '📱',
        suggestedTemplates: ['tech_futuristic', 'modern_gradient', 'minimal_elegant'],
        promptHints: 'electronic device gadget technology product sleek modern'
    },

    fashion: {
        id: 'fashion',
        name: { en: 'Fashion & Apparel', ar: 'أزياء وملابس', fr: 'Mode & Vêtements' },
        icon: '👗',
        suggestedTemplates: ['minimal_elegant', 'modern_gradient', 'luxury_dark'],
        promptHints: 'fashion clothing apparel garment stylish trendy'
    },

    home_decor: {
        id: 'home_decor',
        name: { en: 'Home & Decor', ar: 'منزل وديكور', fr: 'Maison & Déco' },
        icon: '🏠',
        suggestedTemplates: ['organic_natural', 'minimal_elegant', 'modern_gradient'],
        promptHints: 'home decor furniture interior design household item'
    },

    fitness_sports: {
        id: 'fitness_sports',
        name: { en: 'Fitness & Sports', ar: 'لياقة ورياضة', fr: 'Fitness & Sport' },
        icon: '🏋️',
        suggestedTemplates: ['fitness_energy', 'bold_sale'],
        promptHints: 'fitness sports equipment gym gear athletic'
    },

    jewelry: {
        id: 'jewelry',
        name: { en: 'Jewelry & Watches', ar: 'مجوهرات وساعات', fr: 'Bijoux & Montres' },
        icon: '💎',
        suggestedTemplates: ['luxury_dark', 'minimal_elegant'],
        promptHints: 'luxury jewelry precious gem diamond gold silver watch'
    },

    services: {
        id: 'services',
        name: { en: 'Services & Apps', ar: 'خدمات وتطبيقات', fr: 'Services & Apps' },
        icon: '📲',
        suggestedTemplates: ['modern_gradient', 'tech_futuristic'],
        promptHints: 'service app digital platform software'
    },

    other: {
        id: 'other',
        name: { en: 'Other', ar: 'أخرى', fr: 'Autre' },
        icon: '📦',
        suggestedTemplates: ['modern_gradient', 'bold_sale'],
        promptHints: 'product item'
    }
};

// ============================================
// EXPORT
// ============================================

module.exports = {
    DESIGN_TEMPLATES,
    DECORATIVE_ELEMENTS,
    COMPOSITION_STYLES,
    TYPOGRAPHY_STYLES,
    COLOR_SCHEMES,
    OUTPUT_FORMATS,
    PRODUCT_CATEGORIES,

    // Helper to get all presets for frontend
    getAdCreativePresets: () => ({
        designTemplates: Object.values(DESIGN_TEMPLATES),
        decorativeElements: Object.values(DECORATIVE_ELEMENTS),
        compositionStyles: Object.values(COMPOSITION_STYLES),
        typographyStyles: Object.values(TYPOGRAPHY_STYLES),
        colorSchemes: Object.values(COLOR_SCHEMES),
        outputFormats: Object.values(OUTPUT_FORMATS),
        productCategories: Object.values(PRODUCT_CATEGORIES),
    }),
};
