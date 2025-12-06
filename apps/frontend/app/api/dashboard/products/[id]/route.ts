import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProductById, deleteFile } from '@/lib/strapi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const dynamic = 'force-dynamic';

// GET - Fetch product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await getProductById(parseInt(params.id), token);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = params.id;

    // Get FormData from request
    const formData = await request.formData();

    // Parse the data JSON
    const dataStr = formData.get('data') as string;
    if (!dataStr) {
      return NextResponse.json({ error: 'Missing product data' }, { status: 400 });
    }

    const data = JSON.parse(dataStr);

    // Handle images to delete
    const imagesToDeleteStr = formData.get('imagesToDelete') as string;
    if (imagesToDeleteStr) {
      const imagesToDelete = JSON.parse(imagesToDeleteStr);

      // Delete each image from Strapi
      for (const imageId of imagesToDelete) {
        try {
          await deleteFile(imageId, token);
        } catch (error) {
          console.error(`Failed to delete image ${imageId}:`, error);
          // Continue even if delete fails
        }
      }
    }

    // Create FormData for Strapi
    const strapiFormData = new FormData();
    strapiFormData.append('data', JSON.stringify(data));

    // Transfer new image files
    const imageFiles = formData.getAll('files.images');
    imageFiles.forEach((file) => {
      strapiFormData.append('files.images', file);
    });

    // Send to Strapi
    const response = await fetch(`${STRAPI_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: strapiFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Strapi error:', error);
      return NextResponse.json(
        { error: error.error?.message || 'Failed to update product' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
