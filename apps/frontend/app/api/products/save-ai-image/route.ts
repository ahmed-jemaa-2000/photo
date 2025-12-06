import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * POST /api/products/save-ai-image
 * 
 * Saves an AI-generated image URL to a product's images array
 * Called from AI Studio after successful generation
 */
export async function POST(request: NextRequest) {
    try {
        // Get auth token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { productId, imageUrl } = await request.json();

        if (!productId || !imageUrl) {
            return NextResponse.json(
                { error: 'productId and imageUrl are required' },
                { status: 400 }
            );
        }

        // First, get the current product to access existing images
        const productRes = await fetch(`${STRAPI_URL}/api/products/${productId}?populate=images`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!productRes.ok) {
            if (productRes.status === 404) {
                return NextResponse.json(
                    { error: 'Product not found' },
                    { status: 404 }
                );
            }
            throw new Error(`Failed to fetch product: ${productRes.status}`);
        }

        const productData = await productRes.json();
        const existingImages = productData.data?.attributes?.images?.data || [];
        const existingImageIds = existingImages.map((img: any) => img.id);

        // Download the AI-generated image and upload to Strapi
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error('Failed to fetch AI-generated image');
        }

        const imageBlob = await imageResponse.blob();
        const fileName = `ai-generated-${productId}-${Date.now()}.png`;

        // Create FormData for upload
        const uploadFormData = new FormData();
        uploadFormData.append('files', imageBlob, fileName);

        // Upload to Strapi
        const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: uploadFormData,
        });

        if (!uploadRes.ok) {
            throw new Error(`Failed to upload image: ${uploadRes.status}`);
        }

        const uploadedFiles = await uploadRes.json();
        const newImageId = uploadedFiles[0]?.id;

        if (!newImageId) {
            throw new Error('No image ID returned from upload');
        }

        // Update product with new image
        const updateRes = await fetch(`${STRAPI_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    images: [...existingImageIds, newImageId],
                },
            }),
        });

        if (!updateRes.ok) {
            throw new Error(`Failed to update product: ${updateRes.status}`);
        }

        const updatedProduct = await updateRes.json();

        return NextResponse.json({
            success: true,
            message: 'Image saved to product',
            imageId: newImageId,
            productId: productId,
        });

    } catch (error) {
        console.error('Error saving AI image to product:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save image' },
            { status: 500 }
        );
    }
}
