/**
 * Ad Creative Configuration
 * Universal presets for any product category
 * Used by the Universal Ad Creative Generator
 */

// ============================================
// PRODUCT CATEGORIES - Universal, not just fashion
// ============================================

const PRODUCT_CATEGORIES = {
    supplements: {
        id: 'supplements',
        name: { en: 'Supplements & Vitamins', ar: 'مكملات و فيتامينات' },
        icon: '💪',
        keywords: 'supplement bottle, capsule container, powder tub, vitamin packaging, health product, fitness product, protein powder, pre-workout',
        defaultStyle: 'bold_energetic',
        tips: {
            en: 'Works best with clean product shots showing the label clearly',
            ar: 'أفضل مع صور واضحة تظهر الملصق'
        }
    },
    cosmetics: {
        id: 'cosmetics',
        name: { en: 'Cosmetics & Skincare', ar: 'مستحضرات التجميل' },
        icon: '💄',
        keywords: 'beauty product, skincare bottle, cream jar, serum dropper, makeup item, lipstick, foundation, moisturizer, perfume bottle',
        defaultStyle: 'premium_minimal',
        tips: {
            en: 'Best with high-quality product photography on neutral background',
            ar: 'أفضل مع تصوير احترافي على خلفية محايدة'
        }
    },
    food_beverage: {
        id: 'food_beverage',
        name: { en: 'Food & Beverages', ar: 'أغذية و مشروبات' },
        icon: '🍕',
        keywords: 'food packaging, beverage bottle, drink can, snack bag, food product, gourmet food, organic snack, juice bottle, coffee bag',
        defaultStyle: 'organic_natural',
        tips: {
            en: 'Fresh ingredients or appetizing presentation recommended',
            ar: 'يفضل عرض مكونات طازجة أو تقديم شهي'
        }
    },
    electronics: {
        id: 'electronics',
        name: { en: 'Electronics & Tech', ar: 'إلكترونيات و تكنولوجيا' },
        icon: '📱',
        keywords: 'gadget, electronic device, tech product, smart device, appliance, smartphone, laptop, headphones, wearable, gaming device',
        defaultStyle: 'tech_modern',
        tips: {
            en: 'Clean product shots on white or dark backgrounds work best',
            ar: 'تصوير نظيف على خلفية بيضاء أو داكنة'
        }
    },
    fashion: {
        id: 'fashion',
        name: { en: 'Fashion & Accessories', ar: 'أزياء و إكسسوارات' },
        icon: '👗',
        keywords: 'clothing item, fashion accessory, shoe, bag, jewelry, watch, sunglasses, hat, scarf',
        defaultStyle: 'premium_minimal',
        tips: {
            en: 'Flat lay or model-worn shots both work well',
            ar: 'صور عرض مسطحة أو على موديل'
        }
    },
    home_decor: {
        id: 'home_decor',
        name: { en: 'Home & Decor', ar: 'ديكور و أثاث' },
        icon: '🏠',
        keywords: 'home decor, furniture, interior design, decorative item, lamp, vase, cushion, artwork, candle',
        defaultStyle: 'organic_natural',
        tips: {
            en: 'Show product in context or as a standalone item',
            ar: 'أظهر المنتج في سياقه أو بشكل منفرد'
        }
    },
    services: {
        id: 'services',
        name: { en: 'Services & Apps', ar: 'خدمات و تطبيقات' },
        icon: '📲',
        keywords: 'abstract service representation, app interface mockup, professional setting, business card, logo, brand identity',
        defaultStyle: 'professional_trust',
        tips: {
            en: 'Upload app screenshots, icons, or abstract representations',
            ar: 'ارفع صور التطبيق أو الأيقونات'
        }
    },
    other: {
        id: 'other',
        name: { en: 'Other Products', ar: 'منتجات أخرى' },
        icon: '📦',
        keywords: 'product, item, merchandise, package, generic product, retail item',
        defaultStyle: 'premium_minimal',
        tips: {
            en: 'Any clean product photo will work',
            ar: 'أي صورة منتج واضحة ستعمل'
        }
    }
};

// ============================================
// OUTPUT FORMATS with composition guidance
// ============================================

const OUTPUT_FORMATS = {
    website_hero: {
        id: 'website_hero',
        name: { en: 'Website Hero', ar: 'صورة الموقع الرئيسية' },
        icon: '🖥️',
        aspectRatio: '16:9',
        dimensions: { width: 1920, height: 1080 },
        composition: 'Product positioned on right third of frame, large clean negative space on left side reserved for headline text overlay. Professional studio composition with rule-of-thirds alignment.',
        textZone: 'left',
        description: {
            en: 'Homepage banner, landing page hero',
            ar: 'بانر الصفحة الرئيسية'
        }
    },
    facebook_feed: {
        id: 'facebook_feed',
        name: { en: 'Facebook/Instagram Feed', ar: 'بوست فيسبوك' },
        icon: '📱',
        aspectRatio: '1:1',
        dimensions: { width: 1080, height: 1080 },
        composition: 'Product centered or positioned in lower third, clean space at top for headline text, bottom area clear for CTA badge or offer text. Balanced social media composition.',
        textZone: 'top-bottom',
        description: {
            en: 'Square post for social feeds',
            ar: 'بوست مربع للسوشيال ميديا'
        }
    },
    instagram_story: {
        id: 'instagram_story',
        name: { en: 'Story / Reels', ar: 'ستوري / ريلز' },
        icon: '📲',
        aspectRatio: '9:16',
        dimensions: { width: 1080, height: 1920 },
        composition: 'Product positioned in lower third of vertical frame, top two-thirds area kept clear for text overlay, branding, and call-to-action elements. Vertical-first composition.',
        textZone: 'top',
        description: {
            en: 'Vertical format for Stories and Reels',
            ar: 'صيغة عمودية للستوري'
        }
    }
};

// ============================================
// BRAND STYLE PRESETS
// ============================================

const BRAND_STYLES = {
    premium_minimal: {
        id: 'premium_minimal',
        name: { en: 'Premium Minimal', ar: 'فخامة بسيطة' },
        preview: '⬜',
        prompt: 'Ultra-clean composition with soft gray or pure white background, subtle gradient shadow, gentle soft-box lighting with soft diffused shadows, luxury brand aesthetic, minimalist arrangement, generous negative space, high-end product photography, Scandinavian design influence',
        colors: { background: '#FAFAFA', accent: '#1A1A1A' },
        mood: 'Elegant, clean, sophisticated'
    },
    bold_energetic: {
        id: 'bold_energetic',
        name: { en: 'Bold & Energetic', ar: 'جريء و حيوي' },
        preview: '🔴',
        prompt: 'Dynamic composition with diagonal energy lines, vibrant saturated colors, high contrast, dramatic rim lighting with colored gels, powerful presence, action-oriented feel, fitness and performance aesthetic, motivational sports brand style',
        colors: { background: '#0D0D0D', accent: '#FF4500' },
        mood: 'Powerful, energetic, motivating'
    },
    organic_natural: {
        id: 'organic_natural',
        name: { en: 'Organic Natural', ar: 'طبيعي و عضوي' },
        preview: '🌿',
        prompt: 'Warm earth tones, soft natural daylight feel, botanical green leaf accents, wooden or natural stone surface props, sustainable and eco-friendly aesthetic, calm pure atmosphere, farm-to-table aesthetic, natural textures',
        colors: { background: '#F5F0E6', accent: '#5D7052' },
        mood: 'Natural, pure, sustainable'
    },
    tech_modern: {
        id: 'tech_modern',
        name: { en: 'Tech Modern', ar: 'تقني حديث' },
        preview: '💜',
        prompt: 'Dark sleek background with subtle blue or purple neon accent glow, futuristic metallic reflections, clean geometric composition, innovation and cutting-edge technology feel, Apple-style product photography, holographic subtle accents',
        colors: { background: '#0A0A0F', accent: '#6366F1' },
        mood: 'Futuristic, innovative, premium tech'
    },
    playful_colorful: {
        id: 'playful_colorful',
        name: { en: 'Playful Colorful', ar: 'مرح و ملون' },
        preview: '🌈',
        prompt: 'Bright candy-like colors, fun geometric shapes in background, confetti or playful abstract elements, youthful Gen-Z aesthetic, joyful and optimistic mood, Instagram-ready vibrant composition, pop art influence',
        colors: { background: '#FFF5F5', accent: '#FF69B4' },
        mood: 'Fun, youthful, vibrant'
    },
    professional_trust: {
        id: 'professional_trust',
        name: { en: 'Professional Trust', ar: 'احترافي و موثوق' },
        preview: '🔵',
        prompt: 'Clean corporate aesthetic, trustworthy blue tones, light gray professional background, balanced symmetrical composition, professional studio lighting, business and B2B appropriate, medical-grade cleanliness feel',
        colors: { background: '#F8FAFC', accent: '#2563EB' },
        mood: 'Trustworthy, professional, reliable'
    },
    luxury_dark: {
        id: 'luxury_dark',
        name: { en: 'Luxury Dark', ar: 'فخامة داكنة' },
        preview: '⬛',
        prompt: 'Deep black velvet background, dramatic spotlight on product, gold or champagne accent lighting, opulent luxury atmosphere, jewelry commercial style, high-end boutique aesthetic, rich shadows and highlights',
        colors: { background: '#0A0A0A', accent: '#D4AF37' },
        mood: 'Opulent, exclusive, luxury'
    },
    warm_lifestyle: {
        id: 'warm_lifestyle',
        name: { en: 'Warm Lifestyle', ar: 'حياة دافئة' },
        preview: '🧡',
        prompt: 'Warm amber golden hour lighting, cozy inviting atmosphere, lifestyle context with subtle props, relatable authentic feel, influencer style photography, Instagram aesthetic warmth, soft bokeh background',
        colors: { background: '#FEF3E2', accent: '#EA580C' },
        mood: 'Warm, inviting, authentic'
    }
};

// ============================================
// MOOD & ATMOSPHERE LIBRARY
// ============================================

const MOOD_LIBRARY = {
    energizing: {
        id: 'energizing',
        name: { en: 'Energizing', ar: 'محفز' },
        icon: '⚡',
        prompt: 'High-key warm lighting, golden hour warmth, dynamic energy radiating from composition, motivating and uplifting atmosphere, active lifestyle feel'
    },
    calming: {
        id: 'calming',
        name: { en: 'Calming', ar: 'مهدئ' },
        icon: '🌊',
        prompt: 'Soft diffused cool lighting, serene blue-green undertones, peaceful and relaxing spa-like atmosphere, zen minimalism'
    },
    luxurious: {
        id: 'luxurious',
        name: { en: 'Luxurious', ar: 'فاخر' },
        icon: '👑',
        prompt: 'Dramatic Rembrandt lighting, deep rich shadows, opulent gold accents, exclusive premium atmosphere, velvet and silk textures suggested'
    },
    fresh_clean: {
        id: 'fresh_clean',
        name: { en: 'Fresh & Clean', ar: 'منعش و نظيف' },
        icon: '✨',
        prompt: 'Bright even clinical lighting, pure white tones, crisp sharp focus, hygienic and pure atmosphere, medical-grade cleanliness'
    },
    edgy_bold: {
        id: 'edgy_bold',
        name: { en: 'Edgy Bold', ar: 'جريء و حاد' },
        icon: '🔥',
        prompt: 'Hard dramatic shadows, high contrast chiaroscuro lighting, striking rim lights, rebellious and bold atmosphere, street culture influence'
    },
    warm_cozy: {
        id: 'warm_cozy',
        name: { en: 'Warm & Cozy', ar: 'دافئ و مريح' },
        icon: '🕯️',
        prompt: 'Soft warm amber lighting, comfortable inviting atmosphere, homey and welcoming mood, candlelight warmth suggested, hygge aesthetic'
    },
    mysterious: {
        id: 'mysterious',
        name: { en: 'Mysterious', ar: 'غامض' },
        icon: '🌙',
        prompt: 'Low-key dramatic lighting, deep shadows with selective highlights, intriguing mysterious atmosphere, noir film influence'
    },
    vibrant_joyful: {
        id: 'vibrant_joyful',
        name: { en: 'Vibrant Joyful', ar: 'مبهج و حيوي' },
        icon: '🎉',
        prompt: 'Bright saturated colors, celebratory energy, joyful festive atmosphere, party mood, confetti and sparkle elements suggested'
    }
};

// ============================================
// TARGET AUDIENCE PRESETS (Optional helpers)
// ============================================

const TARGET_AUDIENCES = {
    fitness_enthusiasts: {
        id: 'fitness_enthusiasts',
        name: { en: 'Fitness Enthusiasts', ar: 'محبي اللياقة' },
        ageRange: '20-40',
        description: 'Active gym-goers, athletes, health-conscious individuals'
    },
    young_professionals: {
        id: 'young_professionals',
        name: { en: 'Young Professionals', ar: 'المهنيين الشباب' },
        ageRange: '25-40',
        description: 'Career-focused, urban, tech-savvy professionals'
    },
    gen_z: {
        id: 'gen_z',
        name: { en: 'Gen Z', ar: 'جيل زد' },
        ageRange: '16-25',
        description: 'Digital natives, trend-conscious, social media active'
    },
    parents: {
        id: 'parents',
        name: { en: 'Parents', ar: 'الآباء و الأمهات' },
        ageRange: '28-50',
        description: 'Family-focused, value quality and safety'
    },
    luxury_seekers: {
        id: 'luxury_seekers',
        name: { en: 'Luxury Seekers', ar: 'عشاق الفخامة' },
        ageRange: '30-60',
        description: 'High income, quality over price, exclusive taste'
    },
    eco_conscious: {
        id: 'eco_conscious',
        name: { en: 'Eco-Conscious', ar: 'صديق البيئة' },
        ageRange: '20-45',
        description: 'Environmentally aware, sustainable lifestyle, organic preference'
    }
};

module.exports = {
    PRODUCT_CATEGORIES,
    OUTPUT_FORMATS,
    BRAND_STYLES,
    MOOD_LIBRARY,
    TARGET_AUDIENCES
};
