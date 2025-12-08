// ============================================
// PROMPT CONFIGURATIONS
// ============================================

export const POSE_PROMPTS = [
    { label: 'Standing', key: 'standing', prompt: 'Full-length standing pose, relaxed weight shift, arms natural, outfit fully visible.' },
    { label: 'Walking', key: 'walking', prompt: 'Mid-step walking pose, gentle arm swing, natural motion blur avoided, outfit centered.' },
    { label: 'Seated/leaning', key: 'seated', prompt: 'Seated or lightly leaning pose with straight posture, garment drape visible.' },
    { label: 'Dynamic', key: 'dynamic', prompt: 'Dynamic half-turn with confident stance, torso rotation, outfit front still clear.' },
];

export const VARIATION_CUES = [
    'Use a fresh pose variation: slight head tilt, relaxed weight shift, and a subtle hand gesture.',
    'Change the stance: a gentle walk mid-step, natural arm swing, and soft gaze off-camera.',
    'Try a seated or leaning pose with natural posture, keeping the garment fully visible.',
    'Vary the camera: slightly lower angle for presence, medium framing, crisp focus on the outfit.',
    'Add dynamic energy: a light turn of the torso, one foot forward, confident expression.',
];

// ============================================
// STEP CONFIGURATIONS BY CATEGORY
// ============================================

export const getCategorySteps = (category) => {
    switch (category) {
        case 'clothes':
            return ['upload', 'essentials', 'model', 'scene', 'review'];
        case 'shoes':
            return ['upload', 'essentials', 'shoeModel', 'scene', 'review'];
        case 'bags':
            return ['upload', 'essentials', 'bagStyle', 'scene', 'review'];
        case 'accessories':
            return ['upload', 'essentials', 'accessoryType', 'scene', 'review'];
        default:
            return ['category', 'upload', 'essentials', 'configure', 'review'];
    }
};

export const STEP_LABELS = {
    category: 'Category',
    upload: 'Upload',
    essentials: 'Model',
    model: 'Model',
    shoeModel: 'Style',
    bagStyle: 'Style',
    accessoryType: 'Type',
    scene: 'Scene',
    review: 'Generate',
    configure: 'Configure',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function buildPersonaDescription(persona) {
    const parts = [];
    const genderMap = { 'female': 'female', 'male': 'male', 'non-binary': 'non-binary' };
    const genderText = genderMap[persona.gender] || 'female';
    parts.push(`Use a ${genderText} model`);

    const ageMap = {
        'young-adult': 'in their 20s', 'adult': 'in their 30s',
        'mature': 'in their 40s-50s', 'senior': 'in their 60s or older',
    };
    if (persona.ageRange && ageMap[persona.ageRange]) parts.push(ageMap[persona.ageRange]);

    const ethnicityMap = {
        'asian': 'East Asian ethnicity', 'south-asian': 'South Asian ethnicity',
        'black': 'Black ethnicity', 'caucasian': 'Caucasian ethnicity',
        'hispanic': 'Hispanic/Latino ethnicity', 'middle-eastern': 'Middle Eastern ethnicity',
        'tunisian': 'Tunisian ethnicity, North African features', 'mixed': 'mixed ethnicity',
    };
    if (persona.ethnicity && persona.ethnicity !== 'any' && ethnicityMap[persona.ethnicity]) {
        parts.push(`with ${ethnicityMap[persona.ethnicity]}`);
    }

    const skinToneMap = {
        'fair': 'fair skin tone', 'light': 'light skin tone', 'medium': 'medium skin tone',
        'tan': 'tan skin tone', 'deep': 'deep skin tone', 'rich': 'rich skin tone',
    };
    if (persona.skinTone && skinToneMap[persona.skinTone]) parts.push(skinToneMap[persona.skinTone]);

    if (persona.hairStyle && persona.hairColor) {
        parts.push(`${persona.hairStyle} ${persona.hairColor} hair`);
    } else if (persona.hairStyle) {
        parts.push(`${persona.hairStyle} hair`);
    }

    const bodyTypeMap = {
        'slim': 'slim build', 'athletic': 'athletic build', 'average': 'average build',
        'curvy': 'curvy build', 'plus-size': 'plus-size build',
    };
    if (persona.bodyType && bodyTypeMap[persona.bodyType]) parts.push(`and a ${bodyTypeMap[persona.bodyType]}`);

    return parts.join(', ') + '.';
}

export function buildShoePersonaDescription(shoeModel) {
    if (!shoeModel) return 'Show shoes on neutral legs, photographed from mid-thigh to feet';
    return shoeModel.description + ', photographed from mid-thigh to feet';
}

export function buildBagPrompt(bagStyle, displayMode) {
    const stylePrompt = bagStyle?.prompt || '';
    const modePrompt = displayMode?.prompt || '';
    return `${stylePrompt} ${modePrompt}`.trim();
}

export function buildAccessoryPrompt(accessoryType, accessorySubtype) {
    const basePrompt = accessorySubtype?.prompt || accessoryType?.prompt || '';
    return basePrompt;
}
