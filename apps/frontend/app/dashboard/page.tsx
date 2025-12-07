import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getProductsByShop, getOrdersByShop, getCategoriesByShop, getShopById } from '@/lib/strapi';
import { AlertTriangle } from 'lucide-react';
import DashboardHomeClient from './DashboardHomeClient';

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
    <DashboardHomeClient
      shop={shop}
      orders={orders}
      products={products}
      categories={categories}
      totalRevenue={totalRevenue}
      todayOrdersCount={todayOrders.length}
      activeProductsCount={activeProducts.length}
      pendingOrdersCount={pendingOrders.length}
    />
  );
}
