import Link from 'next/link';
import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getProductsByShop, getCategoriesByShop } from '@/lib/strapi';
import ProductListClient from '@/components/dashboard/products/ProductListClient';

export default async function ProductsPage() {
  const token = await getAuthToken();

  if (!token) {
    return <div>Unauthorized</div>;
  }

  const shopId = await getUserShopId(token);

  if (!shopId) {
    return <div>No shop found</div>;
  }

  const [products, categories] = await Promise.all([
    getProductsByShop(shopId, { token }),
    getCategoriesByShop(shopId, token),
  ]);

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<number, string>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Catalog
              </p>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Manage your product catalog with advanced filtering and search
          </p>
        </div>
        <Link
          href="/dashboard/products/create"
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Client-side product list with search and filters */}
      <ProductListClient
        products={products}
        categories={categories}
        categoryMap={categoryMap}
      />
    </div>
  );
}
