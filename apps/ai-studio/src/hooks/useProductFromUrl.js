import { useState, useEffect } from 'react';

/**
 * Hook to read product data from URL parameters
 * Used when Dashboard redirects to AI Studio with a product pre-selected
 * 
 * URL format: ?productId=123&name=Product%20Name&image=https://...
 */
export function useProductFromUrl() {
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const parseUrlParams = async () => {
            try {
                const params = new URLSearchParams(window.location.search);

                const productId = params.get('productId');
                const name = params.get('name');
                const imageUrl = params.get('image');

                // If no product params, we're not in product mode
                if (!productId && !imageUrl) {
                    setLoading(false);
                    return;
                }

                // Build product data object
                const product = {
                    id: productId ? parseInt(productId, 10) : null,
                    name: name || 'Product',
                    imageUrl: imageUrl || null,
                    file: null,
                };

                // If there's an image URL, try to fetch it and convert to File
                if (imageUrl) {
                    try {
                        const file = await urlToFile(imageUrl, name || 'product-image');
                        product.file = file;
                    } catch (fetchError) {
                        console.warn('Could not fetch product image:', fetchError);
                        // Continue without the file - user can upload manually
                    }
                }

                setProductData(product);

                // Clear URL params after reading (clean URL)
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);

            } catch (err) {
                console.error('Error parsing product URL params:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        parseUrlParams();
    }, []);

    return { productData, loading, error };
}

/**
 * Convert an image URL to a File object
 * Handles CORS by routing through our download proxy if needed
 */
async function urlToFile(url, filename) {
    // Use our download proxy to avoid CORS issues
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const proxyUrl = `${API_BASE}/api/download-image?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

    try {
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();

        // Determine file extension from content type
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const extension = contentType.includes('png') ? 'png'
            : contentType.includes('webp') ? 'webp'
                : 'jpg';

        // Create File object from blob
        const file = new File([blob], `${filename}.${extension}`, { type: contentType });

        return file;
    } catch (error) {
        console.error('Error converting URL to File:', error);
        throw error;
    }
}

export default useProductFromUrl;
