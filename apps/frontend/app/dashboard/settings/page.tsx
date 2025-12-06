'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Shop } from '@busi/types';
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
  const [formData, setFormData] = useState({
    name: '',
    primaryColor: '#2563EB',
    secondaryColor: '#F59E0B',
    font: 'inter' as const,
    template: 'minimal' as const,
    themeId: undefined as string | undefined,
    heroStyle: 'big-banner' as const,
    cardStyle: 'rounded' as const,
    whatsappNumber: '',
    instagramUrl: '',
    facebookUrl: '',
    logo: null as File | null,
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

  const shopUrl = `https://${shop.subdomain}.${process.env.NODE_ENV === 'development' ? 'brandini.test:3000' : 'brandini.tn'}`;

  const tabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'presets',
      label: 'Presets',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'colors',
      label: 'Colors',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'typography',
      label: 'Typography',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      ),
    },
    {
      id: 'layout',
      label: 'Layout',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl space-y-8">
      {/* Hero / Context header */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-800 p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -left-10 top-4 h-52 w-52 rounded-full bg-indigo-500/40 blur-3xl" />
          <div className="absolute bottom-0 right-4 h-40 w-40 rounded-full bg-emerald-400/40 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-100">Experience studio</p>
            <h1 className="text-4xl font-bold tracking-tight">Shop Settings</h1>
            <p className="text-lg text-indigo-100/90">
              Tune your storefront’s personality, from basic details to full theme presets, in one focused workspace.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 shadow-sm ring-1 ring-white/10">
                Guided customizations
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 shadow-sm ring-1 ring-white/10">
                Live storefront ready
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 shadow-sm ring-1 ring-white/10">
                Theme-aware presets
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.open(shopUrl, '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20 transition hover:bg-white/25"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 3h7m0 0v7m0-7L10 14m-1 7H5a2 2 0 01-2-2v-4m0 0l7-7m-7 7h4" />
                </svg>
                Preview storefront
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shopUrl);
                  toast.success('Storefront URL copied');
                }}
                className="flex items-center gap-2 rounded-xl bg-white text-sm font-semibold text-gray-900 px-4 py-2.5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy URL
              </button>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-indigo-50 shadow-inner ring-1 ring-white/20">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-300" />
                <span className="font-semibold">Ready to publish</span>
              </div>
              <p className="mt-1 text-indigo-100/80">Keep your details and design aligned—everything here syncs with your live store.</p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-indigo-100/80">Domain</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{shopUrl}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold text-emerald-100 ring-1 ring-emerald-200/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Online
            </span>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-indigo-100/80">Template</p>
            <p className="mt-1 text-lg font-semibold capitalize text-white">{formData.template.replace('-', ' ')}</p>
            <p className="text-xs text-indigo-100/70">Hero: {formData.heroStyle.replace('-', ' ')} · Cards: {formData.cardStyle}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-indigo-100/80">Brand colors</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl shadow-inner ring-1 ring-white/40" style={{ backgroundColor: formData.primaryColor }}>
                <span className="text-[11px] font-semibold text-white drop-shadow">P</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl shadow-inner ring-1 ring-white/40" style={{ backgroundColor: formData.secondaryColor }}>
                <span className="text-[11px] font-semibold text-gray-900 drop-shadow">S</span>
              </span>
              <div className="text-[11px] text-indigo-100/80">
                <div className="font-semibold text-white">Primary / Secondary</div>
                <div className="flex flex-col opacity-80">
                  <span>{formData.primaryColor}</span>
                  <span>{formData.secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-indigo-100/80">Preset</p>
            <p className="mt-1 text-lg font-semibold text-white">{formData.themeId ? 'Theme linked' : 'Custom mix'}</p>
            <p className="text-xs text-indigo-100/70">
              {formData.themeId ? 'Preset applied—fine tune below' : 'Build your own palette & layout'}
            </p>
          </div>
        </div>
      </div>

      {/* Save bar */}
      <div className="sticky top-4 z-20">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {hasUnsavedChanges ? 'You have unsaved changes' : 'Everything looks synced'}
              </p>
              <p className="text-sm text-gray-600">
                Save now to publish updates across your live storefront.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saving || !hasUnsavedChanges}
              onClick={resetChanges}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset to live
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs tabs={tabs} defaultTab="basic" variant="line">
        <TabPanel id="basic">
          <BasicSettings
            shop={shop}
            formData={formData}
            setFormData={setFormData}
          />
        </TabPanel>

        <TabPanel id="presets">
          <PresetGallery
            onApplyPreset={(preset) => {
              setFormData({
                ...formData,
                template: preset.template,
                themeId: preset.themeId,
                heroStyle: preset.heroStyle,
                cardStyle: preset.cardStyle,
                primaryColor: preset.primaryColor,
                secondaryColor: preset.secondaryColor,
                font: preset.font,
              });
              // Note: The actual save happens when user clicks "Save Changes"
            }}
            currentPreset={{
              template: formData.template,
              primaryColor: formData.primaryColor,
              secondaryColor: formData.secondaryColor,
              font: formData.font,
              themeId: formData.themeId,
            }}
          />
        </TabPanel>

        <TabPanel id="colors">
          <ColorCustomizer
            primaryColor={formData.primaryColor}
            secondaryColor={formData.secondaryColor}
            onChange={(colors) => {
              setFormData({ ...formData, ...colors });
            }}
          />
        </TabPanel>

        <TabPanel id="typography">
          <TypographyEditor
            font={formData.font}
            onChange={(font) => setFormData({ ...formData, font })}
          />
        </TabPanel>

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
