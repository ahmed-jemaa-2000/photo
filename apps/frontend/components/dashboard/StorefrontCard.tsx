import { Shop } from '@busi/types';

interface StorefrontCardProps {
    shop: Shop;
}

export default function StorefrontCard({ shop }: StorefrontCardProps) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseDomain = isDevelopment ? 'brandini.test:3000' : 'brandini.tn';
    const protocol = isDevelopment ? 'http' : 'https';
    const shopUrl = `${protocol}://${shop.subdomain}.${baseDomain}`;

    return (
        <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 transition-transform duration-500 group-hover:scale-105" />

            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative h-full p-1">
                <div className="h-full bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col border border-white/10">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-white mb-1">Your Storefront</h3>
                            <p className="text-indigo-100 text-sm font-medium opacity-90">
                                {shop.name} is live
                            </p>
                        </div>
                        <div className="bg-green-500/20 text-green-50 text-xs font-medium px-2.5 py-1 rounded-full border border-green-400/30 flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                            Online
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        <a
                            href={shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn flex items-center justify-center w-full bg-white text-indigo-600 py-3 px-4 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <span>Visit Store</span>
                            <svg
                                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                        <p className="text-xs text-indigo-200 text-center font-medium opacity-70 hover:opacity-100 transition-opacity cursor-default">
                            {shop.subdomain}.{baseDomain}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
