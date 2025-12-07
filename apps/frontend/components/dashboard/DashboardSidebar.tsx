'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@busi/types';
import { useMobileMenu } from '@/lib/MobileMenuContext';
import { X } from 'lucide-react';

interface DashboardSidebarProps {
  user: User;
  shopId: number | null;
}

export default function DashboardSidebar({ user, shopId }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useMobileMenu();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Products', href: '/dashboard/products', icon: '📦' },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛍️' },
    { name: 'Delivery', href: '/dashboard/delivery', icon: '🚚' },
    { name: 'Categories', href: '/dashboard/categories', icon: '🏷️' },
    { name: 'Credits', href: '/dashboard/credits', icon: '💰' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  const aiStudioUrl = process.env.NODE_ENV === 'production'
    ? 'https://studio.brandili.shop'
    : 'http://localhost:3002';

  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a nav item
    close();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-50
          w-72 lg:w-64 
          bg-white border-r border-gray-100 
          min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]
          flex flex-col 
          shadow-[2px_0_20px_-10px_rgba(0,0,0,0.05)]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
          <span className="font-semibold text-gray-900">Menu</span>
          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 flex-1">
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group ${isActive(item.href) && item.href !== '/dashboard' || (item.href === '/dashboard' && pathname === '/dashboard')
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                  }`}
              >
                <span className={`mr-3 text-lg transition-transform duration-300 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* AI Studio Link - External */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Tools</p>

            {/* AI Gallery - Internal */}
            <Link
              href="/dashboard/ai-gallery"
              onClick={handleNavClick}
              className={`flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group mb-1.5 ${isActive('/dashboard/ai-gallery')
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 translate-x-1'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                }`}
            >
              <span className={`mr-3 text-lg transition-transform duration-300 ${isActive('/dashboard/ai-gallery') ? 'scale-110' : 'group-hover:scale-110'}`}>🖼️</span>
              AI Gallery
            </Link>

            {/* AI Studio - External */}
            <a
              href={aiStudioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 hover:translate-x-1 border border-purple-100"
            >
              <span className="mr-3 text-lg transition-transform duration-300 group-hover:scale-110">✨</span>
              AI Photo Studio
              <svg className="ml-auto w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
