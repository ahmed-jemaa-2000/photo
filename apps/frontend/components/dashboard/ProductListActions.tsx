'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteProduct } from '@/lib/strapi';
import { useConfirm } from '@/hooks/useConfirm';

interface ProductListActionsProps {
  productId: number;
  productName?: string;
  productImage?: string;
}

// AI Studio URL - uses subdomain in production, localhost in dev
const AI_STUDIO_URL = process.env.NODE_ENV === 'production'
  ? 'https://studio.brandili.shop'
  : 'http://localhost:3002';

export default function ProductListActions({
  productId,
  productName,
  productImage
}: ProductListActionsProps) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Product',
      description: 'Are you sure you want to delete this product? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      // Get token from cookie (will be sent automatically)
      const response = await fetch('/api/dashboard/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        router.refresh();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Build AI Studio URL with product data
  const getAIStudioUrl = () => {
    const params = new URLSearchParams();
    params.set('productId', productId.toString());
    if (productName) params.set('name', productName);
    if (productImage) params.set('image', productImage);
    return `${AI_STUDIO_URL}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {/* AI Generate Button - Highlighted */}
      {productImage && (
        <a
          href={getAIStudioUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm transition"
          title="Generate AI photo for this product"
        >
          <span>✨</span>
          <span>AI Photo</span>
        </a>
      )}

      <Link
        href={`/dashboard/products/${productId}/edit`}
        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
