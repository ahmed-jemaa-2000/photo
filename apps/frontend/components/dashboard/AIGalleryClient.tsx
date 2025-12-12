'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Generation {
    id: number;
    imageUrl: string;
    downloadUrl?: string;
    category: string;
    prompt?: string;
    createdAt: string;
    product?: {
        id: number;
        name: string;
    } | null;
}

const AI_STUDIO_URL = process.env.NEXT_PUBLIC_AI_STUDIO_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://studio.brandili.shop' : 'http://localhost:3002');

// AI API URL (where images are served from)
const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://api.brandili.shop' : 'http://localhost:3001');

const CATEGORY_COLORS: Record<string, string> = {
    clothes: 'bg-purple-100 text-purple-700',
    shoes: 'bg-blue-100 text-blue-700',
    bags: 'bg-amber-100 text-amber-700',
    accessories: 'bg-pink-100 text-pink-700',
    adCreative: 'bg-violet-100 text-violet-700',
};

const CATEGORY_ICONS: Record<string, string> = {
    clothes: '👔',
    shoes: '👟',
    bags: '👜',
    accessories: '💍',
    adCreative: '✨',
};

export default function AIGalleryClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [selectedImage, setSelectedImage] = useState<Generation | null>(null);

    /**
     * Get the base URL for AI API assets
     * In production: https://api.brandili.shop
     * In development: http://localhost:3001
     */
    const getAiApiBase = () => {
        const envBase = process.env.NEXT_PUBLIC_AI_API_URL;
        if (envBase) return envBase.replace(/\/+$/, '');

        if (typeof window === 'undefined') {
            return process.env.NODE_ENV === 'production'
                ? 'https://api.brandili.shop'
                : 'http://localhost:3001';
        }

        if (process.env.NODE_ENV === 'production') {
            return 'https://api.brandili.shop';
        }

        const { protocol, hostname } = window.location;
        return `${protocol}//${hostname}:3001`;
    };

    /**
     * Resolve relative image URLs to full URLs pointing to AI API
     */
    const resolveAssetUrl = (url?: string) => {
        if (!url) return url;
        // Already a full URL
        if (/^https?:\/\//i.test(url)) return url;
        // Relative path - prepend AI API base
        const base = getAiApiBase();
        if (!base) return url;
        const path = url.startsWith('/') ? url : `/${url}`;
        return `${base}${path}`;
    };

    const fetchGenerations = async () => {
        try {
            setLoading(true);

            const res = await fetch('/api/ai-generations/me');

            if (res.status === 401) {
                router.push('/dashboard/login');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                const items: Generation[] = data.data || [];
                setGenerations(items.map((gen) => ({
                    ...gen,
                    imageUrl: resolveAssetUrl(gen.imageUrl) || gen.imageUrl,
                    downloadUrl: resolveAssetUrl(gen.downloadUrl) || gen.downloadUrl,
                })));
            } else {
                toast.error('Failed to load gallery');
            }
        } catch (error) {
            console.error('Error fetching generations:', error);
            toast.error('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenerations();
    }, []);

    const filteredGenerations = filter === 'all'
        ? generations
        : generations.filter(g => g.category === filter);

    const handleDownload = async (gen: Generation) => {
        try {
            const downloadUrl = gen.downloadUrl || gen.imageUrl;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `ai-generated-${gen.id}.png`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Download started');
        } catch (error) {
            toast.error('Failed to download image');
        }
    };

    const handleDelete = async (gen: Generation) => {
        if (!confirm('Are you sure you want to delete this generation?')) return;

        try {
            const res = await fetch(`/api/ai-generations/${gen.id}`, { method: 'DELETE' });

            if (res.ok) {
                setGenerations(prev => prev.filter(g => g.id !== gen.id));
                toast.success('Generation deleted');
                setSelectedImage(null);
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Failed to delete generation');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (generations.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Generations Yet</h3>
                <p className="text-gray-500 mb-6">Your AI-generated photos will appear here</p>
                <a
                    href={AI_STUDIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition"
                >
                    <span>✨</span>
                    Open AI Studio
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    All ({generations.length})
                </button>
                {['clothes', 'shoes', 'bags', 'accessories', 'adCreative'].map(cat => {
                    const count = generations.filter(g => g.category === cat).length;
                    if (count === 0) return null;
                    return (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${filter === cat
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span>{CATEGORY_ICONS[cat]}</span>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGenerations.map(gen => (
                    <div
                        key={gen.id}
                        onClick={() => setSelectedImage(gen)}
                        className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition"
                    >
                        <img
                            src={gen.imageUrl}
                            alt={`AI Generation ${gen.id}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.fallback-placeholder')) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'fallback-placeholder absolute inset-0 flex flex-col items-center justify-center text-gray-400';
                                    fallback.innerHTML = '<span class="text-4xl mb-2">🖼️</span><span class="text-xs">Image unavailable</span>';
                                    parent.appendChild(fallback);
                                }
                            }}
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDownload(gen); }}
                                className="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition"
                                title="Download"
                            >
                                ⬇️
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(gen); }}
                                className="p-3 bg-white rounded-full text-red-600 hover:bg-red-50 transition"
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                        {/* Category Badge */}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[gen.category] || 'bg-gray-100 text-gray-700'}`}>
                            {CATEGORY_ICONS[gen.category] || '📷'} {gen.category === 'adCreative' ? 'Ad Creative' : gen.category}
                        </div>
                        {/* Product Link */}
                        {gen.product && (
                            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-700 truncate">
                                📦 {gen.product.name}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="md:w-2/3 bg-gray-100">
                                <img
                                    src={selectedImage.imageUrl}
                                    alt={`AI Generation ${selectedImage.id}`}
                                    className="w-full h-full object-contain max-h-[60vh]"
                                />
                            </div>
                            {/* Details */}
                            <div className="md:w-1/3 p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[selectedImage.category]}`}>
                                        {CATEGORY_ICONS[selectedImage.category]} {selectedImage.category}
                                    </span>
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Generated</p>
                                    <p className="text-gray-900 font-medium">{formatDate(selectedImage.createdAt)}</p>
                                </div>

                                {selectedImage.product && (
                                    <div>
                                        <p className="text-sm text-gray-500">Product</p>
                                        <p className="text-gray-900 font-medium">📦 {selectedImage.product.name}</p>
                                    </div>
                                )}

                                {selectedImage.prompt && (
                                    <div>
                                        <p className="text-sm text-gray-500">Prompt</p>
                                        <p className="text-gray-700 text-sm line-clamp-4">{selectedImage.prompt}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="pt-4 space-y-3">
                                    <button
                                        onClick={() => handleDownload(selectedImage)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition"
                                    >
                                        ⬇️ Download Image
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedImage)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
