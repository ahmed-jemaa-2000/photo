import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette,
    Type,
    Layout,
    Sparkles,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Monitor,
    Target,
    Layers,
    Wand2,
    Info,
    Eye
} from 'lucide-react';

/**
 * Enhanced Ad Creative Configuration Component
 * Professional marketing poster designer with:
 * - Design Templates
 * - Composition Styles  
 * - Typography Styles
 * - Decorative Elements
 * - Color Schemes
 * - Text Content Zones
 */

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Section Header with collapsible support
 */
const SectionHeader = ({ icon: Icon, title, subtitle, isOpen, onToggle, badge }) => (
    <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center group-hover:from-primary/40 group-hover:to-purple-500/40 transition-all">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{title}</h3>
                    {badge && (
                        <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">{badge}</span>
                    )}
                </div>
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
            </div>
        </div>
        <div className="flex items-center gap-2">
            {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            )}
        </div>
    </button>
);

/**
 * Template Card with visual preview
 */
const TemplateCard = ({ template, selected, onClick }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
      relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden
      ${selected
                ? 'bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary shadow-lg shadow-primary/20'
                : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10'
            }
    `}
    >
        {/* Preview icon */}
        <div className="text-4xl mb-3">{template.preview}</div>

        {/* Title */}
        <p className="font-semibold text-white text-sm mb-1">{template.name?.en || template.name}</p>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2">{template.description?.en || template.description}</p>

        {/* Selected indicator */}
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
 * Option Button for single selections
 */
const OptionButton = ({ option, selected, onClick, showDiagram }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
      relative p-3 rounded-xl border-2 text-left transition-all
      ${selected
                ? 'bg-primary/20 border-primary'
                : 'bg-white/5 border-white/10 hover:border-primary/50'
            }
    `}
    >
        <div className="flex items-center gap-2">
            <span className="text-lg">{option.icon}</span>
            <span className="text-sm font-medium text-white">{option.name?.en || option.name}</span>
        </div>
        {showDiagram && option.diagram && (
            <p className="text-xs text-slate-500 mt-1 font-mono">{option.diagram}</p>
        )}
        {selected && (
            <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
        )}
    </motion.button>
);

/**
 * Multi-select Chip for decorative elements
 */
const SelectableChip = ({ item, selected, onClick }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
      px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-all border
      ${selected
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-primary/30'
            }
    `}
    >
        <span>{item.icon}</span>
        <span>{item.name?.en || item.name}</span>
    </motion.button>
);

/**
 * Color Scheme Card
 */
const ColorSchemeCard = ({ scheme, selected, onClick }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`
      relative p-3 rounded-xl border-2 transition-all
      ${selected
                ? 'border-primary bg-primary/10'
                : 'border-white/10 bg-white/5 hover:border-primary/50'
            }
    `}
    >
        <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{scheme.icon}</span>
            <span className="text-xs font-medium text-white">{scheme.name?.en || scheme.name}</span>
        </div>
        {scheme.colors && (
            <div className="flex gap-1">
                <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: scheme.colors.primary }}
                />
                <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: scheme.colors.secondary }}
                />
                <div
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: scheme.colors.accent }}
                />
            </div>
        )}
        {selected && (
            <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
        )}
    </motion.button>
);

/**
 * Color Picker for custom colors
 */
const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400 w-20">{label}</label>
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
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-primary focus:outline-none uppercase"
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
    // Get presets from API config
    const presets = useMemo(() => {
        return config?.adCreativePresets || {
            designTemplates: [],
            decorativeElements: [],
            compositionStyles: [],
            typographyStyles: [],
            colorSchemes: [],
            outputFormats: [],
            productCategories: []
        };
    }, [config]);

    // State
    const [productCategory, setProductCategory] = useState('other');
    const [outputFormat, setOutputFormat] = useState('instagram_feed');
    const [designTemplate, setDesignTemplate] = useState('modern_gradient');
    const [compositionStyle, setCompositionStyle] = useState('subject_center');
    const [typographyStyle, setTypographyStyle] = useState('modern_clean');
    const [colorScheme, setColorScheme] = useState('royal_blue');
    const [customColors, setCustomColors] = useState({ primary: '', secondary: '', accent: '' });
    const [useCustomColors, setUseCustomColors] = useState(false);
    const [decorativeElements, setDecorativeElements] = useState([]);
    const [textContent, setTextContent] = useState({
        headline: '',
        subheadline: '',
        offer: '',
        cta: '',
        contact: ''
    });
    const [targetAudience, setTargetAudience] = useState('');
    const [customInstructions, setCustomInstructions] = useState('');

    // Section toggle states
    const [openSections, setOpenSections] = useState({
        category: true,
        template: true,
        format: false,
        composition: false,
        typography: false,
        colors: false,
        decorations: false,
        text: false,
        advanced: false
    });

    // Toggle decorative element - MAX 3 ALLOWED
    const MAX_DECORATIVE_ELEMENTS = 3;
    const toggleDecorativeElement = (elemId) => {
        setDecorativeElements(prev => {
            if (elemId === 'none') return [];

            // If removing, always allow
            if (prev.includes(elemId)) {
                return prev.filter(id => id !== elemId);
            }

            // If adding, check limit
            if (prev.length >= MAX_DECORATIVE_ELEMENTS) {
                // Could add toast notification here
                console.warn(`Maximum ${MAX_DECORATIVE_ELEMENTS} decorative elements allowed`);
                return prev; // Don't add more
            }

            return [...prev.filter(id => id !== 'none'), elemId];
        });
    };

    // Auto-apply template's suggested colors when template changes
    useEffect(() => {
        const template = presets.designTemplates?.find(t => t.id === designTemplate);
        if (template?.colorSuggestion && !useCustomColors) {
            // Only auto-apply if user hasn't manually chosen custom colors
            setCustomColors(template.colorSuggestion);
            // Optionally auto-enable custom colors for the template suggestion
            // setUseCustomColors(true);
        }
    }, [designTemplate, presets.designTemplates]);

    // Update parent whenever config changes
    useEffect(() => {
        const activeColors = useCustomColors ? customColors : null;

        onConfigChange?.({
            productCategory,
            outputFormat,
            designTemplate,
            compositionStyle,
            typographyStyle,
            colorScheme: useCustomColors ? 'custom' : colorScheme,
            customColors: activeColors,
            decorativeElements,
            textContent: Object.values(textContent).some(v => v) ? textContent : null,
            targetAudience: targetAudience || null,
            customInstructions: customInstructions || null
        });
    }, [productCategory, outputFormat, designTemplate, compositionStyle, typographyStyle, colorScheme, customColors, useCustomColors, decorativeElements, textContent, targetAudience, customInstructions, onConfigChange]);

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Get current selections for summary
    const currentTemplate = presets.designTemplates?.find(t => t.id === designTemplate);
    const currentFormat = presets.outputFormats?.find(f => f.id === outputFormat);
    const currentComposition = presets.compositionStyles?.find(c => c.id === compositionStyle);
    const currentScheme = presets.colorSchemes?.find(s => s.id === colorScheme);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full border border-primary/30 mb-4">
                    <Wand2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Professional Poster Designer</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Create Your <span className="text-gradient">Marketing Poster</span>
                </h2>
                <p className="text-slate-400">
                    Configure design template, colors, and layout for professional results
                </p>
            </div>

            {/* 1. Product Category */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Target}
                    title="Product Category"
                    subtitle="What type of product are you promoting?"
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
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1">
                                {presets.productCategories?.map((cat) => (
                                    <OptionButton
                                        key={cat.id}
                                        option={cat}
                                        selected={productCategory === cat.id}
                                        onClick={() => setProductCategory(cat.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. Design Template */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Sparkles}
                    title="Design Template"
                    subtitle="Choose the visual style for your poster"
                    isOpen={openSections.template}
                    onToggle={() => toggleSection('template')}
                    badge="Important"
                />
                <AnimatePresence>
                    {openSections.template && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1">
                                {/* Loading skeleton when presets not yet loaded */}
                                {!presets.designTemplates?.length && (
                                    <>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="p-4 rounded-2xl border-2 border-white/10 bg-white/5 animate-pulse">
                                                <div className="w-12 h-12 bg-white/10 rounded-lg mb-3" />
                                                <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                                                <div className="h-3 bg-white/10 rounded w-full" />
                                            </div>
                                        ))}
                                    </>
                                )}
                                {/* Actual templates */}
                                {presets.designTemplates?.map((template) => (
                                    <TemplateCard
                                        key={template.id}
                                        template={template}
                                        selected={designTemplate === template.id}
                                        onClick={() => setDesignTemplate(template.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Output Format */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Monitor}
                    title="Output Format"
                    subtitle="Platform and size"
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1">
                                {presets.outputFormats?.map((format) => (
                                    <OptionButton
                                        key={format.id}
                                        option={{
                                            ...format,
                                            name: { en: `${format.name?.en || format.name} (${format.aspectRatio})` }
                                        }}
                                        selected={outputFormat === format.id}
                                        onClick={() => setOutputFormat(format.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 4. Composition Style */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Layout}
                    title="Composition Style"
                    subtitle="How the product is positioned"
                    isOpen={openSections.composition}
                    onToggle={() => toggleSection('composition')}
                />
                <AnimatePresence>
                    {openSections.composition && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1">
                                {presets.compositionStyles?.map((comp) => (
                                    <OptionButton
                                        key={comp.id}
                                        option={comp}
                                        selected={compositionStyle === comp.id}
                                        onClick={() => setCompositionStyle(comp.id)}
                                        showDiagram
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 5. Color Scheme */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Palette}
                    title="Color Scheme"
                    subtitle="Brand colors for the design"
                    isOpen={openSections.colors}
                    onToggle={() => toggleSection('colors')}
                />
                <AnimatePresence>
                    {openSections.colors && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 p-1">
                                {/* Preset colors */}
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {presets.colorSchemes?.filter(s => s.id !== 'custom').map((scheme) => (
                                        <ColorSchemeCard
                                            key={scheme.id}
                                            scheme={scheme}
                                            selected={!useCustomColors && colorScheme === scheme.id}
                                            onClick={() => {
                                                setColorScheme(scheme.id);
                                                setUseCustomColors(false);
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Custom colors toggle */}
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                                        <div className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${useCustomColors ? 'bg-primary' : 'bg-white/20'}
                    `}>
                                            <div className={`
                        absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                        ${useCustomColors ? 'translate-x-7' : 'translate-x-1'}
                      `} />
                                        </div>
                                        <span className="text-sm text-white">Use custom brand colors</span>
                                    </label>

                                    {useCustomColors && (
                                        <div className="space-y-3">
                                            <ColorPicker
                                                label="Primary"
                                                value={customColors.primary}
                                                onChange={(v) => setCustomColors(prev => ({ ...prev, primary: v }))}
                                            />
                                            <ColorPicker
                                                label="Secondary"
                                                value={customColors.secondary}
                                                onChange={(v) => setCustomColors(prev => ({ ...prev, secondary: v }))}
                                            />
                                            <ColorPicker
                                                label="Accent"
                                                value={customColors.accent}
                                                onChange={(v) => setCustomColors(prev => ({ ...prev, accent: v }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 6. Decorative Elements */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Layers}
                    title="Decorative Elements"
                    subtitle="Visual effects and embellishments"
                    isOpen={openSections.decorations}
                    onToggle={() => toggleSection('decorations')}
                />
                <AnimatePresence>
                    {openSections.decorations && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-1">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs text-slate-400">Select elements to add to your design</p>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${decorativeElements.length >= 3
                                            ? 'bg-amber-500/20 text-amber-300'
                                            : 'bg-white/10 text-slate-400'
                                        }`}>
                                        {decorativeElements.length}/3 max
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {presets.decorativeElements?.map((elem) => (
                                        <SelectableChip
                                            key={elem.id}
                                            item={elem}
                                            selected={elem.id === 'none' ? decorativeElements.length === 0 : decorativeElements.includes(elem.id)}
                                            onClick={() => toggleDecorativeElement(elem.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 7. Typography Style */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Type}
                    title="Typography Style"
                    subtitle="Font aesthetic for text zones"
                    isOpen={openSections.typography}
                    onToggle={() => toggleSection('typography')}
                />
                <AnimatePresence>
                    {openSections.typography && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1">
                                {presets.typographyStyles?.map((typo) => (
                                    <OptionButton
                                        key={typo.id}
                                        option={typo}
                                        selected={typographyStyle === typo.id}
                                        onClick={() => setTypographyStyle(typo.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 8. Text Content Zones */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Type}
                    title="Text Content"
                    subtitle="Define text for clean zones (won't be rendered in image)"
                    isOpen={openSections.text}
                    onToggle={() => toggleSection('text')}
                />
                <AnimatePresence>
                    {openSections.text && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3 p-4 bg-white/5 rounded-xl">
                                <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
                                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-blue-200">
                                        Text won't be rendered in the image. Instead, clean zones will be left for you to add text in your design tool.
                                    </p>
                                </div>

                                <input
                                    type="text"
                                    placeholder="📢 Headline (e.g., MEGA SALE)"
                                    value={textContent.headline}
                                    onChange={(e) => setTextContent(prev => ({ ...prev, headline: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="💬 Subheadline (e.g., Limited time offer)"
                                    value={textContent.subheadline}
                                    onChange={(e) => setTextContent(prev => ({ ...prev, subheadline: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="🏷️ Offer (e.g., -50%)"
                                        value={textContent.offer}
                                        onChange={(e) => setTextContent(prev => ({ ...prev, offer: e.target.value }))}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="🖱️ CTA (e.g., SHOP NOW)"
                                        value={textContent.cta}
                                        onChange={(e) => setTextContent(prev => ({ ...prev, cta: e.target.value }))}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="📞 Contact (e.g., www.example.com | +216 XX XXX XXX)"
                                    value={textContent.contact}
                                    onChange={(e) => setTextContent(prev => ({ ...prev, contact: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 9. Advanced Options */}
            <div className="space-y-3">
                <SectionHeader
                    icon={Wand2}
                    title="Advanced Options"
                    subtitle="Target audience and custom instructions"
                    isOpen={openSections.advanced}
                    onToggle={() => toggleSection('advanced')}
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
                                        placeholder="e.g., fitness enthusiasts 25-40, young professionals, gamers"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Custom Instructions</label>
                                    <textarea
                                        placeholder="Any specific requirements for the design..."
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

            {/* Configuration Summary */}
            <div className="p-5 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-white">Configuration Summary</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-slate-400">Template:</span>
                        <span className="text-white ml-2">{currentTemplate?.preview} {currentTemplate?.name?.en || designTemplate}</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Format:</span>
                        <span className="text-white ml-2">{currentFormat?.name?.en || outputFormat} ({currentFormat?.aspectRatio})</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Composition:</span>
                        <span className="text-white ml-2">{currentComposition?.icon} {currentComposition?.name?.en || compositionStyle}</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Colors:</span>
                        <span className="text-white ml-2">
                            {useCustomColors ? '🎨 Custom' : `${currentScheme?.icon} ${currentScheme?.name?.en || colorScheme}`}
                        </span>
                    </div>
                    {decorativeElements.length > 0 && (
                        <div className="col-span-2">
                            <span className="text-slate-400">Decorations:</span>
                            <span className="text-white ml-2">
                                {decorativeElements.map(id => {
                                    const elem = presets.decorativeElements?.find(e => e.id === id);
                                    return elem?.icon || '';
                                }).join(' ')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdCreativeMode;
