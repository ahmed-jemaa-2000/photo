'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg'
                    : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                            <span className="text-white font-bold text-lg sm:text-xl">B</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-white">
                            Brandini
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Testimonials
                        </Link>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/login"
                            className="hidden sm:inline-flex text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/dashboard/login"
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold text-sm rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
                        >
                            <span>Start Free</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/10"
                >
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        <Link href="#features" className="block text-gray-300 hover:text-white py-2">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="block text-gray-300 hover:text-white py-2">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="block text-gray-300 hover:text-white py-2">
                            Testimonials
                        </Link>
                        <Link href="/dashboard/login" className="block text-gray-300 hover:text-white py-2">
                            Log In
                        </Link>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
