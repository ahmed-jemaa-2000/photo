/**
 * Shared Animation Styles Configuration
 * 
 * Single source of truth for video animation presets used across:
 * - AI API (geminiService.js)
 * - AI Studio (GenerationResult.jsx)
 */

// Animation styles for video generation - CATEGORY SPECIFIC
export const ANIMATION_STYLES = {
    clothes: [
        {
            id: 'runway_walk',
            name: 'Runway Walk',
            description: 'Professional runway walk with confident stride',
            prompt: 'Smooth runway walk, confident stride, subtle hip movement, fabric flowing naturally, professional lighting consistent, camera follows model smoothly, high-end fashion commercial, 4K cinematic, garment details visible throughout'
        },
        {
            id: 'model_turn',
            name: 'Model Turn',
            description: '360° turn showing all angles',
            prompt: 'Graceful 360-degree turn on spot, fabric movement visible, smooth pivot, showing front, side, and back of garment, professional lighting maintained through rotation, fashion show quality'
        },
        {
            id: 'subtle_pose',
            name: 'Subtle Move',
            description: 'Gentle pose transitions',
            prompt: 'Minimal elegant movement, gentle weight shift, slight arm adjustment, breathing animation, maintaining fashion pose, professional model micro-movements, high-end lookbook style'
        },
        {
            id: 'fabric_flow',
            name: 'Fabric Flow',
            description: 'Highlight fabric movement',
            prompt: 'Dramatic fabric movement, wind-blown effect, material flowing and draping, showcasing texture and flow, editorial fashion aesthetic, slow motion fabric physics, premium commercial quality'
        }
    ],
    shoes: [
        {
            id: 'walking_feet',
            name: 'Walking Motion',
            description: 'Natural walking from low angle',
            prompt: 'Focus on feet and legs, natural walking motion from low angle, each step clearly visible, shoe flex and movement shown, clean floor reflection, professional footwear commercial, steady tracking shot'
        },
        {
            id: 'shoe_rotation',
            name: '360° Rotation',
            description: 'Orbit around the shoe',
            prompt: 'Smooth 360-degree orbit around the shoe, revealing all angles, focus on design details and craftsmanship, professional product photography in motion, studio lighting, no model visible'
        },
        {
            id: 'step_detail',
            name: 'Step Detail',
            description: 'Close-up stepping motion',
            prompt: 'Close-up shot of foot stepping forward, slow motion, sole flex visible, heel-to-toe motion, showcasing shoe performance and comfort, athletic commercial style'
        },
        {
            id: 'lacing_focus',
            name: 'Detail Zoom',
            description: 'Zoom on lacing and details',
            prompt: 'Camera slowly zooms and pans across shoe details, focusing on lacing, stitching, material texture, tongue, and branding, macro product video style'
        }
    ],
    bags: [
        {
            id: 'carry_walk',
            name: 'Carry & Walk',
            description: 'Model walking with bag',
            prompt: 'Model walking naturally with bag, arm swing with bag visible, lifestyle context, bag moves realistically with body motion, fashion accessory commercial, focus on bag throughout'
        },
        {
            id: 'bag_360',
            name: '360° Display',
            description: 'Full rotation product shot',
            prompt: 'Smooth 360-degree rotation of bag, floating or on display stand, studio lighting, showing all sides, hardware details, interior briefly visible, luxury product commercial'
        },
        {
            id: 'open_close',
            name: 'Open & Close',
            description: 'Show interior and closure',
            prompt: 'Hands opening bag to reveal interior, showing pockets and organization, then closing with click of clasp or zipper, luxury detail shot, close-up hands product video'
        },
        {
            id: 'strap_adjust',
            name: 'Strap Style',
            description: 'Adjusting shoulder strap',
            prompt: 'Model adjusting bag strap on shoulder, showing strap length and comfort, lifestyle natural movement, casual confident styling, fashion accessory lifestyle video'
        }
    ],
    accessories: [
        {
            id: 'wrist_showcase',
            name: 'Wrist Showcase',
            description: 'Watch/bracelet on wrist',
            prompt: 'Close-up of wrist with accessory, gentle wrist rotation to catch light, showing detail and craftsmanship, elegant hand movements, luxury jewelry commercial'
        },
        {
            id: 'product_spin',
            name: 'Product Spin',
            description: '360° product rotation',
            prompt: 'Smooth 360-degree rotation of accessory floating in frame, studio lighting catching reflections, detailed close-up showing texture and finish, product commercial style'
        },
        {
            id: 'try_on',
            name: 'Try On',
            description: 'Putting on the accessory',
            prompt: 'Hands delicately putting on accessory, showing clasp or mechanism, smooth motion, highlighting ease of wear and style, lifestyle jewelry video'
        },
        {
            id: 'light_play',
            name: 'Light Play',
            description: 'Catch the light',
            prompt: 'Accessory rotating slowly to catch light, sparkle and reflection visible, premium jewelry commercial lighting, macro detail on gems or metalwork'
        }
    ]
};

/**
 * Get animation styles for a specific category
 * @param {string} category - clothes, shoes, bags, or accessories
 * @returns {Array} Animation styles for the category
 */
export function getAnimationStylesForCategory(category) {
    return ANIMATION_STYLES[category] || ANIMATION_STYLES.clothes;
}

/**
 * Get default animation style for a category
 * @param {string} category - Category name
 * @returns {object} Default animation style
 */
export function getDefaultAnimationStyle(category) {
    const styles = getAnimationStylesForCategory(category);
    return styles[0] || null;
}

export default ANIMATION_STYLES;
