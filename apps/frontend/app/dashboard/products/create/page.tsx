'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import ProductForm from '@/components/dashboard/ProductForm';
import type { Category } from '@busi/types';

export default function CreateProductPage() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/dashboard/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dashboard/products/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      const result = await response.json();

      // Success - redirect to products list
      toast.success('Product created successfully!');
      router.push('/dashboard/products');
      router.refresh();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product. Please try again.');
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-1">Add a new product to your catalog</p>
      </div>

      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
