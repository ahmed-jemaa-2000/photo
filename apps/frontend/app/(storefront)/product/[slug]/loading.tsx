import Container from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-0">
            <Container>
                <div className="py-4">
                    <Skeleton className="h-6 w-48" />
                </div>

                <div className="grid grid-cols-1 gap-12 py-6 lg:grid-cols-[1.2fr,1fr] lg:gap-16">
                    {/* Left Column: Gallery Skeleton */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="aspect-square w-full rounded-3xl overflow-hidden">
                            <Skeleton className="h-full w-full" />
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details Skeleton */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-12 w-1/2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <Skeleton className="h-8 w-32" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>

                        <div className="hidden lg:block p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-4 w-48 mx-auto mt-3" />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
