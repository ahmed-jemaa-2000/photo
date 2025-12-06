/**
 * Generation History Service
 * Saves successful AI generations to Strapi for user history/gallery
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * Save a generation record to Strapi
 * @param {string} authToken - User's JWT token
 * @param {object} generationData - Data about the generation
 */
async function saveGeneration(authToken, generationData) {
    try {
        const { imageUrl, downloadUrl, category, prompt, productId, metadata } = generationData;

        const response = await fetch(`${STRAPI_URL}/api/ai-generations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                data: {
                    imageUrl,
                    downloadUrl,
                    category,
                    prompt,
                    product: productId || null,
                    metadata: metadata || {},
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save generation record:', response.status, errorText);
            return { success: false, error: errorText };
        }

        const result = await response.json();
        console.log('✅ Generation saved to history:', result.data?.id);
        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error('Error saving generation to history:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Get user's generation history
 * @param {string} authToken - User's JWT token  
 */
async function getGenerations(authToken) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/ai-generations/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch generations: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching generations:', error.message);
        return { data: [] };
    }
}

module.exports = {
    saveGeneration,
    getGenerations,
};
