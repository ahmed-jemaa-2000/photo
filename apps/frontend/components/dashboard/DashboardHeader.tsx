'use client';

import { useRouter } from 'next/navigation';
import type { User } from '@busi/types';
import { useMobileMenu } from '@/lib/MobileMenuContext';
import { Menu, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const { toggle } = useMobileMenu();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/dashboard/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger menu - mobile only */}
            <button
              onClick={toggle}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <h1 className="text-xl md:text-2xl font-bold text-primary">Busi Dashboard</h1>
          </div>

          {/* Right: User info + Logout */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* User info - hidden on small mobile */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
