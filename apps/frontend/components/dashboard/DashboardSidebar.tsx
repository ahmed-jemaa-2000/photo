'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '@busi/types';
import { useMobileMenu } from '@/lib/MobileMenuContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles } from 'lucide-react';

interface DashboardSidebarProps {
  user: User;
  shopId: number | null;
}

export default function DashboardSidebar({ user, shopId }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useMobileMenu();
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(path);
  };

  // Emojis with enhanced styling
  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: '📊', gradient: 'from-blue-500 to-indigo-600' },
    { name: 'Products', href: '/dashboard/products', icon: '📦', gradient: 'from-emerald-500 to-teal-600' },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛍️', gradient: 'from-purple-500 to-pink-600' },
    { name: 'Delivery', href: '/dashboard/delivery', icon: '🚚', gradient: 'from-amber-500 to-orange-600' },
    { name: 'Categories', href: '/dashboard/categories', icon: '🏷️', gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Credits', href: '/dashboard/credits', icon: '💰', gradient: 'from-yellow-500 to-amber-600' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️', gradient: 'from-gray-500 to-slate-600' },
  ];

  const aiStudioUrl = process.env.NODE_ENV === 'production'
    ? 'https://studio.brandili.shop'
    : 'http://localhost:3002';

  const handleNavClick = () => close();

  return (
    <>
      {/* Mobile backdrop with blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-50
          w-72 lg:w-64 
          bg-white/95 backdrop-blur-xl border-r border-gray-100 
          min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]
          flex flex-col 
          shadow-[2px_0_40px_-10px_rgba(0,0,0,0.1)]
          transform ${mounted ? 'transition-transform duration-300 ease-out' : ''}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
          <span className="font-bold text-gray-900">Menu</span>
          <button onClick={close} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 flex-1">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              const isHovered = hoveredItem === item.href;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                      ${active
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {/* Glow effect on hover */}
                    {isHovered && !active && (
                      <motion.div
                        layoutId="navGlow"
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-xl`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}

                    {/* Animated emoji */}
                    <motion.span
                      className="text-xl mr-3"
                      animate={{
                        scale: isHovered || active ? 1.2 : 1,
                        rotate: isHovered ? [0, -10, 10, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.span>

                    <span className="font-medium">{item.name}</span>

                    {/* Active indicator dot */}
                    {active && (
                      <motion.span
                        layoutId="activeDot"
                        className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* AI Tools Section with sparkle effect */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="px-4 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              AI Tools
            </p>

            {/* AI Gallery */}
            <Link
              href="/dashboard/ai-gallery"
              onClick={handleNavClick}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group mb-2 ${isActive('/dashboard/ai-gallery')
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-600 hover:bg-purple-50'
                }`}
            >
              <span className="text-xl mr-3 group-hover:animate-bounce">🖼️</span>
              AI Gallery
            </Link>

            {/* AI Studio - External with shimmer */}
            <a
              href={aiStudioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 border border-purple-200 transition-all duration-300 group overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              <span className="text-xl mr-3 group-hover:animate-pulse">✨</span>
              <span className="font-medium relative">AI Photo Studio</span>
              <ExternalLink className="ml-auto w-4 h-4 opacity-60 group-hover:opacity-100" />
            </a>
          </div>
        </div>

        {/* User Profile with gradient border */}
        <div className="p-4 border-t border-gray-100">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative p-[2px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
          >
            <div className="flex items-center p-3 rounded-[14px] bg-white">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </aside>
    </>
  );
}
