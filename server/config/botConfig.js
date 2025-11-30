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




const BACKDROP_PROMPTS = [
    {
        label: { en: 'Sidi Bou Said 🇹🇳', tn: 'Sidi Bou Said 🇹🇳' },
        prompt: 'Sidi Bou Said, Tunisia, iconic blue and white architecture, cobblestone street, bright Mediterranean sunlight, vibrant bougainvillea flowers, depth of field.'
    },
    {
        label: { en: 'Medina (Tunis) 🕌', tn: 'El Medina 🕌' },
        prompt: 'Traditional Tunisian Medina, ancient stone arches, intricately carved wooden doors, warm lantern lighting, cultural heritage atmosphere, soft shadows.'
    },
    {
        label: { en: 'Sahara Dunes 🏜️', tn: 'Sahara 🏜️' },
        prompt: 'Tunisian Sahara desert, golden sand dunes, sunset golden hour lighting, vast horizon, warm tones, cinematic travel aesthetic.'
    },
    {
        label: { en: 'Carthage Ruins 🏛️', tn: 'Carthage 🏛️' },
        prompt: 'Ancient Carthage ruins, Roman columns, historic stone texture, blue sky background, majestic and timeless atmosphere.'
    },
    {
        label: { en: 'Luxury Hotel (Hammamet) 🌊', tn: 'Hotel Luxe (Hammamet) 🌊' },
        prompt: 'Luxury beach resort in Hammamet, infinity pool background, palm trees, turquoise sea view, high-end vacation vibe, bright and airy.'
    },
    {
        label: { en: 'Clean Studio', tn: 'Studio' },
        prompt: 'Neutral studio backdrop, soft gradient, minimal props.'
    },
];

module.exports = {
    PRESET_PROMPTS,
    POSE_PROMPTS,
    SHOE_POSE_PROMPTS,
    BACKDROP_PROMPTS
};

