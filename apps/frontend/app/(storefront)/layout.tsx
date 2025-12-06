import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getCategoriesByShop } from '@/lib/strapi';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import StorefrontHeader from '@/components/storefront/StorefrontHeader';
import StorefrontFooter from '@/components/storefront/StorefrontFooter';

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export default async function StorefrontLayout({
  children,
}: StorefrontLayoutProps) {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  // Fetch categories for footer navigation
  const categories = await getCategoriesByShop(shop.id);

  return (
    <ThemeProvider shop={shop}>
      <div className="min-h-screen flex flex-col">
        <StorefrontHeader shop={shop} />
        <main className="flex-grow">
          {children}
        </main>
        <StorefrontFooter shop={shop} categories={categories} />
      </div>
    </ThemeProvider>
  );
}
