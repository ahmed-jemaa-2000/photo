import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductsByShop, getCategoriesByShop } from '@/lib/strapi';
import Hero from '@/components/storefront/Hero';
import CategoryNav from '@/components/storefront/CategoryNav';
import ProductGrid from '@/components/storefront/ProductGrid';
import ValueProposition from '@/components/storefront/ValueProposition';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export default async function StorefrontPage() {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  const [products, categories] = await Promise.all([
    getProductsByShop(shop.id, { active: true }),
    getCategoriesByShop(shop.id),
  ]);

  const featuredProducts = products.filter((p) => p.isFeatured);

  const trustBadges = [
    { icon: Truck, label: 'Free Shipping' },
    { icon: ShieldCheck, label: 'Secure Payment' },
    { icon: RotateCcw, label: 'Easy Returns' },
    { icon: Headphones, label: '24/7 Support' },
  ];

  return (
    <div className="storefront-home">
      {/* Hero Section */}
      <Hero shop={shop} featuredProducts={featuredProducts} />

      {/* Compact Trust Bar */}
      <div className="bg-white border-b border-gray-100">
        <Container>
          <div className="flex items-center justify-center md:justify-between gap-6 md:gap-8 py-4 overflow-x-auto scrollbar-hide">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600 whitespace-nowrap">
                <badge.icon className="w-4 h-4 text-primary" strokeWidth={2} />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Category Navigation */}
      {categories.length > 0 && (
        <CategoryNav categories={categories} />
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <Section background="white" spacing="lg">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full mb-4">
                Handpicked for You
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our most loved pieces, curated just for you
              </p>
            </div>
            <ProductGrid products={featuredProducts.slice(0, 4)} shop={shop} />
          </Container>
        </Section>
      )}

      {/* All Products Section */}
      <Section background="gray" spacing="lg">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500 bg-gray-200 rounded-full mb-4">
                Full Catalog
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">All Products</h2>
            </div>
            <p className="text-gray-500 hidden md:block">
              {products.length} items available
            </p>
          </div>
          <ProductGrid products={products} shop={shop} />
        </Container>
      </Section>

      {/* Value Proposition Section */}
      <ValueProposition />
    </div>
  );
}
