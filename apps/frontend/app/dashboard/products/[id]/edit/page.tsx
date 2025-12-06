'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import ProductForm from '@/components/dashboard/ProductForm';
import type { Product, Category } from '@busi/types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { confirm } = useConfirm();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        fetch(`/api/dashboard/products/${productId}`),
        fetch('/api/dashboard/categories'),
      ]);

      if (!productRes.ok) {
        throw new Error('Product not found');
      }

      const productData = await productRes.json();
      const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

      setProduct(productData);
      setCategories(categoriesData);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      setError(error.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/dashboard/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      // Success - redirect to products list
      toast.success('Product updated successfully!');
      router.push('/dashboard/products');
      router.refresh();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = await confirm({
      title: 'Discard Changes',
      description: 'Are you sure? Any unsaved changes will be lost.',
      confirmText: 'Discard',
      cancelText: 'Keep Editing',
    });

    if (confirmed) {
      router.push('/dashboard/products');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/dashboard/products')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>

      <ProductForm
        product={product}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
