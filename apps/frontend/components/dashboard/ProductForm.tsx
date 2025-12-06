'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import type { Product, Category, Media } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  // Form state
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() || '');
  const [categoryId, setCategoryId] = useState<string>(() => {
    if (!product?.category) return '';
    if (typeof product.category === 'object' && product.category.id !== undefined) {
      return product.category.id.toString();
    }
    if (typeof product.category === 'number' || typeof product.category === 'string') {
      return product.category.toString();
    }
    return '';
  });
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [stock, setStock] = useState(product?.stock?.toString() || '');

  // Sizes and colors as comma-separated strings for better UX
  const [sizesInput, setSizesInput] = useState(
    product?.sizes ? product.sizes.join(', ') : ''
  );
  const [colorsInput, setColorsInput] = useState(
    product?.colors ? product.colors.join(', ') : ''
  );

  // Image handling
  const [existingImages, setExistingImages] = useState<Media[]>(product?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle new image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setNewImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove new image before upload
  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Reorder new images to set a main image
  const handleSetNewMain = (index: number) => {
    setNewImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    setImagePreviews((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  // Mark existing image for deletion
  const handleRemoveExistingImage = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Reorder existing images to set a main image
  const handleSetExistingMain = (imageId: number) => {
    setExistingImages((prev) => {
      const mainImage = prev.find((img) => img.id === imageId);
      if (!mainImage) return prev;
      const rest = prev.filter((img) => img.id !== imageId);
      return [mainImage, ...rest];
    });
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (oldPrice && (isNaN(parseFloat(oldPrice)) || parseFloat(oldPrice) < parseFloat(price))) {
      newErrors.oldPrice = 'Old price must be greater than current price';
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Build FormData
    const formData = new FormData();

    // Basic fields
    const data: any = {
      name: name.trim(),
      price: parseFloat(price),
      isActive,
      isFeatured,
    };

    if (description.trim()) {
      data.description = description.trim();
    }

    if (oldPrice) {
      data.oldPrice = parseFloat(oldPrice);
    }

    if (categoryId) {
      data.category = parseInt(categoryId);
    }

    if (stock) {
      data.stock = parseInt(stock);
    }

    // Parse sizes and colors
    const sizesArray = sizesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const colorsArray = colorsInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    data.sizes = sizesArray;
    data.colors = colorsArray;

    // Add data to FormData
    formData.append('data', JSON.stringify(data));

    // Add new images
    newImages.forEach((file) => {
      formData.append('files.images', file, file.name);
    });

    // Add images to delete (for edit mode)
    if (imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save product. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Images Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Product Images *</h3>

        {errors.images && (
          <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {errors.images}
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Existing Images */}
          {existingImages.map((image, index) => (
            <div key={image.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <Image
                src={getStrapiMediaUrl(image.url)}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => handleSetExistingMain(image.id)}
                  className="bg-white text-gray-800 px-2 py-1 rounded-full text-[11px] font-semibold shadow border border-gray-200 hover:bg-gray-50"
                >
                  Set as main
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(image.id)}
                  className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}

          {/* New Images Preview */}
          {imagePreviews.map((preview, index) => (
            <div key={`preview-${index}`} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <Image
                src={preview}
                alt={`New image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => handleSetNewMain(index)}
                  className="bg-white text-gray-800 px-2 py-1 rounded-full text-[11px] font-semibold shadow border border-gray-200 hover:bg-gray-50"
                >
                  Set as main
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded ${index === 0 ? 'bg-primary' : 'bg-green-500'}`}>
                {index === 0 ? 'Main' : 'New'}
              </div>
            </div>
          ))}

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-gray-600">Add Images</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />

        <p className="text-sm text-gray-500">
          Upload up to 10 images. First image will be the main product image. Max 10MB per image.
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Classic Cotton T-Shirt"
          />
          {errors.name && (
            <p className="error-message text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Detailed product description..."
          />
          <p className="text-sm text-gray-500 mt-1">
            You can use HTML for formatting (e.g., &lt;b&gt;bold&lt;/b&gt;, &lt;br/&gt; for line breaks)
          </p>
        </div>

        {/* Price and Old Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (TND) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="45.00"
            />
            {errors.price && (
              <p className="error-message text-red-600 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Old Price (TND)
              <span className="text-gray-500 text-xs ml-1">(optional, for showing discounts)</span>
            </label>
            <input
              id="oldPrice"
              type="number"
              step="0.01"
              min="0"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.oldPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="60.00"
            />
            {errors.oldPrice && (
              <p className="error-message text-red-600 text-sm mt-1">{errors.oldPrice}</p>
            )}
          </div>
        </div>

        {/* Category and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
              <span className="text-gray-500 text-xs ml-1">(optional)</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="100"
            />
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Variants</h3>

        {/* Sizes */}
        <div>
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-1">
            Available Sizes
          </label>
          <input
            id="sizes"
            type="text"
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="S, M, L, XL, XXL"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter sizes separated by commas
          </p>
        </div>

        {/* Colors */}
        <div>
          <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-1">
            Available Colors
          </label>
          <input
            id="colors"
            type="text"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Black, White, Blue, Red"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter colors separated by commas
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Display Settings</h3>

        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <div>
              <span className="font-medium text-gray-900">Active</span>
              <p className="text-sm text-gray-500">Show this product on your storefront</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <div>
              <span className="font-medium text-gray-900">Featured</span>
              <p className="text-sm text-gray-500">Highlight this product in hero section</p>
            </div>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>{product ? 'Update Product' : 'Create Product'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
