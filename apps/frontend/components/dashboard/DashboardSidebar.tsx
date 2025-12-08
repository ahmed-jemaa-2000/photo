'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, ReactNode } from 'react';
import { User } from '@busi/types';
import { useMobileMenu } from '@/lib/MobileMenuContext';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Tags,
  Coins,
  Settings,
  Image,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface DashboardSidebarProps {
  user: User;
  shopId: number | null;
}

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

export default function DashboardSidebar({ user, shopId }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useMobileMenu();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems: NavItem[] = [
    { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Products', href: '/dashboard/products', icon: <Package className="w-5 h-5" /> },
    { name: 'Orders', href: '/dashboard/orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Delivery', href: '/dashboard/delivery', icon: <Truck className="w-5 h-5" /> },
    { name: 'Categories', href: '/dashboard/categories', icon: <Tags className="w-5 h-5" /> },
    { name: 'Credits', href: '/dashboard/credits', icon: <Coins className="w-5 h-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const aiStudioUrl = process.env.NODE_ENV === 'production'
    ? 'https://studio.brandili.shop'
    : 'http://localhost:3002';

  const handleNavClick = () => {
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
          transform ${mounted ? 'transition-transform duration-300 ease-in-out' : ''}
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
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${active
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className={`mr-3 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* AI Tools Section */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Tools</p>

            {/* AI Gallery - Internal */}
            <Link
              href="/dashboard/ai-gallery"
              onClick={handleNavClick}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group mb-1.5 ${isActive('/dashboard/ai-gallery')
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Image className={`w-5 h-5 mr-3 transition-transform duration-200 ${!isActive('/dashboard/ai-gallery') ? 'group-hover:scale-110' : ''}`} />
              AI Gallery
            </Link>

            {/* AI Studio - External */}
            <a
              href={aiStudioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 border border-purple-100"
            >
              <Sparkles className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
              AI Photo Studio
              <ExternalLink className="ml-auto w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-200">
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

