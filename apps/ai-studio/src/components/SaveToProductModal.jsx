import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';

// Dashboard URL
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL ||
    (import.meta.env.PROD ? 'https://dashboard.brandili.shop' : 'http://localhost:3000');

/**
 * Modal to save generated image back to the source product in Dashboard
 * Only shown when AI Studio was opened from a Dashboard product
 */
export function SaveToProductModal({
    isOpen,
    onClose,
    imageUrl,
    sourceProduct,
    onSaveSuccess
}) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !sourceProduct?.id) return null;

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            // Call the Dashboard API to save the image to the product
            const response = await fetch(`${DASHBOARD_URL}/api/products/save-ai-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send auth cookies
                body: JSON.stringify({
                    productId: sourceProduct.id,
                    imageUrl: imageUrl,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save image');
            }

            setSaved(true);
            onSaveSuccess?.();

            // Auto-close after success
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            console.error('Error saving to product:', err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleViewProduct = () => {
        window.open(`${DASHBOARD_URL}/products/${sourceProduct.id}/edit`, '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-white/10 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Save to Product</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    {saved ? (
                        <div className="text-center py-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckCircle2 className="w-8 h-8 text-green-400" />
                            </motion.div>
                            <p className="text-white font-medium mb-2">Image Saved!</p>
                            <p className="text-slate-400 text-sm">
                                The generated image has been added to {sourceProduct.name}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white/5 rounded-xl p-4 mb-6">
                                <p className="text-slate-300 text-sm mb-2">
                                    Save this AI-generated image to:
                                </p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <span className="text-2xl">📦</span>
                                    {sourceProduct.name}
                                </p>
                            </div>

                            {/* Preview */}
                            {imageUrl && (
                                <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
                                    <img
                                        src={imageUrl}
                                        alt="Generated"
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleViewProduct}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View Product
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save to Gallery
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default SaveToProductModal;
