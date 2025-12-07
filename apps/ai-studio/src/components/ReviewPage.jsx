import React from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Sparkles,
    Camera,
    Shirt,
    User,
    Image,
    ShoppingBag,
    Watch,
    Footprints,
    Wand2,
    AlertTriangle,
    ExternalLink
} from 'lucide-react';
import AnimatedButton from './common/AnimatedButton';
import { IMAGE_STYLES } from './ImageStyleSelection';

function ReviewPage({
    selectedFile,
    selectedModel,
    selectedShoeModel,
    selectedBackground,
    imageStyle,
    category,
    gender,
    bagStyle,
    bagDisplayMode,
    accessoryType,
    accessorySubtype,
    onGenerate,
    isGenerating,
    credits // NEW: credits object with balance
}) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Get photography style from imageStyle id
    const getPhotoStyle = () => {
        return IMAGE_STYLES.find(s => s.id === imageStyle) || IMAGE_STYLES[0];
    };

    const photoStyle = getPhotoStyle();

    // Category icons
    const categoryIcons = {
        clothes: Shirt,
        shoes: Footprints,
        bags: ShoppingBag,
        accessories: Watch,
    };
    const CategoryIcon = categoryIcons[category] || Shirt;

    // Category colors for styling
    const categoryColors = {
        clothes: 'from-purple-500 to-indigo-600',
        shoes: 'from-orange-500 to-amber-600',
        bags: 'from-pink-500 to-rose-600',
        accessories: 'from-teal-500 to-cyan-600',
    };

    // Get display model based on category
    const getDisplayModel = () => {
        switch (category) {
            case 'shoes':
                return selectedShoeModel;
            case 'clothes':
                return selectedModel;
            default:
                return null;
        }
    };

    const displayModel = getDisplayModel();

    // Get style label based on category
    const getStyleLabel = () => {
        switch (category) {
            case 'shoes': return 'Leg Style';
            case 'clothes': return 'Model';
            case 'bags': return 'Bag Style';
            case 'accessories': return 'Type';
            default: return 'Style';
        }
    };

    // Get style value based on category
    const getStyleValue = () => {
        switch (category) {
            case 'shoes':
                return selectedShoeModel?.name?.en || 'Default';
            case 'clothes':
                return selectedModel?.name?.en || 'AI Generated';
            case 'bags':
                return bagStyle?.name || 'Custom';
            case 'accessories':
                return accessorySubtype?.name || accessoryType?.name || 'Custom';
            default:
                return 'Custom';
        }
    };

    return (
        <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="mb-8 text-center">
                <motion.div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${categoryColors[category]} mb-4`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <CategoryIcon className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold capitalize">{category}</span>
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Review Your Creation</h2>
                <p className="text-slate-400">Confirm your choices before generating</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Visual Preview Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Product Card */}
                        <motion.div
                            className="glass-card p-3 rounded-2xl"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 relative mb-3">
                                {selectedFile ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Your Product"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <CategoryIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                    <Check className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-center font-medium text-white text-sm">Your Product</p>
                        </motion.div>

                        {/* Model/Style Card */}
                        <motion.div
                            className="glass-card p-3 rounded-2xl"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 relative mb-3">
                                {displayModel ? (
                                    <img
                                        src={`${apiUrl}${displayModel.previewUrl}`}
                                        alt={displayModel.name?.en || 'Model'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://placehold.co/400x600.png?text=${encodeURIComponent(displayModel.name?.en || 'Model')}`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                                        <User className="w-12 h-12" />
                                        <span className="text-xs">{gender === 'male' ? 'Male' : 'Female'}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-center font-medium text-white text-sm">{getStyleLabel()}</p>
                        </motion.div>

                        {/* Photo Style Card - FIXED: Now shows selected style instead of "Studio" */}
                        <motion.div
                            className="glass-card p-3 rounded-2xl"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={`aspect-[3/4] rounded-xl overflow-hidden relative mb-3 bg-gradient-to-br ${photoStyle.gradient}`}>
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${photoStyle.textDark ? 'bg-black/10' : 'bg-white/20'}`}>
                                        <photoStyle.icon className={`w-8 h-8 ${photoStyle.textDark ? 'text-slate-800' : 'text-white'}`} />
                                    </div>
                                    <span className={`text-lg font-bold ${photoStyle.textDark ? 'text-slate-800' : 'text-white'}`}>
                                        {photoStyle.name}
                                    </span>
                                    <span className={`text-xs px-3 text-center ${photoStyle.textDark ? 'text-slate-600' : 'text-white/70'}`}>
                                        {photoStyle.description}
                                    </span>
                                </div>
                            </div>
                            <p className="text-center font-medium text-white text-sm">Photo Style</p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column - Summary Panel */}
                <div className="lg:col-span-1">
                    <motion.div
                        className="glass-card p-6 rounded-3xl h-full flex flex-col"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold text-white">Summary</h3>
                        </div>

                        <div className="space-y-4 flex-1">
                            {/* Category */}
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-slate-400 font-medium">Category</span>
                                <span className="font-bold text-white capitalize">{category}</span>
                            </div>

                            {/* Gender */}
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-slate-400 font-medium">Model</span>
                                <span className="font-bold text-white">{gender === 'male' ? 'Male' : 'Female'}</span>
                            </div>

                            {/* Style (varies by category) */}
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-slate-400 font-medium">{getStyleLabel()}</span>
                                <span className="font-bold text-white">{getStyleValue()}</span>
                            </div>

                            {/* Photography Style */}
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-slate-400 font-medium">Photo Style</span>
                                <span className="font-bold text-white flex items-center gap-2">
                                    <span>{photoStyle.emoji}</span>
                                    {photoStyle.name}
                                </span>
                            </div>

                            {/* Bags display mode if applicable */}
                            {category === 'bags' && bagDisplayMode && (
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-slate-400 font-medium">Display</span>
                                    <span className="font-bold text-white">{bagDisplayMode.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Cost and Generate Button */}
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="font-bold text-lg text-white">Cost</span>
                                <div className="flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-primary" />
                                    <span className="font-bold text-xl text-white">1</span>
                                    <span className="text-slate-400 text-sm">credit</span>
                                </div>
                            </div>

                            {/* No Credits Warning */}
                            {credits !== null && credits?.balance < 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-red-400">Out of Credits</p>
                                            <p className="text-sm text-red-300/70 mt-1">
                                                You need at least 1 credit to generate photos.
                                            </p>
                                            <a
                                                href={`${import.meta.env.VITE_DASHBOARD_URL || (import.meta.env.PROD ? 'https://dashboard.brandili.shop' : 'http://localhost:3000')}/dashboard`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Go to Dashboard
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <AnimatedButton
                                onClick={onGenerate}
                                disabled={isGenerating || (credits !== null && credits?.balance < 1)}
                                variant={category}
                                size="lg"
                                fullWidth
                                glow
                                icon={Wand2}
                            >
                                {isGenerating
                                    ? 'Creating Magic...'
                                    : (credits !== null && credits?.balance < 1)
                                        ? 'No Credits Available'
                                        : 'Generate Photo'}
                            </AnimatedButton>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default ReviewPage;
