import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image,
    Palette,
    Target,
    Type,
    Upload,
    ChevronDown,
    ChevronUp,
    Info,
    Sparkles,
    CheckCircle2,
    Monitor,
    Smartphone,
    Square,
    HelpCircle
} from 'lucide-react';

/**
 * Ad Creative Configuration Component
 * Configures brand style, output format, mood, and text options
 */

// ============================================
// STATIC CONFIGURATIONS (fallbacks)
// ============================================

const DEFAULT_CATEGORIES = [
    { id: 'supplements', name: { en: 'Supplements' }, icon: '💪' },
    { id: 'cosmetics', name: { en: 'Cosmetics' }, icon: '💄' },
    { id: 'food_beverage', name: { en: 'Food & Beverages' }, icon: '🍕' },
    { id: 'electronics', name: { en: 'Electronics' }, icon: '📱' },
    { id: 'fashion', name: { en: 'Fashion' }, icon: '👗' },
    { id: 'home_decor', name: { en: 'Home & Decor' }, icon: '🏠' },
    { id: 'services', name: { en: 'Services & Apps' }, icon: '📲' },
    { id: 'other', name: { en: 'Other' }, icon: '📦' }
];

const DEFAULT_FORMATS = [
    { id: 'website_hero', name: { en: 'Website Hero' }, icon: '🖥️', aspectRatio: '16:9' },
    { id: 'facebook_feed', name: { en: 'Social Feed' }, icon: '📱', aspectRatio: '1:1' },
    { id: 'instagram_story', name: { en: 'Story/Reels' }, icon: '📲', aspectRatio: '9:16' }
];

const DEFAULT_STYLES = [
    { id: 'premium_minimal', name: { en: 'Premium Minimal' }, preview: '⬜' },
    { id: 'bold_energetic', name: { en: 'Bold & Energetic' }, preview: '🔴' },
    { id: 'organic_natural', name: { en: 'Organic Natural' }, preview: '🌿' },
    { id: 'tech_modern', name: { en: 'Tech Modern' }, preview: '💜' },
    { id: 'playful_colorful', name: { en: 'Playful Colorful' }, preview: '🌈' },
    { id: 'professional_trust', name: { en: 'Professional Trust' }, preview: '🔵' },
    { id: 'luxury_dark', name: { en: 'Luxury Dark' }, preview: '⬛' },
    { id: 'warm_lifestyle', name: { en: 'Warm Lifestyle' }, preview: '🧡' }
];

const DEFAULT_MOODS = [
    { id: 'energizing', name: { en: 'Energizing' }, icon: '⚡' },
    { id: 'calming', name: { en: 'Calming' }, icon: '🌊' },
    { id: 'luxurious', name: { en: 'Luxurious' }, icon: '👑' },
    { id: 'fresh_clean', name: { en: 'Fresh & Clean' }, icon: '✨' },
    { id: 'edgy_bold', name: { en: 'Edgy Bold' }, icon: '🔥' },
    { id: 'warm_cozy', name: { en: 'Warm & Cozy' }, icon: '🕯️' }
];

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Section Header with collapsible support
 */
const SectionHeader = ({ icon: Icon, title, subtitle, isOpen, onToggle, optional }) => (
    <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    {title}
                    {optional && (
                        <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                    )}
                </h3>
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
            </div>
        </div>
        {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
    </button>
);

/**
 * Option Card for selections
 */
const OptionCard = ({ selected, onClick, icon, title, subtitle, badge }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
      relative p-4 rounded-xl border-2 text-left transition-all
      ${selected
                ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 border-white/10 hover:border-primary/50'
            }
    `}
    >
        <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="font-medium text-white">{title}</p>
                {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
        </div>
        {badge && (
            <span className="absolute top-2 right-2 px-2 py-0.5 text-xs bg-primary/30 text-primary-light rounded-full">
                {badge}
            </span>
        )}
        {selected && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
            >
                <CheckCircle2 className="w-5 h-5 text-primary" />
            </motion.div>
        )}
    </motion.button>
);

/**
 * Color Picker Input
 */
const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400 w-24">{label}</label>
        <div className="flex items-center gap-2 flex-1">
            <input
                type="color"
                value={value || '#6366f1'}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#6366f1"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary focus:outline-none"
            />
        </div>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const AdCreativeMode = ({
    config = {},
    onConfigChange,
    className = ''
}) => {
    // Get presets from config or use defaults
    const categories = config.adCreativePresets?.categories || DEFAULT_CATEGORIES;
    const formats = config.adCreativePresets?.formats || DEFAULT_FORMATS;
    const styles = config.adCreativePresets?.styles || DEFAULT_STYLES;
    const moods = config.adCreativePresets?.moods || DEFAULT_MOODS;

    // Local state for configuration
    const [productCategory, setProductCategory] = useState('other');
    const [outputFormat, setOutputFormat] = useState('facebook_feed');
    const [brandStyle, setBrandStyle] = useState('premium_minimal');
    const [mood, setMood] = useState('fresh_clean');
    const [brandColors, setBrandColors] = useState({ primary: '', secondary: '' });
    const [targetAudience, setTargetAudience] = useState('');
    const [embedText, setEmbedText] = useState(false);
    const [textContent, setTextContent] = useState({
        headline: '',
        subheadline: '',
        offer: '',
        cta: ''
    });
    const [customInstructions, setCustomInstructions] = useState('');

    // Section toggle states
    const [openSections, setOpenSections] = useState({
        category: true,
        format: true,
        style: true,
        colors: false,
        text: false,
        advanced: false
    });

    // Update parent whenever config changes
    useEffect(() => {
        onConfigChange?.({
            productCategory,
            outputFormat,
            brandStyle,
            mood,
            brandColors: brandColors.primary ? brandColors : null,
            targetAudience: targetAudience || null,
            embedText,
            textContent: embedText ? textContent : null,
            customInstructions: customInstructions || null
        });
    }, [productCategory, outputFormat, brandStyle, mood, brandColors, targetAudience, embedText, textContent, customInstructions]);

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Configure Your <span className="text-gradient">Ad Creative</span>
                </h2>
                <p className="text-slate-400">
                    Customize the style and format for your marketing visual
                </p>
            </div>

            {/* Product Category Section */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Target}
                    title="Product Category"
                    subtitle="What type of product is this?"
                    isOpen={openSections.category}
                    onToggle={() => toggleSection('category')}
                />
                <AnimatePresence>
                    {openSections.category && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1">
                                {categories.map((cat) => (
                                    <OptionCard
                                        key={cat.id}
                                        selected={productCategory === cat.id}
                                        onClick={() => setProductCategory(cat.id)}
                                        icon={cat.icon}
                                        title={cat.name?.en || cat.name}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Output Format Section */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Monitor}
                    title="Output Format"
                    subtitle="Where will this be used?"
                    isOpen={openSections.format}
                    onToggle={() => toggleSection('format')}
                />
                <AnimatePresence>
                    {openSections.format && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-3 gap-3 p-1">
                                {formats.map((fmt) => (
                                    <OptionCard
                                        key={fmt.id}
                                        selected={outputFormat === fmt.id}
                                        onClick={() => setOutputFormat(fmt.id)}
                                        icon={fmt.icon}
                                        title={fmt.name?.en || fmt.name}
                                        subtitle={fmt.aspectRatio}
                                        badge={fmt.id === 'facebook_feed' ? 'Popular' : null}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Brand Style Section */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Palette}
                    title="Brand Style"
                    subtitle="Visual aesthetic for your creative"
                    isOpen={openSections.style}
                    onToggle={() => toggleSection('style')}
                />
                <AnimatePresence>
                    {openSections.style && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1">
                                {styles.map((style) => (
                                    <OptionCard
                                        key={style.id}
                                        selected={brandStyle === style.id}
                                        onClick={() => setBrandStyle(style.id)}
                                        icon={style.preview}
                                        title={style.name?.en || style.name}
                                    />
                                ))}
                            </div>

                            {/* Mood Selection (sub-option) */}
                            <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                <p className="text-sm text-slate-400 mb-3">Mood & Atmosphere</p>
                                <div className="flex flex-wrap gap-2">
                                    {moods.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMood(m.id)}
                                            className={`
                        px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all
                        ${mood === m.id
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                                }
                      `}
                                        >
                                            <span>{m.icon}</span>
                                            {m.name?.en || m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Brand Colors Section (Optional) */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Palette}
                    title="Brand Colors"
                    subtitle="Add your brand colors as accents"
                    isOpen={openSections.colors}
                    onToggle={() => toggleSection('colors')}
                    optional
                />
                <AnimatePresence>
                    {openSections.colors && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3 p-4 bg-white/5 rounded-xl">
                                <ColorPicker
                                    label="Primary"
                                    value={brandColors.primary}
                                    onChange={(v) => setBrandColors(prev => ({ ...prev, primary: v }))}
                                />
                                <ColorPicker
                                    label="Secondary"
                                    value={brandColors.secondary}
                                    onChange={(v) => setBrandColors(prev => ({ ...prev, secondary: v }))}
                                />
                                <div className="flex items-start gap-2 mt-2">
                                    <Info className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <p className="text-xs text-slate-400">
                                        Colors will be used as subtle accents in the background, not on the product itself.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Text Content Section (Optional) */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Type}
                    title="Text in Image"
                    subtitle="Add text directly to the image (not recommended)"
                    isOpen={openSections.text}
                    onToggle={() => toggleSection('text')}
                    optional
                />
                <AnimatePresence>
                    {openSections.text && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                                {/* Toggle for embedding text */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${embedText ? 'bg-primary' : 'bg-white/20'}
                  `}>
                                        <div className={`
                      absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                      ${embedText ? 'translate-x-7' : 'translate-x-1'}
                    `} />
                                    </div>
                                    <span className="text-sm text-white">Embed text in image</span>
                                </label>

                                {/* Warning */}
                                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <HelpCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                                    <p className="text-xs text-amber-200">
                                        <strong>Recommended:</strong> Keep this OFF. Text zones will be left clean for you to add text in your editor with full control.
                                    </p>
                                </div>

                                {/* Text inputs (only if embedText is true) */}
                                {embedText && (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Headline (e.g., FUEL YOUR GAINS)"
                                            value={textContent.headline}
                                            onChange={(e) => setTextContent(prev => ({ ...prev, headline: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Subheadline (e.g., Pure Whey Protein)"
                                            value={textContent.subheadline}
                                            onChange={(e) => setTextContent(prev => ({ ...prev, subheadline: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Offer (e.g., -20%)"
                                                value={textContent.offer}
                                                onChange={(e) => setTextContent(prev => ({ ...prev, offer: e.target.value }))}
                                                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="CTA (e.g., Shop Now)"
                                                value={textContent.cta}
                                                onChange={(e) => setTextContent(prev => ({ ...prev, cta: e.target.value }))}
                                                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Advanced Options Section */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Sparkles}
                    title="Advanced Options"
                    subtitle="Target audience and custom instructions"
                    isOpen={openSections.advanced}
                    onToggle={() => toggleSection('advanced')}
                    optional
                />
                <AnimatePresence>
                    {openSections.advanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Target Audience</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., fitness enthusiasts 25-40, young professionals"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Custom Instructions</label>
                                    <textarea
                                        placeholder="Any specific requirements for the image..."
                                        value={customInstructions}
                                        onChange={(e) => setCustomInstructions(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-white">Configuration Summary</span>
                </div>
                <div className="text-sm text-slate-300 space-y-1">
                    <p>• <strong>Category:</strong> {categories.find(c => c.id === productCategory)?.name?.en || productCategory}</p>
                    <p>• <strong>Format:</strong> {formats.find(f => f.id === outputFormat)?.name?.en || outputFormat} ({formats.find(f => f.id === outputFormat)?.aspectRatio})</p>
                    <p>• <strong>Style:</strong> {styles.find(s => s.id === brandStyle)?.name?.en || brandStyle}</p>
                    <p>• <strong>Mood:</strong> {moods.find(m => m.id === mood)?.name?.en || mood}</p>
                    <p>• <strong>Text:</strong> {embedText ? 'Embedded in image' : 'Clean zones for overlay'}</p>
                </div>
            </div>
        </div>
    );
};

export default AdCreativeMode;
