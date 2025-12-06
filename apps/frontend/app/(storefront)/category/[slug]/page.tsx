import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductsByShop, getCategoriesByShop } from '@/lib/strapi';
import CategoryNav from '@/components/storefront/CategoryNav';
import ProductGrid from '@/components/storefront/ProductGrid';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  const categories = await getCategoriesByShop(shop.id);
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByShop(shop.id, {
    active: true,
    categoryId: category.id,
  });

  const breadcrumbItems = [
    { label: 'Shop', href: '/' },
    { label: category.name }
  ];

  return (
    <div className="category-page bg-white min-h-screen">
      {/* Category Navigation */}
      <CategoryNav categories={categories} />

      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Category Header */}
        <div className="py-8 md:py-12 border-b border-gray-200 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-gray-600 max-w-3xl">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{products.length}</span> products
              </div>
              {/* Sort Dropdown (Visual Only) */}
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span className="text-sm font-medium">Sort</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <Section spacing="lg">
          <ProductGrid products={products} shop={shop} />
        </Section>
      </Container>
    </div>
  );
}
