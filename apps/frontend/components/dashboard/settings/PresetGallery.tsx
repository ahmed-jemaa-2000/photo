'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { THEME_PRESETS, searchPresets, type ThemePreset } from '@/lib/constants/presets';
import PresetPreviewModal from './PresetPreviewModal';
import { Search, Sparkles, Check, Eye, Palette, Star, Gem, Zap, X } from 'lucide-react';

interface PresetGalleryProps {
  onApplyPreset: (preset: ThemePreset['values'] & { name: string; themeId: string }) => void;
  currentPreset?: {
    template: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    themeId?: string;
  };
}

type FilterStyle = 'all' | 'minimal' | 'bold' | 'elegant' | 'playful';

const STYLE_OPTIONS: { id: FilterStyle; label: string; description: string }[] = [
  { id: 'all', label: 'All Styles', description: 'Show all themes' },
  { id: 'minimal', label: 'Minimal', description: 'Clean & simple' },
  { id: 'bold', label: 'Bold', description: 'Strong & striking' },
  { id: 'elegant', label: 'Elegant', description: 'Refined & sophisticated' },
];

export default function PresetGallery({ onApplyPreset, currentPreset }: PresetGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState<FilterStyle>('all');
  const [previewPreset, setPreviewPreset] = useState<ThemePreset | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredPresets = useMemo(() => {
    let results = [...THEME_PRESETS];

    if (searchQuery) {
      results = searchPresets(searchQuery);
    }

    if (styleFilter !== 'all') {
      results = results.filter((preset) => preset.style === styleFilter);
    }

    // Sort: popular first, then premium, then new
    results.sort((a, b) => {
      const order = { popular: 0, premium: 1, new: 2 };
      const aOrder = a.badge ? order[a.badge as keyof typeof order] ?? 3 : 3;
      const bOrder = b.badge ? order[b.badge as keyof typeof order] ?? 3 : 3;
      return aOrder - bOrder;
    });

    return results;
  }, [searchQuery, styleFilter]);

  const isPresetSelected = (preset: ThemePreset) => {
    if (!currentPreset) return false;
    if (currentPreset.themeId) {
      return preset.themeId === currentPreset.themeId;
    }
    return (
      preset.values.template === currentPreset.template &&
      preset.values.primaryColor === currentPreset.primaryColor
    );
  };

  const handleApplyPreset = (preset: ThemePreset) => {
    onApplyPreset({ ...preset.values, name: preset.name, themeId: preset.themeId });
    toast.success(`${preset.name} theme applied!`, {
      description: 'Click "Save changes" to publish to your live store.',
      duration: 4000,
    });
  };

  const getBadgeConfig = (badge?: string) => {
    switch (badge) {
      case 'popular':
        return { icon: Star, color: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'Popular' };
      case 'premium':
        return { icon: Gem, color: 'bg-gradient-to-r from-purple-500 to-indigo-600', text: 'Premium' };
      case 'new':
        return { icon: Zap, color: 'bg-gradient-to-r from-green-400 to-emerald-500', text: 'New' };
      default:
        return null;
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'fashion': return '👗';
      case 'beauty': return '💄';
      case 'electronics': return '📱';
      case 'food': return '🍔';
      case 'handmade': return '✋';
      default: return '🏪';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/30 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold text-purple-200">{THEME_PRESETS.length} Premium Themes</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Choose Your Perfect Theme</h2>
          <p className="text-purple-100 max-w-xl">
            Professional themes designed by experts. Pick one, customize it, and make it yours.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Style Filter */}
        <div className="flex gap-2 flex-wrap">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.id}
              onClick={() => setStyleFilter(style.id)}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${styleFilter === style.id
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredPresets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPresets.map((preset, index) => {
              const isSelected = isPresetSelected(preset);
              const isHovered = hoveredId === preset.id;
              const badgeConfig = getBadgeConfig(preset.badge);

              return (
                <motion.div
                  key={preset.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredId(preset.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`
                    group relative bg-white rounded-2xl overflow-hidden transition-all duration-300
                    ${isSelected
                      ? 'ring-2 ring-primary shadow-xl shadow-primary/10'
                      : 'border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
                    }
                  `}
                >
                  {/* Preview Area */}
                  <div className="relative h-52 overflow-hidden">
                    {/* Gradient Background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${preset.values.primaryColor} 0%, ${preset.values.secondaryColor} 100%)`,
                      }}
                    />

                    {/* Mini Store Preview */}
                    <div className="absolute inset-4 bg-white rounded-xl shadow-2xl overflow-hidden">
                      {/* Browser Chrome */}
                      <div className="h-7 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        <div className="flex-1 mx-3">
                          <div className="h-4 bg-gray-200 rounded-md max-w-[120px] mx-auto" />
                        </div>
                      </div>

                      {/* Scrollable Content Preview */}
                      <div className="p-2 space-y-2">
                        {/* Mini Hero */}
                        <div
                          className="h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
                          style={{ backgroundColor: preset.values.primaryColor }}
                        >
                          <div className="absolute inset-0 bg-black/10" />
                          <span className="text-white text-[10px] font-medium opacity-80">HERO</span>
                        </div>

                        {/* Mini Products Grid */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-1">
                              <div className="aspect-square bg-gray-100 rounded-md" />
                              <div className="h-1.5 bg-gray-200 rounded-full w-3/4" />
                              <div className="h-1.5 rounded-full w-1/2" style={{ backgroundColor: preset.values.primaryColor + '40' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    {badgeConfig && (
                      <div className={`absolute top-2 left-2 ${badgeConfig.color} text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg`}>
                        <badgeConfig.icon className="w-3.5 h-3.5" />
                        {badgeConfig.text}
                      </div>
                    )}

                    {/* Selected Check */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <motion.div
                      initial={false}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6 gap-3"
                    >
                      <button
                        onClick={() => setPreviewPreset(preset)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-gray-900 text-sm font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleApplyPreset(preset)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-xl text-white text-sm font-semibold shadow-lg hover:bg-primary/90 hover:scale-105 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        Apply Theme
                      </button>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{preset.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <span>{getCategoryEmoji(preset.category)}</span>
                          <span className="capitalize">{preset.category}</span>
                          <span className="text-gray-300">•</span>
                          <span className="capitalize">{preset.style}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <div
                          className="w-6 h-6 rounded-lg border-2 border-white shadow-md"
                          style={{ backgroundColor: preset.values.primaryColor }}
                        />
                        <div
                          className="w-6 h-6 rounded-lg border-2 border-white shadow-md -ml-2"
                          style={{ backgroundColor: preset.values.secondaryColor }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {preset.description}
                    </p>

                    {/* Key Changes */}
                    {preset.changes && preset.changes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {preset.changes.slice(0, 3).map((change, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100"
                          >
                            <Palette className="w-3 h-3 text-gray-400" />
                            {change}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No themes found</h3>
          <p className="text-gray-500 mb-6">Try a different search term or filter</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStyleFilter('all');
            }}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Show All Themes
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Fully Customizable</h4>
              <p className="text-sm text-gray-600">
                Every theme is just a starting point. Adjust colors, fonts, and layout in the other tabs.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Preview Before Publishing</h4>
              <p className="text-sm text-gray-600">
                Your changes won't go live until you click "Save changes" at the top.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PresetPreviewModal
        preset={previewPreset}
        isOpen={!!previewPreset}
        onClose={() => setPreviewPreset(null)}
        onApply={() => {
          if (previewPreset) {
            handleApplyPreset(previewPreset);
            setPreviewPreset(null);
          }
        }}
      />
    </div>
  );
}
