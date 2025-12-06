import React from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Sparkles,
    Camera,
    Shirt,
    User,
    MapPin,
    ShoppingBag,
    Watch,
    Footprints,
    Wand2,
    Image
} from 'lucide-react';
import AnimatedButton from './common/AnimatedButton';
import { IMAGE_STYLES } from './ImageStyleSelection';

function ReviewPage({
    selectedFile,
    selectedModel,
    selectedShoeModel,
    selectedCameraAngle,
    selectedLighting,
    selectedBackground,
    imageStyle,
    category,
    gender,
    bagStyle,
    bagDisplayMode,
    accessoryType,
    accessorySubtype,
    onGenerate,
    isGenerating
}) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Get photography style name from imageStyle id
    const getStyleName = () => {
        const style = IMAGE_STYLES.find(s => s.id === imageStyle);
        return style?.name || 'E-commerce Clean';
    };

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

                        {/* Background Card */}
                        <motion.div
                            className="glass-card p-3 rounded-2xl"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 relative mb-3">
                                {selectedBackground ? (
                                    <img
                                        src={`${apiUrl}${selectedBackground.previewUrl}`}
                                        alt={selectedBackground.name?.en || 'Background'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://placehold.co/400x600.png?text=${encodeURIComponent(selectedBackground.name?.en || 'Studio')}`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 bg-gradient-to-br from-slate-800 to-slate-900">
                                        <MapPin className="w-12 h-12" />
                                        <span className="text-xs">Studio</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-center font-medium text-white text-sm">Background</p>
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
                                <span className="text-slate-400 font-medium">Photography Style</span>
                                <span className="font-bold text-white">{getStyleName()}</span>
                            </div>

                            {/* Category-specific fields */}
                            {category === 'shoes' && selectedCameraAngle && (
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-slate-400 font-medium">Camera</span>
                                    <span className="font-bold text-white">{selectedCameraAngle.name?.en}</span>
                                </div>
                            )}

                            {category === 'shoes' && selectedLighting && (
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-slate-400 font-medium">Lighting</span>
                                    <span className="font-bold text-white">{selectedLighting.name?.en}</span>
                                </div>
                            )}

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

                            <AnimatedButton
                                onClick={onGenerate}
                                disabled={isGenerating}
                                variant={category}
                                size="lg"
                                fullWidth
                                glow
                                icon={Wand2}
                            >
                                {isGenerating ? 'Creating Magic...' : 'Generate Photo'}
                            </AnimatedButton>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default ReviewPage;
