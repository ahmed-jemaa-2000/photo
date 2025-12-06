'use client';

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import type {
  Shop,
  ShopCardStyle,
  ShopHeroStyle,
  ShopTemplate,
  ShopFont,
} from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';
import { FONT_FAMILIES } from '@/components/shared/ThemeProvider';

type TemplateOption = {
  value: ShopTemplate;
  label: string;
  description: string;
  accent: string;
};

type HeroOption = {
  value: ShopHeroStyle;
  label: string;
  description: string;
};

type CardOption = {
  value: ShopCardStyle;
  label: string;
  description: string;
};

type FontOption = {
  value: ShopFont;
  label: string;
  description: string;
  sample: string;
};

type ThemePreset = {
  name: string;
  description: string;
  badge?: string;
  accent: string;
  values: {
    template: ShopTemplate;
    heroStyle: ShopHeroStyle;
    cardStyle: ShopCardStyle;
    primaryColor: string;
    secondaryColor: string;
    font: ShopFont;
  };
};

const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Modern Minimal',
    description: 'Calm neutrals with a product-first layout.',
    badge: 'Popular',
    accent: 'from-slate-900 via-slate-700 to-slate-500',
    values: {
      template: 'minimal',
      heroStyle: 'big-banner',
      cardStyle: 'rounded',
      primaryColor: '#111827',
      secondaryColor: '#F3F4F6',
      font: 'inter',
    },
  },
  {
    name: 'Boutique Luxe',
    description: 'Elegant gold accents and editorial feel.',
    badge: 'Premium',
    accent: 'from-amber-500 via-rose-400 to-amber-300',
    values: {
      template: 'boutique',
      heroStyle: 'small-hero',
      cardStyle: 'elevated',
      primaryColor: '#B45309',
      secondaryColor: '#FEF3C7',
      font: 'playfair',
    },
  },
  {
    name: 'Playful Kids',
    description: 'Bright gradients and rounded shapes.',
    accent: 'from-sky-400 via-pink-400 to-lime-300',
    values: {
      template: 'kids',
      heroStyle: 'carousel',
      cardStyle: 'rounded',
      primaryColor: '#06B6D4',
      secondaryColor: '#F9A8D4',
      font: 'poppins',
    },
  },
  {
    name: 'Street Bold',
    description: 'High contrast with graphic headlines.',
    accent: 'from-gray-900 via-red-600 to-amber-400',
    values: {
      template: 'street',
      heroStyle: 'big-banner',
      cardStyle: 'square',
      primaryColor: '#111827',
      secondaryColor: '#F97316',
      font: 'montserrat',
    },
  },
];

const TEMPLATES: TemplateOption[] = [
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Clean and simple design',
    accent: 'from-slate-50 via-white to-slate-100',
  },
  {
    value: 'boutique',
    label: 'Boutique',
    description: 'Elegant and curated',
    accent: 'from-amber-50 via-white to-rose-50',
  },
  {
    value: 'kids',
    label: 'Kids',
    description: 'Playful and colorful',
    accent: 'from-sky-50 via-pink-50 to-amber-50',
  },
  {
    value: 'street',
    label: 'Street',
    description: 'Bold and urban',
    accent: 'from-gray-900 via-gray-800 to-gray-700',
  },
];

const HERO_STYLES: HeroOption[] = [
  { value: 'big-banner', label: 'Big Banner', description: 'Large hero with text overlay' },
  { value: 'small-hero', label: 'Small Hero', description: 'Compact header section' },
  { value: 'carousel', label: 'Carousel', description: 'Featured products slider' },
];

const CARD_STYLES: CardOption[] = [
  { value: 'rounded', label: 'Rounded', description: 'Soft rounded corners' },
  { value: 'square', label: 'Square', description: 'Sharp edges' },
  { value: 'elevated', label: 'Elevated', description: 'Card with shadow' },
];

const FONTS: FontOption[] = [
  { value: 'inter', label: 'Inter', description: 'Modern sans-serif', sample: 'Modern retail' },
  { value: 'playfair', label: 'Playfair Display', description: 'Elegant serif', sample: 'Boutique stories' },
  { value: 'montserrat', label: 'Montserrat', description: 'Geometric sans-serif', sample: 'Street market' },
  { value: 'roboto', label: 'Roboto', description: 'Clean and readable', sample: 'Everyday shop' },
  { value: 'poppins', label: 'Poppins', description: 'Friendly and rounded', sample: 'Kids collection' },
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10.5 8 14.5 16 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className="h-5 w-5 rounded-full border border-gray-200 shadow-inner"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function LivePreview({
  template,
  heroStyle,
  cardStyle,
  primaryColor,
  secondaryColor,
}: {
  template: ShopTemplate;
  heroStyle: ShopHeroStyle;
  cardStyle: ShopCardStyle;
  primaryColor: string;
  secondaryColor: string;
}) {
  const heroHeight =
    heroStyle === 'small-hero' ? 'h-16' : heroStyle === 'carousel' ? 'h-20' : 'h-24';
  const cardRadius =
    cardStyle === 'rounded' ? 'rounded-xl' : cardStyle === 'square' ? 'rounded-none' : 'rounded-xl';
  const cardShadow = cardStyle === 'elevated' ? 'shadow-lg border border-gray-200' : 'border border-gray-200';
  const surface =
    template === 'street'
      ? 'bg-gray-950 border-gray-800 text-white'
      : 'bg-white border-gray-100 text-gray-900';
  const mutedText = template === 'street' ? 'text-gray-300' : 'text-gray-500';
  const accentChip =
    template === 'street' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700';

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="font-semibold text-gray-800">Live preview</div>
        <div className="flex items-center gap-3">
          <ColorSwatch label="Primary" color={primaryColor} />
          <ColorSwatch label="Secondary" color={secondaryColor} />
        </div>
      </div>
      <div className={`mt-3 overflow-hidden rounded-lg border ${surface}`}>
        <div
          className={`relative ${heroHeight} flex items-center justify-between px-4`}
          style={{ background: `linear-gradient(120deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="space-y-1 text-left">
            <div className="text-[11px] uppercase tracking-[0.2em] opacity-80">
              {heroStyle === 'carousel' ? 'Showcase carousel' : 'Hero banner'}
            </div>
            <div className="text-base font-semibold">Headline example</div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`h-2 w-2 rounded-full bg-white ${
                  heroStyle === 'carousel' ? 'opacity-90' : 'opacity-50'
                } ${dot === 2 ? '' : 'hidden sm:inline-block'}`}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, #fff 0, transparent 30%), radial-gradient(circle at 80% 10%, #fff 0, transparent 25%)',
            }}
          />
        </div>
        <div className={`grid grid-cols-3 gap-2 p-3 ${template === 'street' ? 'bg-gray-950' : 'bg-white'}`}>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`relative ${cardRadius} ${cardShadow} ${
                template === 'street' ? 'bg-gray-900/70 border-gray-800' : 'bg-white'
              }`}
            >
              <div
                className="h-12 rounded-t-lg"
                style={{
                  background: `linear-gradient(120deg, ${secondaryColor}, ${primaryColor})`,
                  opacity: 0.9,
                }}
              />
              <div className="space-y-1 p-2">
                <div className={`h-2 rounded ${template === 'street' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className={`h-2 w-2/3 rounded ${template === 'street' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span
                    className="font-semibold"
                    style={{ color: template === 'street' ? '#f8fafc' : primaryColor }}
                  >
                    29.000
                  </span>
                  <span className={`rounded-full px-2 py-0.5 ${accentChip}`}>
                    {cardStyle}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={`border-t px-4 py-2 text-xs ${mutedText}`}>
          Template: {template} • Hero: {heroStyle} • Cards: {cardStyle}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  option,
  selected,
  onSelect,
  primaryColor,
  secondaryColor,
}: {
  option: TemplateOption;
  selected: boolean;
  onSelect: () => void;
  primaryColor: string;
  secondaryColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full rounded-xl border-2 p-4 text-left transition ${
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-gray-200 hover:border-primary/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">{option.label}</div>
          <p className="text-xs text-gray-500">{option.description}</p>
        </div>
        {selected ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm">
            <CheckIcon />
          </span>
        ) : (
          <span className="text-[11px] rounded-full bg-gray-100 px-2 py-1 text-gray-600">
            Preview
          </span>
        )}
      </div>
      <div className={`relative mt-4 flex h-20 items-center gap-2 overflow-hidden rounded-lg border bg-gradient-to-br ${option.accent} px-3`}>
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `linear-gradient(120deg, ${primaryColor}, ${secondaryColor})` }}
        />
        <div className="relative flex-1 space-y-1 rounded-md bg-white/80 p-2 shadow-sm backdrop-blur">
          <div className="h-2 w-3/5 rounded bg-gray-200" />
          <div className="h-2 w-2/5 rounded bg-gray-200" />
          <div className="flex items-center gap-1">
            <span className="h-6 w-6 rounded-full bg-gray-100" />
            <span className="h-6 w-10 rounded-md bg-gray-100" />
          </div>
        </div>
        <div className="relative h-full w-20 rounded-md border border-white/60 bg-white/70 backdrop-blur">
          <div
            className="h-10 rounded-t-md"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          />
          <div className="p-2 text-[11px] text-gray-600">
            <div className="h-2 rounded bg-gray-200" />
            <div className="mt-1 h-2 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </button>
  );
}

function StyleOptionCard({
  title,
  description,
  selected,
  onSelect,
  children,
}: {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border-2 p-4 text-left transition ${
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-gray-200 hover:border-primary/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {selected && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm">
            <CheckIcon />
          </span>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </button>
  );
}

function FontCard({
  option,
  selected,
  onSelect,
}: {
  option: FontOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border-2 p-4 text-left transition ${
        selected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-gray-200 hover:border-primary/40'
      }`}
      style={{ fontFamily: FONT_FAMILIES[option.value] }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">{option.label}</div>
          <p className="text-xs text-gray-500">{option.description}</p>
        </div>
        {selected && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm">
            <CheckIcon />
          </span>
        )}
      </div>
      <p className="mt-3 text-base font-semibold text-gray-800">{option.sample}</p>
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Aa Bb Cc</p>
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [font, setFont] = useState<ShopFont>('inter');
  const [template, setTemplate] = useState<ShopTemplate>('minimal');
  const [heroStyle, setHeroStyle] = useState<ShopHeroStyle>('big-banner');
  const [cardStyle, setCardStyle] = useState<ShopCardStyle>('rounded');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  // Logo handling
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const response = await fetch('/api/dashboard/shop');
      if (response.ok) {
        const data = await response.json();
        setShop(data);
        populateForm(data);
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (shopData: Shop) => {
    setName(shopData.name);
    setPrimaryColor(shopData.primaryColor);
    setSecondaryColor(shopData.secondaryColor);
    setFont(shopData.font);
    setTemplate(shopData.template);
    setHeroStyle(shopData.heroStyle);
    setCardStyle(shopData.cardStyle);
    setWhatsappNumber(shopData.whatsappNumber || '');
    setInstagramUrl(shopData.instagramUrl || '');
    setFacebookUrl(shopData.facebookUrl || '');

    if (shopData.logo) {
      setCurrentLogo(getStrapiMediaUrl(shopData.logo.url));
    }
  };

  const applyPreset = (preset: ThemePreset) => {
    setTemplate(preset.values.template);
    setHeroStyle(preset.values.heroStyle);
    setCardStyle(preset.values.cardStyle);
    setPrimaryColor(preset.values.primaryColor);
    setSecondaryColor(preset.values.secondaryColor);
    setFont(preset.values.font);
    toast.success(`${preset.name} applied`);
  };

  const handleLogoSelect = (e: ChangeEvent<HTMLInputElement>) => {
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

      setNewLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setNewLogo(null);
    setLogoPreview(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error('Shop name is required');
      return false;
    }

    if (whatsappNumber && !/^[+]?[0-9]{8,15}$/.test(whatsappNumber.replace(/\s/g, ''))) {
      toast.error('Invalid WhatsApp number format');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      const data: any = {
        name: name.trim(),
        primaryColor,
        secondaryColor,
        font,
        template,
        heroStyle,
        cardStyle,
      };

      if (whatsappNumber) {
        data.whatsappNumber = whatsappNumber.replace(/\s/g, '');
      }
      if (instagramUrl) {
        data.instagramUrl = instagramUrl.trim();
      }
      if (facebookUrl) {
        data.facebookUrl = facebookUrl.trim();
      }

      formData.append('data', JSON.stringify(data));

      if (newLogo) {
        formData.append('files.logo', newLogo);
      }

      const response = await fetch('/api/dashboard/shop', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success('Settings saved successfully!');
      router.refresh();
      fetchShop();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
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

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shop Settings</h1>
        <p className="mt-1 text-gray-600">Customize your storefront appearance and information.</p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4 rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Basic Information</h3>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Shop Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Shop Logo</label>
          <div className="flex items-center space-x-4">
            {(logoPreview || currentLogo) && (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                <Image
                  src={logoPreview || currentLogo || ''}
                  alt="Shop logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
              >
                {currentLogo || logoPreview ? 'Change Logo' : 'Upload Logo'}
              </button>
              {(logoPreview || currentLogo) && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="ml-2 rounded-lg px-4 py-2 text-red-600 transition hover:bg-red-50"
                >
                  Remove
                </button>
              )}
              <p className="mt-1 text-sm text-gray-500">Recommended: 200x200px, max 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Subdomain
          </label>
          <input
            type="text"
            value={shop.subdomain}
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-600"
          />
          <p className="mt-1 text-sm text-gray-500">
            Your storefront: https://{shop.subdomain}.
            {process.env.NODE_ENV === 'development' ? 'brandini.test:3000' : 'brandini.tn'}
          </p>
        </div>
      </div>

      {/* Theme Customization */}
      <div className="space-y-6 rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Theme & Appearance</h3>
            <p className="text-sm text-gray-600">
              Choose a ready-made look or fine-tune colors, layout, and typography. No code needed.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Client-friendly setup
          </div>
        </div>

        <LivePreview
          template={template}
          heroStyle={heroStyle}
          cardStyle={cardStyle}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />

        <div className="space-y-3 rounded-lg border border-dashed border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">Ready-made looks</div>
            <span className="text-xs text-gray-500">Apply a preset to auto-fill styles</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="relative flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-primary/50 hover:shadow-sm"
              >
                <div className={`h-14 w-16 rounded-lg bg-gradient-to-br ${preset.accent} shadow-sm`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{preset.name}</span>
                    {preset.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{preset.description}</p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {preset.values.template} • {preset.values.heroStyle} • {preset.values.cardStyle}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-primary">Apply</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-800">Primary Color</label>
              <ColorSwatch label="Live" color={primaryColor} />
            </div>
            <p className="text-xs text-gray-500">
              Used for buttons, highlights, and key actions.
            </p>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-16 w-16 cursor-pointer rounded-lg border-2 border-gray-200"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-800">Secondary Color</label>
              <ColorSwatch label="Live" color={secondaryColor} />
            </div>
            <p className="text-xs text-gray-500">
              Used for backgrounds, badges, and supporting areas.
            </p>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-16 w-16 cursor-pointer rounded-lg border-2 border-gray-200"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-800">Template Style</label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {TEMPLATES.map((t) => (
              <TemplateCard
                key={t.value}
                option={t}
                selected={template === t.value}
                onSelect={() => setTemplate(t.value)}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {HERO_STYLES.map((h) => (
            <StyleOptionCard
              key={h.value}
              title={h.label}
              description={h.description}
              selected={heroStyle === h.value}
              onSelect={() => setHeroStyle(h.value)}
            >
              <div className="flex h-16 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                {h.value === 'carousel' ? (
                  <div className="grid h-full flex-1 grid-cols-3 gap-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-md bg-gradient-to-br from-gray-200 to-white shadow-inner"
                        style={{ background: `linear-gradient(120deg, ${secondaryColor}, ${primaryColor})` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="h-full flex-1 rounded-lg"
                    style={{ background: `linear-gradient(120deg, ${primaryColor}, ${secondaryColor})` }}
                  />
                )}
                <div className="flex h-full w-20 flex-col justify-center gap-2">
                  <span className="h-2 rounded bg-gray-200" />
                  <span className="h-2 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            </StyleOptionCard>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {CARD_STYLES.map((c) => (
            <StyleOptionCard
              key={c.value}
              title={c.label}
              description={c.description}
              selected={cardStyle === c.value}
              onSelect={() => setCardStyle(c.value)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-20 flex-1 border bg-white p-2 shadow-sm ${
                    c.value === 'rounded'
                      ? 'rounded-2xl'
                      : c.value === 'square'
                      ? 'rounded-none'
                      : 'rounded-xl shadow-lg'
                  }`}
                >
                  <div
                    className="h-10 rounded-md"
                    style={{ background: `linear-gradient(120deg, ${primaryColor}, ${secondaryColor})` }}
                  />
                  <div className="mt-2 h-2 rounded bg-gray-200" />
                  <div className="mt-1 h-2 w-2/3 rounded bg-gray-200" />
                </div>
                <div className="w-12 text-[11px] text-gray-500">Preview</div>
              </div>
            </StyleOptionCard>
          ))}
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-800">Typography</label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {FONTS.map((f) => (
              <FontCard
                key={f.value}
                option={f}
                selected={font === f.value}
                onSelect={() => setFont(f.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="space-y-4 rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Contact & Social Links</h3>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            WhatsApp Number
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+216 XX XXX XXX"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-sm text-gray-500">
            Used for "Order via WhatsApp" button
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Instagram URL
          </label>
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="https://instagram.com/yourshop"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Facebook URL
          </label>
          <input
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            placeholder="https://facebook.com/yourshop"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4 border-t pt-4">
        <button
          type="button"
          onClick={() => populateForm(shop)}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Settings</span>
          )}
        </button>
      </div>
    </form>
  );
}
