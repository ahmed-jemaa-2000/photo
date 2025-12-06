'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { Shop } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';
import { toast } from 'sonner';
import { Store, Upload, Trash2, Link2, MessageCircle, Instagram, Facebook, Copy, ExternalLink, Info, Camera } from 'lucide-react';

interface BasicSettingsProps {
  shop: Shop;
  formData: {
    name: string;
    whatsappNumber: string;
    instagramUrl: string;
    facebookUrl: string;
    logo: File | null;
  };
  setFormData: (data: any) => void;
}

export default function BasicSettings({ shop, formData, setFormData }: BasicSettingsProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoPreviewUrl = formData.logo
    ? URL.createObjectURL(formData.logo)
    : shop.logo
      ? getStrapiMediaUrl(shop.logo.url)
      : null;

  const shopUrl = `https://${shop.subdomain}.${process.env.NODE_ENV === 'development' ? 'brandini.test:3000' : 'brandini.tn'}`;

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo must be less than 5MB');
        return;
      }
      setFormData({ ...formData, logo: file });
      toast.success('Logo uploaded! Click Save to apply.');
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: null });
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shopUrl);
    toast.success('URL copied to clipboard');
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          Basic Information
        </h2>
        <p className="text-gray-600 mt-2">
          Configure your shop's identity and how customers can reach you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Shop Name */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <label htmlFor="shop-name" className="block text-sm font-bold text-gray-900 mb-3">
              Shop Name
            </label>
            <input
              id="shop-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              placeholder="My Amazing Store"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Displayed in your store header and browser tab
            </p>
          </div>

          {/* Store URL */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">Your Store URL</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-lg font-mono text-white mb-4 truncate">{shopUrl}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyUrl}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy URL
              </button>
              <button
                type="button"
                onClick={() => window.open(shopUrl, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Store
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Social & Contact Links
            </h3>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <input
                  id="whatsapp"
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+216 XX XXX XXX"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Used for "Order via WhatsApp" button
              </p>
            </div>

            {/* Instagram */}
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <input
                  id="instagram"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourshop"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Facebook */}
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <input
                  id="facebook"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/yourshop"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Logo */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Shop Logo
            </h3>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoSelect}
              className="hidden"
            />

            {/* Logo Preview */}
            <div
              onClick={() => logoInputRef.current?.click()}
              className={`
                relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all
                ${logoPreviewUrl
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
                }
              `}
            >
              {logoPreviewUrl ? (
                <div className="relative aspect-square p-8">
                  <Image
                    src={logoPreviewUrl}
                    alt="Shop logo"
                    fill
                    className="object-contain p-4"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Change Logo</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Upload your logo</p>
                  <p className="text-xs text-gray-500">PNG, JPG, or SVG up to 5MB</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {logoPreviewUrl && (
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Logo Tips</p>
                  <ul className="space-y-0.5 text-blue-700">
                    <li>• Square format works best (e.g., 200×200px)</li>
                    <li>• Use PNG/SVG for transparent backgrounds</li>
                    <li>• Simple logos look better on mobile</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
