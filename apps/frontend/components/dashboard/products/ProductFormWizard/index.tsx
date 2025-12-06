'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product, Category } from '@busi/types';
import { pageTransition } from '@/lib/animations';
import StepBasicInfo from './StepBasicInfo';
import StepMedia from './StepMedia';
import StepVariants from './StepVariants';
import StepSettings from './StepSettings';

// Validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  oldPrice: z.number().min(0).optional(),
  category: z.number().min(1, 'Category is required'),
  images: z.array(z.any()).optional(),
  variants: z.array(z.object({
    name: z.string(),
    options: z.array(z.string()),
  })).optional(),
  stock: z.number().min(0).optional(),
  sku: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormWizardProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Name, description, and pricing' },
  { id: 2, title: 'Media', description: 'Images and gallery' },
  { id: 3, title: 'Variants', description: 'Sizes, colors, and inventory' },
  { id: 4, title: 'Settings', description: 'Status, SEO, and visibility' },
];

export default function ProductFormWizard({
  product,
  categories,
  onSubmit,
  onCancel,
}: ProductFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      slug: product.slug || '',
      description: product.description || '',
      price: product.price,
      oldPrice: product.oldPrice,
      category: typeof product.category === 'object' ? product.category.id : product.category,
      images: product.images || [],
      stock: product.stock,
      sku: product.sku,
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
      tags: product.tags || [],
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
    } : {
      name: '',
      slug: '',
      description: '',
      price: 0,
      category: 0,
      images: [],
      isActive: true,
      isFeatured: false,
      tags: [],
    },
  });

  const handleNext = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await methods.trigger(fields);

    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(methods.getValues());
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepFields = (step: number): (keyof ProductFormData)[] => {
    switch (step) {
      case 1:
        return ['name', 'slug', 'description', 'price', 'oldPrice', 'category'];
      case 2:
        return ['images'];
      case 3:
        return ['variants', 'stock', 'sku'];
      case 4:
        return ['isActive', 'isFeatured', 'tags', 'seoTitle', 'seoDescription'];
      default:
        return [];
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Progress Steps */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex items-center gap-3">
                  {/* Step Circle */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                      currentStep === step.id
                        ? 'bg-primary text-white'
                        : currentStep > step.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="hidden md:block">
                    <div
                      className={`text-sm font-semibold ${
                        currentStep === step.id ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400">{step.description}</div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="mx-4 h-0.5 flex-1 bg-gray-200">
                    <div
                      className={`h-full transition-all ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            {currentStep === 1 && <StepBasicInfo categories={categories} />}
            {currentStep === 2 && <StepMedia />}
            {currentStep === 3 && <StepVariants />}
            {currentStep === 4 && <StepSettings />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {currentStep === STEPS.length ? (
                isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Save Product
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )
              ) : (
                <>
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
