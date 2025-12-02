import React from 'react';
import { Check, Sparkles, Camera, Shirt, User, MapPin } from 'lucide-react';

function ReviewPage({
    selectedFile,
    selectedModel,
    selectedShoeModel,
    selectedBackground,
    category,
    gender,
    onGenerate,
    isGenerating
}) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Determine which model to display based on category
    const displayModel = category === 'shoes' ? selectedShoeModel : selectedModel;
    const modelLabel = category === 'shoes' ? 'Leg Style' : 'Model';

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Review Your Selection</h2>
                <p className="text-slate-400">Confirm your choices before generating the final image.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Visual Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Product Card */}
                        <div className="bg-white p-2 rounded-2xl shadow-sm">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 relative mb-3">
                                {selectedFile ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Your Product"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Shirt className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <p className="text-center font-medium text-slate-900 text-sm">Your Product</p>
                        </div>

                        {/* Model Card */}
                        <div className="bg-white p-2 rounded-2xl shadow-sm">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 relative mb-3">
                                {displayModel ? (
                                    <img
                                        src={`${apiUrl}${displayModel.previewUrl}`}
                                        alt={displayModel.name.en}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/400x600.png?text=' + encodeURIComponent(displayModel.name.en);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <p className="text-center font-medium text-slate-900 text-sm">{modelLabel}</p>
                        </div>

                        {/* Background Card */}
                        <div className="bg-white p-2 rounded-2xl shadow-sm">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 relative mb-3">
                                {selectedBackground ? (
                                    <img
                                        src={`${apiUrl}${selectedBackground.previewUrl}`}
                                        alt={selectedBackground.name.en}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/400x600.png?text=' + encodeURIComponent(selectedBackground.name.en);
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <MapPin className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <p className="text-center font-medium text-slate-900 text-sm">Background</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 shadow-xl text-slate-900 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            <h3 className="text-xl font-bold">Your Creation</h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">Product</span>
                                <span className="font-bold">1 item</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">{modelLabel}</span>
                                <span className="font-bold">{displayModel?.name?.en || 'Custom'}</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">Background</span>
                                <span className="font-bold">{selectedBackground?.name?.en || 'Studio'}</span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="font-bold text-lg">Total Cost</span>
                                <div className="flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-slate-900" />
                                    <span className="font-bold text-xl">1</span>
                                    <span className="text-slate-500 text-sm">credit</span>
                                </div>
                            </div>

                            <button
                                onClick={onGenerate}
                                disabled={isGenerating}
                                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                {isGenerating ? 'Processing...' : 'Create Photo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewPage;
