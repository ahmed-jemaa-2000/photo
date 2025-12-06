import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getProductsByShop, getOrdersByShop, getCategoriesByShop, getShopById } from '@/lib/strapi';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import StorefrontCard from '@/components/dashboard/StorefrontCard';
import { AlertTriangle } from 'lucide-react';

export default async function DashboardHome() {
  const token = await getAuthToken();

  if (!token) {
    return <div>Unauthorized</div>;
  }

  const shopId = await getUserShopId(token);

  if (!shopId) {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🏪</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Shop Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Your account is not associated with any shop yet. Please contact the platform administrator to set up your store.
        </p>
        <button className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/25">
          Contact Support
        </button>
      </div>
    );
  }

  const results = await Promise.allSettled([
    getShopById(shopId, token),
    getProductsByShop(shopId, { token }),
    getOrdersByShop(shopId, token),
    getCategoriesByShop(shopId, token),
  ]);

  const shop = results[0].status === 'fulfilled' ? results[0].value : null;
  const products = results[1].status === 'fulfilled' ? results[1].value : [];
  const orders = results[2].status === 'fulfilled' ? results[2].value : [];
  const categories = results[3].status === 'fulfilled' ? results[3].value : [];

  if (!shop) {
    return (
      <div className="p-8 bg-red-50 text-red-800 rounded-2xl border border-red-200">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-2">Error Loading Shop Data</h3>
            <p>We couldn't retrieve your shop details. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.isActive);
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  // Calculate total revenue from confirmed+ orders
  const totalRevenue = orders
    .filter(o => ['confirmed', 'shipped', 'delivered', 'completed'].includes(o.status))
    .reduce((acc, curr) => acc + (curr.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0), 0);

  // Get today's orders
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1">Dashboard</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back! 👋</h1>
          <p className="text-gray-500">
            Here's what's happening with <span className="font-semibold text-gray-700">{shop.name}</span> today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Revenue"
          value={`${totalRevenue.toFixed(0)} TND`}
          icon="💰"
          color="green"
          subtitle="From confirmed orders"
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          icon="🛍️"
          color="blue"
          subtitle={`${todayOrders.length} today`}
        />
        <StatsCard
          title="Active Products"
          value={activeProducts.length}
          icon="📦"
          color="purple"
          subtitle={`of ${products.length} total`}
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders.length}
          icon="⏳"
          color="orange"
          subtitle="Awaiting confirmation"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <RecentOrders orders={orders} />

          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickActionCard
                href="/dashboard/products/create"
                title="Add Product"
                description="Create a new product listing"
                icon="➕"
                color="blue"
              />
              <QuickActionCard
                href="/dashboard/categories"
                title="Categories"
                description="Organize your products"
                icon="🏷️"
                color="purple"
              />
              <QuickActionCard
                href="/dashboard/settings"
                title="Settings"
                description="Store preferences"
                icon="⚙️"
                color="default"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <StorefrontCard shop={shop} />

          {/* Shop Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Shop Status</h3>
            <div className="space-y-5">
              {/* Products Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Products</span>
                  <span className="text-sm font-semibold text-gray-900">{activeProducts.length}/{products.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${products.length > 0 ? (activeProducts.length / products.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {products.length - activeProducts.length} draft{products.length - activeProducts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Categories */}
              <div className="flex items-center justify-between py-3 border-t border-gray-50">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="text-sm font-semibold text-gray-900">{categories.length}</span>
              </div>

              {/* Order Completion Rate */}
              <div className="flex items-center justify-between py-3 border-t border-gray-50">
                <span className="text-sm text-gray-600">Order Success Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {orders.length > 0
                    ? `${Math.round((orders.filter(o => ['delivered', 'completed'].includes(o.status)).length / orders.length) * 100)}%`
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
