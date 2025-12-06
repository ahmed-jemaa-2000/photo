const path = require('path');

const PRESET_PROMPTS = [
    {
        label: { en: 'Pro Studio (White)', tn: 'Studio Pro (Abyadh)' },
        prompt:
            'High-end fashion e-commerce shot, pure white seamless background, soft evenly diffused lighting, 85mm lens, sharp focus on garment texture, professional model pose, minimal shadows, commercial catalog style.',
    },
    {
        label: { en: 'Pro Studio (Grey)', tn: 'Studio Pro (Gri)' },
        prompt:
            'Editorial studio portrait, neutral grey backdrop, cinematic three-point lighting, soft rim light, authentic skin texture, confident high-fashion pose, Vogue magazine aesthetic, sharp details.',
    },
    {
        label: { en: 'Luxury Campaign', tn: 'Publicité Luxe' },
        prompt:
            'Luxury fashion advertisement, warm ambient lighting, elegant indoor setting with blurred depth of field, rich colors, sophisticated mood, premium brand aesthetic, soft glow.',
    },
    {
        label: { en: 'Urban Editorial', tn: 'Urban Style' },
        prompt:
            'High-fashion street photography, golden hour natural light, modern architecture background (blurred), dynamic movement, candid yet polished, sharp garment details, lifestyle ad campaign.',
    },
];

const POSE_PROMPTS = [
    { label: { en: 'Standing', tn: 'Weqef' }, key: 'standing', prompt: 'Full-length standing pose, relaxed weight shift, arms natural, outfit fully visible.' },
    { label: { en: 'Walking', tn: 'Yemchi' }, key: 'walking', prompt: 'Mid-step walking pose, gentle arm swing, natural motion blur avoided, outfit centered.' },
    { label: { en: 'Seated', tn: 'Qa3ed' }, key: 'seated', prompt: 'Seated or lightly leaning pose with straight posture, garment drape visible.' },
    { label: { en: 'Dynamic', tn: 'Dynamic' }, key: 'dynamic', prompt: 'Dynamic half-turn with confident stance, torso rotation, outfit front still clear.' },
];

const SHOE_POSE_PROMPTS = [
    { label: { en: 'Low Angle Walking', tn: 'Yemchi (Low Angle)' }, key: 'shoe_walking', prompt: 'Low angle shot from ground level, capturing shoes in mid-step motion, street level perspective, focus on footwear details.' },
    { label: { en: 'Floating/Jump', tn: 'Naqza' }, key: 'shoe_jump', prompt: 'Dynamic mid-air jump shot, shoes clearly visible in suspension, energetic and sporty vibe, focus on sole and upper design.' },
    { label: { en: 'Seated (Feet Focus)', tn: 'Qa3ed (Rakkaz 3al Sabbat)' }, key: 'shoe_seated', prompt: 'Model seated with legs extended towards camera, shallow depth of field focusing sharply on the shoes, blurred background.' },
    { label: { en: 'Top Down', tn: 'Men Fouq' }, key: 'shoe_topdown', prompt: 'High angle top-down view (POV), looking down at feet, standing on textured surface, showcasing the top profile of the shoes.' },
];

const MODELS = [
    // --- FEMALE MODELS ---
    {
        id: 'asma',
        name: { en: 'Asma', tn: 'Asma' },
        gender: 'female',
        ethnicity: 'tunisian',
        style: { en: 'Modern Chic', tn: 'Chic Moderne' },
        description: 'Tunisian woman named Asma, olive skin, long dark hair, modern chic fashion style, confident and friendly smile, North African features.',
        previewUrl: 'https://placehold.co/400x600.png?text=Asma',
        path: path.join(__dirname, '../assets/models/girl-asma.png')
    },
    {
        id: 'eya',
        name: { en: 'Eya', tn: 'Eya' },
        gender: 'female',
        ethnicity: 'tunisian',
        style: { en: 'Casual/Street', tn: 'Casual' },
        description: 'Young Tunisian woman named Eya, casual street style, energetic vibe, natural makeup, curly hair, North African features.',
        previewUrl: 'https://placehold.co/400x600.png?text=Eya',
        path: path.join(__dirname, '../assets/models/girl-eya.png')
    },
    {
        id: 'safa',
        name: { en: 'Safa', tn: 'Safa' },
        gender: 'female',
        ethnicity: 'tunisian',
        style: { en: 'Elegant/Formal', tn: 'Soirée' },
        description: 'Tunisian woman named Safa, elegant evening look, sophisticated hairstyle, soft lighting, refined North African beauty.',
        previewUrl: 'https://placehold.co/400x600.png?text=Safa',
        path: path.join(__dirname, '../assets/models/girl-safa.png')
    },
    {
        id: 'sarra',
        name: { en: 'Sarra', tn: 'Sarra' },
        gender: 'female',
        ethnicity: 'tunisian',
        style: { en: 'Traditional', tn: 'Traditionnel' },
        description: 'Tunisian woman named Sarra, wearing modern-traditional fusion, warm smile, authentic North African features.',
        previewUrl: 'https://placehold.co/400x600.png?text=Sarra',
        path: path.join(__dirname, '../assets/models/girl-sarra.png')
    },
    {
        id: 'sirine',
        name: { en: 'Sirine', tn: 'Sirine' },
        gender: 'female',
        ethnicity: 'tunisian',
        style: { en: 'Business', tn: 'Business' },
        description: 'Tunisian woman named Sirine, professional business attire, sharp focus, confident pose, modern Tunis lifestyle.',
        previewUrl: 'https://placehold.co/400x600.png?text=Sirine',
        path: path.join(__dirname, '../assets/models/girl-sirine.png')
    },

    // --- MALE MODELS ---
    {
        id: 'ahmed',
        name: { en: 'Ahmed', tn: 'Ahmed' },
        gender: 'male',
        ethnicity: 'tunisian',
        style: { en: 'Casual', tn: 'Casual' },
        description: 'Tunisian man named Ahmed, short dark hair, casual t-shirt and jeans look, friendly demeanor, North African features.',
        previewUrl: 'https://placehold.co/400x600.png?text=Ahmed',
        path: path.join(__dirname, '../assets/models/man-ahmed.png')
    },
    {
        id: 'ayoub',
        name: { en: 'Ayoub', tn: 'Ayoub' },
        gender: 'male',
        ethnicity: 'tunisian',
        style: { en: 'Streetwear', tn: 'Streetwear' },
        description: 'Young Tunisian man named Ayoub, trendy streetwear fashion, cool attitude, modern haircut, urban vibe.',
        previewUrl: 'https://placehold.co/400x600.png?text=Ayoub',
        path: path.join(__dirname, '../assets/models/man-ayoub.png')
    },
    {
        id: 'fares',
        name: { en: 'Fares', tn: 'Fares' },
        gender: 'male',
        ethnicity: 'tunisian',
        style: { en: 'Sporty', tn: 'Sport' },
        description: 'Tunisian man named Fares, athletic build, sporty outfit, energetic pose, outdoorsy look.',
        previewUrl: 'https://placehold.co/400x600.png?text=Fares',
        path: path.join(__dirname, '../assets/models/man-fares.png')
    },
    {
        id: 'hassen',
        name: { en: 'Hassen', tn: 'Hassen' },
        gender: 'male',
        ethnicity: 'tunisian',
        style: { en: 'Classic', tn: 'Classique' },
        description: 'Tunisian man named Hassen, classic style, well-groomed, mature and sophisticated appearance.',
        previewUrl: 'https://placehold.co/400x600.png?text=Hassen',
        path: path.join(__dirname, '../assets/models/man-hassen.png')
    },
    {
        id: 'khalil',
        name: { en: 'Khalil', tn: 'Khalil' },
        gender: 'male',
        ethnicity: 'tunisian',
        style: { en: 'Smart Casual', tn: 'Smart Casual' },
        description: 'Tunisian man named Khalil, smart casual attire, glasses, intelligent look, modern professional.',
        previewUrl: 'https://placehold.co/400x600.png?text=Khalil',
        path: path.join(__dirname, '../assets/models/man-khalil.png')
    },
    {
        id: 'mounir',
        name: { en: 'Mounir', tn: 'Mounir' },
        gender: 'male',
        ethnicity: 'tunisian',
        style: { en: 'Formal', tn: 'Costume' },
        description: 'Tunisian man named Mounir, formal suit, sharp features, serious and commanding presence.',
        previewUrl: 'https://placehold.co/400x600.png?text=Mounir',
        path: path.join(__dirname, '../assets/models/man-mounir.png')
    }
];

const SHOE_MODELS = [
    // Female variations
    {
        id: 'female-black-jeans',
        name: { en: 'Black Jeans', tn: 'Jeans Kahla' },
        gender: 'female',
        outfitStyle: 'casual',
        description: 'Female legs wearing fitted black denim jeans',
        previewUrl: '/api/assets/legs/female-black-jeans.png',
        path: path.join(__dirname, '../assets/legs/female-black-jeans.png')
    },
    {
        id: 'female-blue-jeans',
        name: { en: 'Blue Jeans', tn: 'Jeans Azra9' },
        gender: 'female',
        outfitStyle: 'casual',
        description: 'Female legs wearing classic blue denim jeans',
        previewUrl: '/api/assets/legs/female-blue-jeans.png',
        path: path.join(__dirname, '../assets/legs/female-blue-jeans.png')
    },
    {
        id: 'female-white-pants',
        name: { en: 'White Pants', tn: 'Sarwal Abyad' },
        gender: 'female',
        outfitStyle: 'casual',
        description: 'Female legs wearing white casual pants',
        previewUrl: '/api/assets/legs/female-white-pants.png',
        path: path.join(__dirname, '../assets/legs/female-white-pants.png')
    },
    {
        id: 'female-beige-pants',
        name: { en: 'Beige Pants', tn: 'Sarwal Beige' },
        gender: 'female',
        outfitStyle: 'casual',
        description: 'Female legs wearing beige khaki pants',
        previewUrl: '/api/assets/legs/female-beige-pants.png',
        path: path.join(__dirname, '../assets/legs/female-beige-pants.png')
    },
    {
        id: 'female-black-leggings',
        name: { en: 'Black Leggings', tn: 'Leggings Kahla' },
        gender: 'female',
        outfitStyle: 'sporty',
        description: 'Female legs wearing black athletic leggings',
        previewUrl: '/api/assets/legs/female-black-leggings.png',
        path: path.join(__dirname, '../assets/legs/female-black-leggings.png')
    },
    {
        id: 'female-dark-skinny-jeans',
        name: { en: 'Dark Skinny Jeans', tn: 'Skinny Jeans Dahkra' },
        gender: 'female',
        outfitStyle: 'casual',
        description: 'Female legs wearing dark wash skinny jeans',
        previewUrl: '/api/assets/legs/female-dark-skinny-jeans.png',
        path: path.join(__dirname, '../assets/legs/female-dark-skinny-jeans.png')
    },

    // Male variations
    {
        id: 'male-black-jeans',
        name: { en: 'Black Jeans', tn: 'Jeans Kahla' },
        gender: 'male',
        outfitStyle: 'casual',
        description: 'Male legs wearing black denim jeans',
        previewUrl: '/api/assets/legs/male-black-jeans.png',
        path: path.join(__dirname, '../assets/legs/male-black-jeans.png')
    },
    {
        id: 'male-blue-jeans',
        name: { en: 'Blue Jeans', tn: 'Jeans Azra9' },
        gender: 'male',
        outfitStyle: 'casual',
        description: 'Male legs wearing classic blue denim jeans',
        previewUrl: '/api/assets/legs/male-blue-jeans.png',
        path: path.join(__dirname, '../assets/legs/male-blue-jeans.png')
    },
    {
        id: 'male-gray-joggers',
        name: { en: 'Gray Joggers', tn: 'Joggers Rmadi' },
        gender: 'male',
        outfitStyle: 'sporty',
        description: 'Male legs wearing gray athletic jogger pants',
        previewUrl: '/api/assets/legs/male-gray-joggers.png',
        path: path.join(__dirname, '../assets/legs/male-gray-joggers.png')
    },
    {
        id: 'male-black-sport-pants',
        name: { en: 'Black Sport Pants', tn: 'Sarwal Sport Kahla' },
        gender: 'male',
        outfitStyle: 'sporty',
        description: 'Male legs wearing black athletic sport pants',
        previewUrl: '/api/assets/legs/male-black-sport-pants.png',
        path: path.join(__dirname, '../assets/legs/male-black-sport-pants.png')
    },
    {
        id: 'male-beige-chinos',
        name: { en: 'Beige Chinos', tn: 'Chinos Beige' },
        gender: 'male',
        outfitStyle: 'smart-casual',
        description: 'Male legs wearing beige khaki chino pants',
        previewUrl: '/api/assets/legs/male-beige-chinos.png',
        path: path.join(__dirname, '../assets/legs/male-beige-chinos.png')
    },
    {
        id: 'male-dark-gray-pants',
        name: { en: 'Dark Gray Pants', tn: 'Sarwal Rmadi Dahkar' },
        gender: 'male',
        outfitStyle: 'casual',
        description: 'Male legs wearing dark gray casual pants',
        previewUrl: '/api/assets/legs/male-dark-gray-pants.png',
        path: path.join(__dirname, '../assets/legs/male-dark-gray-pants.png')
    }
];

const SHOE_CAMERA_ANGLES = [
    {
        id: 'side_profile',
        name: { en: 'Side Profile', tn: 'Min Jnib' },
        key: 'side_profile',
        prompt: 'Side profile view, 90-degree angle showing the full silhouette of the shoe, clean lines, focus on design details and shoe height',
        icon: 'SideView'
    },
    {
        id: 'three_quarter',
        name: { en: '3/4 Angle', tn: 'Zewiya 3/4' },
        key: 'three_quarter',
        prompt: '3/4 front angle (classic product shot), slightly elevated view, showing both front and side features, professional e-commerce style',
        icon: 'Camera'
    },
    {
        id: 'front_view',
        name: { en: 'Front View', tn: 'Min Qoddam' },
        key: 'front_view',
        prompt: 'Direct front view, symmetrical composition, showcasing toe box, laces, and front design elements',
        icon: 'FrontView'
    },
    {
        id: 'top_down',
        name: { en: 'Top-Down', tn: 'Min Fouq' },
        key: 'top_down',
        prompt: 'Overhead top-down view (bird\'s eye), looking directly down at shoes, shows top surface and lacing pattern',
        icon: 'ArrowDown'
    },
    {
        id: 'low_angle',
        name: { en: 'Low Angle (Ground)', tn: 'Min Ta7t' },
        key: 'low_angle',
        prompt: 'Low ground-level angle, shot from below looking slightly up, dramatic and powerful perspective, emphasizes height and presence',
        icon: 'ArrowUp'
    },
    {
        id: 'detail_closeup',
        name: { en: 'Detail Close-Up', tn: 'Tafsil' },
        key: 'detail_closeup',
        prompt: 'Extreme close-up detail shot, macro focus on specific features like branding, stitching, material texture, or sole pattern',
        icon: 'Focus'
    }
];

const SHOE_LIGHTING_STYLES = [
    {
        id: 'studio_bright',
        name: { en: 'Studio Bright', tn: 'Studio Mdhawwa' },
        key: 'studio_bright',
        prompt: 'Professional studio lighting, bright and evenly diffused, minimal shadows, clean commercial look, pure white or neutral background',
        mood: 'clean'
    },
    {
        id: 'natural_soft',
        name: { en: 'Natural Soft', tn: 'Dhaw Tabi3i' },
        key: 'natural_soft',
        prompt: 'Soft natural daylight, gentle shadows, outdoor feel, balanced exposure, authentic and approachable aesthetic',
        mood: 'natural'
    },
    {
        id: 'dramatic_side',
        name: { en: 'Dramatic Side-Lit', tn: 'Dhaw Qawi Min Jnib' },
        key: 'dramatic_side',
        prompt: 'Strong directional side lighting, dramatic shadows, high contrast, bold and edgy mood, emphasizes texture and contours',
        mood: 'dramatic'
    },
    {
        id: 'golden_hour',
        name: { en: 'Golden Hour', tn: 'Dhaw Dhahabi' },
        key: 'golden_hour',
        prompt: 'Warm golden hour sunlight, sunset glow, long soft shadows, cinematic and premium feel, rich warm tones',
        mood: 'warm'
    },
    {
        id: 'moody_dark',
        name: { en: 'Moody Dark', tn: 'Dhaw Dahkar' },
        key: 'moody_dark',
        prompt: 'Low-key dark lighting, mysterious atmosphere, spotlight on shoes, dark background, luxury and sophistication',
        mood: 'moody'
    },
    {
        id: 'high_contrast',
        name: { en: 'High Contrast', tn: 'Contrast 3ali' },
        key: 'high_contrast',
        prompt: 'High contrast lighting setup, deep blacks and bright highlights, punchy and bold, modern editorial style',
        mood: 'bold'
    }
];

const BACKGROUNDS = [
    {
        id: 'sidi_bou_said',
        name: { en: 'Sidi Bou Said', tn: 'Sidi Bou Said' },
        prompt: 'Sidi Bou Said, Tunisia, iconic blue and white architecture, cobblestone street, bright Mediterranean sunlight, vibrant bougainvillea flowers, depth of field.',
        previewUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
        path: path.join(__dirname, '../assets/background/sidibou.png')
    },
    {
        id: 'medina',
        name: { en: 'Medina (Tunis)', tn: 'El Medina' },
        prompt: 'Traditional Tunisian Medina, ancient stone arches, intricately carved wooden doors, warm lantern lighting, cultural heritage atmosphere, soft shadows.',
        previewUrl: 'https://images.unsplash.com/photo-1548625361-58a9b86aa8a4?auto=format&fit=crop&w=900&q=80',
        path: path.join(__dirname, '../assets/background/madina.png')
    },
    {
        id: 'sahara',
        name: { en: 'Sahara Dunes', tn: 'Sahara' },
        prompt: 'Tunisian Sahara desert, golden sand dunes, sunset golden hour lighting, vast horizon, warm tones, cinematic travel aesthetic.',
        previewUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        path: path.join(__dirname, '../assets/background/sahara.png')
    },
    {
        id: 'carthage',
        name: { en: 'Carthage Ruins', tn: 'Carthage' },
        prompt: 'Ancient Carthage ruins, Roman columns, historic stone texture, blue sky background, majestic and timeless atmosphere.',
        previewUrl: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&w=900&q=80',
        path: path.join(__dirname, '../assets/background/carthage.png')
    },
    {
        id: 'gammarth_hotel',
        name: { en: 'Luxury Hotel (Gammarth)', tn: 'Hotel Luxe (Gammarth)' },
        prompt: 'Luxury beach resort in Gammarth, infinity pool background, palm trees, turquoise sea view, high-end vacation vibe, bright and airy.',
        previewUrl: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?auto=format&fit=crop&w=900&q=80',
        path: path.join(__dirname, '../assets/background/gammarth.png')
    },
    {
        id: 'studio_grey',
        name: { en: 'Studio', tn: 'Studio' },
        prompt: 'Professional studio setting, neutral backdrop, soft cinematic lighting, high-fashion look.',
        previewUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
        path: path.join(__dirname, '../assets/background/studio.png')
    }
];

// ============================================
// BAG CATEGORY CONFIGURATIONS
// ============================================

const BAG_STYLES = [
    {
        id: 'handbag',
        name: { en: 'Handbag', tn: 'Sac à Main' },
        prompt: 'Fashion handbag held elegantly, professional product photography, clear details on hardware and stitching',
    },
    {
        id: 'backpack',
        name: { en: 'Backpack', tn: 'Sac à Dos' },
        prompt: 'Backpack worn on model, lifestyle shot, showing straps and design, urban context',
    },
    {
        id: 'tote',
        name: { en: 'Tote Bag', tn: 'Cabas' },
        prompt: 'Large tote bag held by handles, professional fashion photography, spacious interior visible',
    },
    {
        id: 'crossbody',
        name: { en: 'Crossbody', tn: 'Bandoulière' },
        prompt: 'Crossbody bag worn across body, showing strap and closure, lifestyle fashion shot',
    },
    {
        id: 'clutch',
        name: { en: 'Clutch', tn: 'Pochette' },
        prompt: 'Elegant clutch bag held in hand, evening/formal setting, premium materials and details visible',
    },
    {
        id: 'duffle',
        name: { en: 'Duffle Bag', tn: 'Sac de Voyage' },
        prompt: 'Duffle bag in action, sporty or travel context, showing handles and compartments',
    },
];

const BAG_DISPLAY_MODES = [
    {
        id: 'held_hip',
        name: { en: 'Held at Hip', tn: 'Porté à la Hanche' },
        prompt: 'Female model elegantly holding the bag at hip level with relaxed arm position, professional fashion photography',
        recommended: true,
    },
    {
        id: 'shoulder',
        name: { en: 'On Shoulder', tn: 'Sur l\'Épaule' },
        prompt: 'Model wearing bag on shoulder with natural walking pose, lifestyle fashion shot, bag details visible',
    },
    {
        id: 'crossbody_style',
        name: { en: 'Crossbody Style', tn: 'Style Bandoulière' },
        prompt: 'Model wearing bag across body in crossbody style, casual urban setting, full body or 3/4 shot',
    },
    {
        id: 'in_hand',
        name: { en: 'In Hand', tn: 'À la Main' },
        prompt: 'Model holding bag by handles with arm naturally extended, professional product photography',
    },
    {
        id: 'flat_lay',
        name: { en: 'Flat Lay', tn: 'Vue de Dessus' },
        prompt: 'Professional flat lay product photography, bag placed on clean surface, top-down angle, studio lighting',
        productOnly: true,
    },
    {
        id: 'lifestyle',
        name: { en: 'Lifestyle Scene', tn: 'Scène Lifestyle' },
        prompt: 'Lifestyle fashion photography, model with bag in natural setting, candid yet polished aesthetic',
    },
];

const BAG_MODELS = [
    {
        id: 'bag-female-casual',
        name: { en: 'Casual Style', tn: 'Style Casual' },
        gender: 'female',
        description: 'Casual outfit model for everyday bag styling',
        path: path.join(__dirname, '../assets/models/bag-female-casual.png')
    },
    {
        id: 'bag-female-elegant',
        name: { en: 'Elegant Style', tn: 'Style Élégant' },
        gender: 'female',
        description: 'Elegant outfit model for formal bag styling',
        path: path.join(__dirname, '../assets/models/bag-female-elegant.png')
    },
    {
        id: 'bag-male-casual',
        name: { en: 'Casual Style', tn: 'Style Casual' },
        gender: 'male',
        description: 'Casual outfit model for everyday bag styling',
        path: path.join(__dirname, '../assets/models/bag-male-casual.png')
    },
];

// ============================================
// ACCESSORY CATEGORY CONFIGURATIONS
// ============================================

const ACCESSORY_TYPES = [
    {
        id: 'jewelry',
        name: { en: 'Jewelry', tn: 'Bijoux' },
        subtypes: [
            { id: 'necklace', name: { en: 'Necklace', tn: 'Collier' }, prompt: 'Elegant necklace on model, close-up on neck and collarbone area' },
            { id: 'bracelet', name: { en: 'Bracelet', tn: 'Bracelet' }, prompt: 'Bracelet on wrist, lifestyle shot with natural hand pose' },
            { id: 'ring', name: { en: 'Ring', tn: 'Bague' }, prompt: 'Ring on finger, close-up product shot, beautiful hand pose' },
            { id: 'earrings', name: { en: 'Earrings', tn: 'Boucles d\'Oreille' }, prompt: 'Earrings on model, profile or 3/4 face shot, soft lighting' },
        ],
    },
    {
        id: 'watches',
        name: { en: 'Watches', tn: 'Montres' },
        subtypes: [
            { id: 'wrist_watch', name: { en: 'Wrist Watch', tn: 'Montre' }, prompt: 'Luxury watch on wrist, elegant arm pose, lifestyle context' },
            { id: 'smart_watch', name: { en: 'Smart Watch', tn: 'Montre Connectée' }, prompt: 'Smart watch on wrist, active lifestyle context, modern tech aesthetic' },
        ],
    },
    {
        id: 'eyewear',
        name: { en: 'Eyewear', tn: 'Lunettes' },
        subtypes: [
            { id: 'sunglasses', name: { en: 'Sunglasses', tn: 'Lunettes de Soleil' }, prompt: 'Sunglasses on model face, outdoor setting, stylish pose' },
            { id: 'optical', name: { en: 'Optical Frames', tn: 'Lunettes de Vue' }, prompt: 'Glasses on model, professional setting, clear view of frame design' },
        ],
    },
    {
        id: 'scarves',
        name: { en: 'Scarves & Wraps', tn: 'Foulards' },
        subtypes: [
            { id: 'scarf', name: { en: 'Scarf', tn: 'Écharpe' }, prompt: 'Scarf styled on model, elegant draping, showing fabric texture' },
            { id: 'hijab', name: { en: 'Hijab', tn: 'Hijab' }, prompt: 'Hijab styled beautifully on model, modest fashion photography' },
            { id: 'shawl', name: { en: 'Shawl', tn: 'Châle' }, prompt: 'Shawl draped over shoulders, lifestyle setting, showing full design' },
        ],
    },
    {
        id: 'hats',
        name: { en: 'Hats & Headwear', tn: 'Chapeaux' },
        subtypes: [
            { id: 'cap', name: { en: 'Cap', tn: 'Casquette' }, prompt: 'Cap on model, casual streetwear style, urban context' },
            { id: 'beanie', name: { en: 'Beanie', tn: 'Bonnet' }, prompt: 'Beanie on model, cozy winter aesthetic, lifestyle shot' },
            { id: 'hat', name: { en: 'Hat', tn: 'Chapeau' }, prompt: 'Hat on model, fashion setting, showing shape and style' },
        ],
    },
];

const ACCESSORY_PLACEMENTS = [
    {
        id: 'on_model',
        name: { en: 'On Model', tn: 'Sur Modèle' },
        prompt: 'Accessory worn by model, professional fashion photography, focus on product details',
    },
    {
        id: 'close_up',
        name: { en: 'Close-Up Detail', tn: 'Gros Plan' },
        prompt: 'Macro close-up of accessory details, sharp focus, professional product photography',
    },
    {
        id: 'lifestyle',
        name: { en: 'Lifestyle Shot', tn: 'Scène Lifestyle' },
        prompt: 'Accessory in natural lifestyle context, candid yet polished aesthetic',
    },
    {
        id: 'flat_lay',
        name: { en: 'Flat Lay', tn: 'Vue de Dessus' },
        prompt: 'Accessory in styled flat lay composition, clean surface, studio lighting',
    },
];

// ============================================
// BAG CAMERA ANGLES & LIGHTING (Production Quality)
// ============================================

const BAG_CAMERA_ANGLES = [
    {
        id: 'front_straight',
        name: { en: 'Front Straight', tn: 'Vue de Face' },
        prompt: 'Direct front view, symmetrical composition, showing full bag face, handles/straps visible, professional product photography',
        recommended: true,
    },
    {
        id: 'three_quarter',
        name: { en: '3/4 Angle', tn: 'Vue 3/4' },
        prompt: '3/4 angle view showing depth and dimension, revealing side profile while maintaining front visibility, showing bag structure',
        recommended: true,
    },
    {
        id: 'side_profile',
        name: { en: 'Side Profile', tn: 'Profil' },
        prompt: 'Side profile view showing bag depth, strap/handle attachment, zipper details, professional silhouette shot',
    },
    {
        id: 'overhead',
        name: { en: 'Overhead', tn: 'Vue de Dessus' },
        prompt: 'Bird\'s eye overhead view, showing interior organization if open, or top closure and handle arrangement',
    },
    {
        id: 'low_angle',
        name: { en: 'Low Angle', tn: 'Contre-Plongée' },
        prompt: 'Low angle upward view, creates premium imposing presence, shows bag structure and craftsmanship, luxury brand aesthetic',
    },
];

const BAG_LIGHTING_OPTIONS = [
    {
        id: 'studio_soft',
        name: { en: 'Studio Soft', tn: 'Studio Doux' },
        prompt: 'Soft diffused studio lighting, even illumination, minimal shadows, professional product photography, shows material texture accurately',
        recommended: true,
    },
    {
        id: 'dramatic_side',
        name: { en: 'Dramatic Side', tn: 'Éclairage Latéral' },
        prompt: 'Dramatic side lighting, creates depth and dimension, highlights texture and stitching, luxury editorial style',
    },
    {
        id: 'natural_window',
        name: { en: 'Natural Window', tn: 'Lumière Naturelle' },
        prompt: 'Natural window light, soft warm tones, lifestyle aesthetic, authentic and approachable, social media ready',
    },
    {
        id: 'luxury_dark',
        name: { en: 'Luxury Dark', tn: 'Luxe Sombre' },
        prompt: 'Dark background with spotlight on bag, dramatic rim lighting, premium luxury brand aesthetic, high contrast',
        recommended: true,
    },
];

// ============================================
// ACCESSORY SHOT TYPES & LIGHTING (Production Quality)
// ============================================

const ACCESSORY_SHOT_TYPES = [
    {
        id: 'macro_detail',
        name: { en: 'Macro Detail', tn: 'Macro Détail' },
        prompt: 'Extreme close-up macro photography, sharp focus on fine details, texture and craftsmanship clearly visible, shallow depth of field, professional jewelry photography',
        recommended: true,
    },
    {
        id: 'flat_lay',
        name: { en: 'Flat Lay', tn: 'Vue de Dessus' },
        prompt: 'Overhead flat lay composition, organized and clean arrangement, high angle view, minimal props, balanced spacing, elegant presentation',
    },
    {
        id: 'floating',
        name: { en: 'Floating / Levitating', tn: 'Flottant' },
        prompt: 'Floating product photography, anti-gravity effect, suspended in mid-air, dynamic angle, magical and premium atmosphere, ethereal lighting',
    },
    {
        id: 'on_model',
        name: { en: 'On Model (Close)', tn: 'Sur Modèle' },
        prompt: 'Shot on model close-up, showing the accessory worn naturally, focus on the product with skin texture visible, lifestyle context, shallow depth of field',
    },
];

const ACCESSORY_LIGHTING_OPTIONS = [
    {
        id: 'jewelers_sparkle',
        name: { en: 'Jeweler\'s Sparkle', tn: 'Éclat Joaillier' },
        prompt: 'Professional jewelry lighting, hard light sources to create dispersion and sparkle in gems/metal, starburst highlights, high contrast reflection, luxury advertisement style, pristine clean background',
        recommended: true,
    },
    {
        id: 'soft_diffusion',
        name: { en: 'Soft Diffusion', tn: 'Diffusion Douce' },
        prompt: 'Soft diffused lighting, even illumination for texture details, minimal shadows, clean catalog style, true-to-life colors, professional product photography',
        recommended: true,
    },
    {
        id: 'dramatic_rim',
        name: { en: 'Dramatic Rim', tn: 'Contre-jour' },
        prompt: 'Dramatic rim lighting, dark background, edge lighting defining the shape, silhouette effect, moody and mysterious, high-end editorial style',
    },
    {
        id: 'natural_sun',
        name: { en: 'Natural Sun', tn: 'Soleil Naturel' },
        prompt: 'Natural sunlight, dappled light effect, warm golden tones, lifestyle atmosphere, organic shadows, outdoor setting feel',
    },
];

module.exports = {
    PRESET_PROMPTS,
    POSE_PROMPTS,
    SHOE_POSE_PROMPTS,
    MODELS,
    SHOE_MODELS,
    SHOE_CAMERA_ANGLES,
    SHOE_LIGHTING_STYLES,
    BACKGROUNDS,
    // Bag category exports
    BAG_STYLES,
    BAG_DISPLAY_MODES,
    BAG_MODELS,
    BAG_CAMERA_ANGLES,
    BAG_LIGHTING_OPTIONS,
    // Accessory category exports
    ACCESSORY_TYPES,
    ACCESSORY_PLACEMENTS,
    ACCESSORY_SHOT_TYPES,
    ACCESSORY_LIGHTING_OPTIONS,
};
