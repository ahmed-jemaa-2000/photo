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

module.exports = {
    PRESET_PROMPTS,
    POSE_PROMPTS,
    SHOE_POSE_PROMPTS,
    MODELS,
    SHOE_MODELS,
    BACKGROUNDS
};

