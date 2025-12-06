import { Suspense } from 'react';
import AIGalleryClient from '@/components/dashboard/AIGalleryClient';

export default function AIGalleryPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Generation Gallery</h1>
                <p className="text-gray-500">View and manage all your AI-generated product photos</p>
            </div>

            {/* Gallery */}
            <Suspense fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            }>
                <AIGalleryClient />
            </Suspense>
        </div>
    );
}
