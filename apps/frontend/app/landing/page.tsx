import { Metadata } from 'next';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import Hero from '@/components/landing/Hero';
import TrustBar from '@/components/landing/TrustBar';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import AIShowcase from '@/components/landing/AIShowcase';
import Testimonials from '@/components/landing/Testimonials';
import FinalCTA from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
    title: 'Brandini - Launch Your Online Store in Minutes',
    description: 'Create a beautiful storefront with AI-powered tools. No coding required. Start selling today.',
    keywords: ['e-commerce', 'online store', 'AI', 'storefront', 'sell online'],
    openGraph: {
        title: 'Brandini - Launch Your Online Store in Minutes',
        description: 'Create a beautiful storefront with AI-powered tools. No coding required.',
        type: 'website',
    },
};

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <LandingHeader />
            <main className="flex-grow">
                <Hero />
                <TrustBar />
                <Features />
                <HowItWorks />
                <AIShowcase />
                <Testimonials />
                <FinalCTA />
            </main>
            <LandingFooter />
        </div>
    );
}
