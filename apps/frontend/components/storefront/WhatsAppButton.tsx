'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { Product, Shop } from '@busi/types';
import { generateWhatsAppUrl, isValidWhatsAppNumber } from '@/lib/whatsapp';
import { Loader2 } from 'lucide-react';
import { TUNISIAN_GOVERNORATES } from '@/lib/constants/tunisia';

interface WhatsAppButtonProps {
  product: Product;
  shop: Shop;
}

export default function WhatsAppButton({ product, shop }: WhatsAppButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    city: '',
  });

  const requiresSize = Array.isArray(product.sizes) && product.sizes.length > 0;
  const requiresColor = Array.isArray(product.colors) && product.colors.length > 0;
  const hasVariants = requiresSize || requiresColor;
  const isVariantMissingSelection =
    (requiresSize && !selectedSize) || (requiresColor && !selectedColor);

  const handleOrderClick = () => {
    if (!shop.whatsappNumber) {
      toast.error('WhatsApp number not configured for this shop');
      return;
    }
    setIsModalOpen(true);
  };

  const normalizePhone = (phone: string) => {
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');
    return trimmed.startsWith('+') ? `+${digits}` : digits;
  };

  const validateForm = () => {
    const customerName = formData.name.trim();
    const customerPhone = normalizePhone(formData.phone);
    const customerAddress = `${formData.governorate} - ${formData.city}`.trim();

    if (customerName.length < 2) {
      toast.error('Please enter your full name (at least 2 characters).');
      return null;
    }

    if (customerName.length > 100) {
      toast.error('Name is too long (max 100 characters).');
      return null;
    }

    if (!isValidWhatsAppNumber(customerPhone)) {
      toast.error('Enter a valid phone number (8-15 digits).');
      return null;
    }

    if (!formData.governorate) {
      toast.error('Please select your Governorate.');
      return null;
    }

    if (requiresSize && !selectedSize) {
      toast.error('Please select a size before continuing.');
      return null;
    }

    if (requiresColor && !selectedColor) {
      toast.error('Please select a color before continuing.');
      return null;
    }

    return {
      customerName,
      customerPhone,
      customerAddress,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validated = validateForm();
    if (!validated) return;

    setIsLoading(true);

    try {
      // 1. Create Order in Backend
      const response = await fetch('/api/shop/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: validated.customerName,
          customerPhone: validated.customerPhone,
          customerAddress: validated.customerAddress,
          shopId: shop.id,
          items: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price,
              size: selectedSize || undefined,
              color: selectedColor || undefined,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to create order');
      }

      // 2. Generate WhatsApp URL and Redirect
      const url = generateWhatsAppUrl({
        phone: shop.whatsappNumber!,
        productName: product.name,
        price: product.price,
        shopName: shop.name,
        size: selectedSize,
        color: selectedColor,
      });

      window.open(url, '_blank');
      setIsModalOpen(false);
      toast.success('Order started! Opening WhatsApp...');

      // Reset form
      setFormData({ name: '', phone: '', governorate: '', city: '' });
      setSelectedSize('');
      setSelectedColor('');

    } catch (error) {
      console.error('Order Error:', error);
      const fallbackMessage = error instanceof Error && error.message
        ? `${error.message} - opening WhatsApp so you can still place the order.`
        : 'Something went wrong creating your order - opening WhatsApp so you can still place it.';
      toast.error(fallbackMessage);

      // Fallback: Open WhatsApp anyway so we don't lose the sale
      const url = generateWhatsAppUrl({
        phone: shop.whatsappNumber!,
        productName: product.name,
        price: product.price,
        shopName: shop.name,
        size: selectedSize,
        color: selectedColor,
      });
      window.open(url, '_blank');
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12c0 5 4 9 9 9 5 0 9-4 9-9 0-2.1-.7-4-2-5.5" strokeLinecap="round" />
                <path d="M16 3 8.5 12 6 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">Order via WhatsApp</p>
              <p className="text-sm text-gray-600">Fast confirmation, pay on delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">No upfront payment</span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Secure chat</span>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-700">Select Size</p>
                <span className="text-xs text-gray-500">Required</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`group min-w-[72px] rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${selectedSize === size
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-gray-200 bg-white hover:border-primary/60 hover:text-primary'
                      }`}
                  >
                    <span className="block text-center">{size}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-700">Select Color</p>
                <span className="text-xs text-gray-500">Required</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${selectedColor === color
                      ? 'border-primary bg-primary/5 text-primary shadow-sm'
                      : 'border-gray-200 bg-white hover:border-primary/60 hover:text-primary'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-5 w-5 rounded-full border border-gray-200 shadow-sm ring-1 ring-gray-200"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="capitalize">{color}</span>
                    </div>
                    {selectedColor === color && (
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 10.5 8.5 14 15 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleOrderClick}
            disabled={isVariantMissingSelection || isLoading}
            className="w-full rounded-xl bg-green-500 px-5 py-4 text-white font-semibold shadow-md transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{isLoading ? 'Opening WhatsApp...' : 'Order via WhatsApp'}</span>
            </div>
          </button>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="rounded-full bg-gray-100 px-3 py-1">We reserve your item</span>
            <span className="rounded-full bg-gray-100 px-3 py-1">Share address in chat</span>
          </div>
          {hasVariants && isVariantMissingSelection && (
            <p className="flex items-center gap-2 text-sm text-amber-600">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 4v5m0 4h.01M10 1.667 1.667 18.333h16.666L10 1.667Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Please select required options to continue.
            </p>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Complete your Order</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Please enter your details so we can prepare your order before redirecting you to WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g. Ahmed Jemaa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g. 20 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate *</label>
                <select
                  required
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Governorate</option>
                  {TUNISIAN_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City / Address (Optional)</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="e.g. Ennasr 2, Rue Hedi Nouira..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm & Chat'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
