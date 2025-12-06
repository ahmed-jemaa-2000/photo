'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Tag, Settings } from 'lucide-react';

interface QuickActionCardProps {
    href: string;
    title: string;
    description?: string;
    icon: ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'default';
}

const iconMap: Record<string, React.ElementType> = {
    '➕': Plus,
    '🏷️': Tag,
    '⚙️': Settings,
};

export default function QuickActionCard({
    href,
    title,
    description,
    icon,
    color = 'default',
}: QuickActionCardProps) {
    const colorStyles = {
        blue: {
            bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
            light: 'bg-blue-50',
            border: 'border-blue-100',
            hover: 'group-hover:border-blue-300',
        },
        green: {
            bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
            light: 'bg-green-50',
            border: 'border-green-100',
            hover: 'group-hover:border-green-300',
        },
        purple: {
            bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
            light: 'bg-purple-50',
            border: 'border-purple-100',
            hover: 'group-hover:border-purple-300',
        },
        orange: {
            bg: 'bg-gradient-to-br from-orange-500 to-amber-600',
            light: 'bg-orange-50',
            border: 'border-orange-100',
            hover: 'group-hover:border-orange-300',
        },
        default: {
            bg: 'bg-gradient-to-br from-gray-700 to-gray-900',
            light: 'bg-gray-50',
            border: 'border-gray-100',
            hover: 'group-hover:border-gray-300',
        },
    };

    const styles = colorStyles[color];
    const IconComponent = typeof icon === 'string' ? iconMap[icon as string] : null;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Link
                href={href}
                className={`group relative flex flex-col p-6 bg-white rounded-2xl border ${styles.border} ${styles.hover} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
            >
                {/* Background decoration */}
                <div className={`absolute -top-8 -right-8 w-24 h-24 ${styles.light} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div className="relative">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${styles.bg} flex items-center justify-center mb-4 shadow-lg text-white transform group-hover:scale-110 transition-transform duration-300`}>
                        {IconComponent ? (
                            <IconComponent className="w-5 h-5" />
                        ) : (
                            <span className="text-xl">{icon}</span>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
            </Link>
        </motion.div>
    );
}
