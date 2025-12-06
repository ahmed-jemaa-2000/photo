'use client';

import { useFormContext } from 'react-hook-form';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, Reorder } from 'framer-motion';
import { staggerItem } from '@/lib/animations';

interface ImageItem {
  id: string;
  file?: File;
  url?: string;
  alt?: string;
}

export default function StepMedia() {
  const { watch, setValue } = useFormContext();
  const images = watch('images') || [];
  const [imageItems, setImageItems] = useState<ImageItem[]>(
    images.map((img: any, index: number) => ({
      id: img.id || `temp-${index}`,
      url: typeof img === 'string' ? img : img.url,
      alt: img.alt || '',
    }))
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageItem[] = Array.from(files).map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
    }));

    const updated = [...imageItems, ...newImages];
    setImageItems(updated);
    setValue('images', updated);
  }, [imageItems, setValue]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleRemove = (id: string) => {
    const updated = imageItems.filter((img) => img.id !== id);
    setImageItems(updated);
    setValue('images', updated);
  };

  const handleReorder = (newOrder: ImageItem[]) => {
    setImageItems(newOrder);
    setValue('images', newOrder);
  };

  const handleAltChange = (id: string, alt: string) => {
    const updated = imageItems.map((img) =>
      img.id === id ? { ...img, alt } : img
    );
    setImageItems(updated);
    setValue('images', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Product Media</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add images to showcase your product. The first image will be the main product image.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">
            {isDragging ? 'Drop images here' : 'Upload product images'}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop or click to browse
          </p>
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
      </div>

      {/* Image Gallery with Reordering */}
      {imageItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {imageItems.length} {imageItems.length === 1 ? 'image' : 'images'} uploaded
            </p>
            <p className="text-xs text-gray-500">
              Drag to reorder • First image is the main image
            </p>
          </div>

          <Reorder.Group
            axis="y"
            values={imageItems}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {imageItems.map((image, index) => (
              <Reorder.Item
                key={image.id}
                value={image}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="flex cursor-grab flex-col gap-0.5 pt-2 active:cursor-grabbing">
                    <div className="h-1 w-1 rounded-full bg-gray-400" />
                    <div className="h-1 w-1 rounded-full bg-gray-400" />
                    <div className="h-1 w-1 rounded-full bg-gray-400" />
                  </div>

                  {/* Image Preview */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    {image.url && (
                      <Image
                        src={image.url}
                        alt={image.alt || 'Product image'}
                        fill
                        className="object-cover"
                      />
                    )}
                    {index === 0 && (
                      <div className="absolute left-0 top-0 rounded-br-lg bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                        Main
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          Image {index + 1}
                          {index === 0 && <span className="ml-2 text-xs text-gray-500">(Main product image)</span>}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(image.id)}
                        className="rounded-lg p-1 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Alt Text Input */}
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => handleAltChange(image.id, e.target.value)}
                      placeholder="Image description (for SEO and accessibility)"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Empty State */}
      {imageItems.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">No images uploaded yet</p>
          <p className="text-xs text-gray-500">Upload at least one image to showcase your product</p>
        </div>
      )}

      {/* Best Practices */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="flex-1 text-sm text-blue-900">
            <p className="font-semibold">Image Best Practices:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-blue-700">
              <li>Use high-quality images with good lighting and clear focus</li>
              <li>Show the product from multiple angles (front, back, details)</li>
              <li>Use consistent white or neutral backgrounds</li>
              <li>Recommended size: 1200x1200px or larger for best quality</li>
              <li>First image appears in search results and product listings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Optimization Tip */}
      {imageItems.length > 5 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Tip:</span> You have {imageItems.length} images. Consider keeping it under 8 images for optimal page load speed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
