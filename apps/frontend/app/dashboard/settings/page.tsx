'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Shop, ShopFont, ShopTemplate, ShopHeroStyle, ShopCardStyle, ShopThemeId } from '@busi/types';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import PresetGallery from '@/components/dashboard/settings/PresetGallery';
import ColorCustomizer from '@/components/dashboard/settings/ColorCustomizer';
import TypographyEditor from '@/components/dashboard/settings/TypographyEditor';
import LayoutDesigner from '@/components/dashboard/settings/LayoutDesigner';
import BasicSettings from '@/components/dashboard/settings/BasicSettings';

export default function SettingsPage() {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    primaryColor: string;
    secondaryColor: string;
    font: ShopFont;
    template: ShopTemplate;
    themeId: ShopThemeId | undefined;
    heroStyle: ShopHeroStyle;
    cardStyle: ShopCardStyle;
    whatsappNumber: string;
    instagramUrl: string;
    facebookUrl: string;
    logo: File | null;
  }>({
    name: '',
    primaryColor: '#2563EB',
    secondaryColor: '#F59E0B',
    font: 'inter',
    template: 'minimal',
    themeId: undefined,
    heroStyle: 'big-banner',
    cardStyle: 'rounded',
    whatsappNumber: '',
    instagramUrl: '',
    facebookUrl: '',
    logo: null,
  });

  useEffect(() => {
    fetchShop();
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    if (!shop) return false;
    const normalize = (value?: string | null) => value || '';

    return (
      formData.name !== shop.name ||
      formData.primaryColor !== shop.primaryColor ||
      formData.secondaryColor !== shop.secondaryColor ||
      formData.font !== shop.font ||
      formData.template !== shop.template ||
      formData.heroStyle !== shop.heroStyle ||
      formData.cardStyle !== shop.cardStyle ||
      normalize(formData.themeId) !== normalize(shop.themeId) ||
      normalize(formData.whatsappNumber) !== normalize(shop.whatsappNumber) ||
      normalize(formData.instagramUrl) !== normalize(shop.instagramUrl) ||
      normalize(formData.facebookUrl) !== normalize(shop.facebookUrl) ||
      !!formData.logo
    );
  }, [formData, shop]);

  const resetChanges = () => {
    if (!shop) return;

    setFormData({
      name: shop.name,
      primaryColor: shop.primaryColor,
      secondaryColor: shop.secondaryColor,
      font: shop.font,
      template: shop.template,
      themeId: shop.themeId,
      heroStyle: shop.heroStyle,
      cardStyle: shop.cardStyle,
      whatsappNumber: shop.whatsappNumber || '',
      instagramUrl: shop.instagramUrl || '',
      facebookUrl: shop.facebookUrl || '',
      logo: null,
    });

    toast.info('Reverted to last saved settings');
  };

  const fetchShop = async () => {
    try {
      const response = await fetch('/api/dashboard/shop');
      if (response.ok) {
        const data = await response.json();
        setShop(data);
        setFormData({
          name: data.name,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          font: data.font,
          template: data.template,
          themeId: data.themeId,
          heroStyle: data.heroStyle,
          cardStyle: data.cardStyle,
          whatsappNumber: data.whatsappNumber || '',
          instagramUrl: data.instagramUrl || '',
          facebookUrl: data.facebookUrl || '',
          logo: null,
        });
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();

      const data: any = {
        name: formData.name.trim(),
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        font: formData.font,
        template: formData.template,
        themeId: formData.themeId,
        heroStyle: formData.heroStyle,
        cardStyle: formData.cardStyle,
      };

      if (formData.whatsappNumber) {
        data.whatsappNumber = formData.whatsappNumber.replace(/\s/g, '');
      }
      if (formData.instagramUrl) {
        data.instagramUrl = formData.instagramUrl.trim();
      }
      if (formData.facebookUrl) {
        data.facebookUrl = formData.facebookUrl.trim();
      }

      formDataToSend.append('data', JSON.stringify(data));

      if (formData.logo) {
        formDataToSend.append('files.logo', formData.logo);
      }

      const response = await fetch('/api/dashboard/shop', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success('Settings saved successfully!');
      router.refresh();
      fetchShop();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load shop settings</p>
      </div>
    );
  }

  const shopUrl = `https://${shop.subdomain}.${process.env.NODE_ENV === 'development' ? 'brandini.test:3000' : 'brandili.shop'}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
          <p className="text-gray-500 mt-1">Customize your storefront appearance and details</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Preview Store
          </a>
          <button
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm text-amber-800">You have unsaved changes</span>
          </div>
          <button
            onClick={resetChanges}
            className="text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Discard
          </button>
        </div>
      )}

      {/* Simplified 3-Tab Interface */}
      <Tabs
        tabs={[
          { id: 'general', label: 'General', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
          { id: 'appearance', label: 'Appearance', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> },
          { id: 'layout', label: 'Layout', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg> },
        ]}
        defaultTab="general"
        variant="line"
      >
        {/* TAB 1: General - Basic info + Social */}
        <TabPanel id="general">
          <BasicSettings
            shop={shop}
            formData={formData}
            setFormData={setFormData}
          />
        </TabPanel>

        {/* TAB 2: Appearance - Presets + Colors + Typography combined */}
        <TabPanel id="appearance">
          <div className="space-y-10">
            {/* Quick Presets Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Presets</h3>
              <p className="text-sm text-gray-500 mb-4">Choose a pre-designed theme to get started quickly</p>
              <PresetGallery
                onApplyPreset={(preset) => {
                  setFormData({
                    ...formData,
                    template: preset.template,
                    themeId: preset.themeId as ShopThemeId,
                    heroStyle: preset.heroStyle,
                    cardStyle: preset.cardStyle,
                    primaryColor: preset.primaryColor,
                    secondaryColor: preset.secondaryColor,
                    font: preset.font,
                  });
                }}
                currentPreset={{
                  template: formData.template,
                  primaryColor: formData.primaryColor,
                  secondaryColor: formData.secondaryColor,
                  font: formData.font,
                  themeId: formData.themeId,
                }}
              />
            </div>

            {/* Colors Section */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Brand Colors</h3>
              <p className="text-sm text-gray-500 mb-4">Customize your store's color palette</p>
              <ColorCustomizer
                primaryColor={formData.primaryColor}
                secondaryColor={formData.secondaryColor}
                onChange={(colors) => setFormData({ ...formData, ...colors })}
              />
            </div>

            {/* Typography Section */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Typography</h3>
              <p className="text-sm text-gray-500 mb-4">Choose a font that matches your brand</p>
              <TypographyEditor
                font={formData.font}
                onChange={(font) => setFormData({ ...formData, font })}
              />
            </div>
          </div>
        </TabPanel>

        {/* TAB 3: Layout - Hero + Cards */}
        <TabPanel id="layout">
          <LayoutDesigner
            template={formData.template}
            heroStyle={formData.heroStyle}
            cardStyle={formData.cardStyle}
            theme={{
              name: formData.name,
              primaryColor: formData.primaryColor,
              secondaryColor: formData.secondaryColor,
              font: formData.font,
              template: formData.template,
              heroStyle: formData.heroStyle,
              cardStyle: formData.cardStyle,
            }}
            onChange={(layout) => setFormData({ ...formData, ...layout })}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}

