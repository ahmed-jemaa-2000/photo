import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductBySlug, getStrapiMediaUrl } from '@/lib/strapi';
import { sanitizeHtml } from '@/lib/sanitize';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';
import ProductImageGallery from '@/components/storefront/ProductImageGallery';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import { ShieldCheck, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';
import * as motion from 'framer-motion/client';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) return {};

  const shop = await getShopBySubdomain(subdomain);
  if (!shop) return {};

  const product = await getProductBySlug(params.slug, shop.id);
  if (!product) return {};

  const imageUrl = product.images && product.images.length > 0
    ? getStrapiMediaUrl(product.images[0].url)
    : null;

  return {
    title: `${product.name} | ${shop.name}`,
    description: product.description ? product.description.substring(0, 160).replace(/<[^>]*>?/gm, '') : `Buy ${product.name} at ${shop.name}`,
    openGraph: {
      title: product.name,
      description: product.description ? product.description.substring(0, 160).replace(/<[^>]*>?/gm, '') : undefined,
      images: imageUrl ? [imageUrl] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  const product = await getProductBySlug(params.slug, shop.id);

  if (!product || !product.isActive) {
    notFound();
  }

  const breadcrumbItems = [{ label: 'Shop', href: '/' }];

  if (product.category) {
    const categoryName = typeof product.category === 'object' ? product.category.name : '';
    const categorySlug = typeof product.category === 'object' ? product.category.slug : '';
    if (categoryName && categorySlug) {
      breadcrumbItems.push({ label: categoryName, href: `/category/${categorySlug}` });
    }
  }

  breadcrumbItems.push({ label: product.name });

  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map(img => getStrapiMediaUrl(img.url)) || [],
    description: product.description ? product.description.replace(/<[^>]*>?/gm, '') : undefined,
    sku: product.id.toString(),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'TND',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: shop.name,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-32 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        {/* Breadcrumbs */}
        <div className="py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-12">
          {/* Left Column: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <ProductImageGallery images={product.images} productName={product.name} />
          </motion.div>

          {/* Right Column: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {product.isFeatured && (
                <Badge variant="warning" className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                  ⭐ Featured
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="error" className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider animate-pulse">
                  🔥 {discountPercentage}% OFF
                </Badge>
              )}
              <Badge className="bg-green-50 text-green-700 border-green-200 rounded-full px-4 py-1.5 text-xs font-medium">
                ✓ In Stock
              </Badge>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-bold text-gradient-premium">
                {product.price} <span className="text-xl text-gray-500">TND</span>
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xl text-gray-400 line-through decoration-2">
                  {product.oldPrice} TND
                </span>
              )}
            </div>

            {/* Trust Badges - Compact */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Fast Delivery' },
                { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50', title: 'Cash on Delivery' },
                { icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Easy Returns' },
                { icon: MessageCircle, color: 'text-amber-600', bg: 'bg-amber-50', title: '24/7 Support' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className={`p-2 ${item.bg} ${item.color} rounded-lg`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.title}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">About this product</h3>
                <div
                  className="prose prose-sm prose-gray max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </div>
            )}

            {/* WhatsApp Order Section - Desktop */}
            <div className="hidden lg:block pt-4">
              <WhatsAppButton product={product} shop={shop} />
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Mobile Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_30px_rgba(0,0,0,0.1)] lg:hidden z-50 safe-area-bottom">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Price</p>
              <p className="text-2xl font-bold text-gradient-premium leading-none">{product.price} <span className="text-sm text-gray-500">TND</span></p>
            </div>
            {product.oldPrice && product.oldPrice > product.price && (
              <div className="text-right">
                <span className="text-sm text-gray-400 line-through">{product.oldPrice} TND</span>
                <span className="ml-2 text-xs font-bold text-green-600">-{discountPercentage}%</span>
              </div>
            )}
          </div>
          <WhatsAppButton product={product} shop={shop} />
        </div>
      </div>
    </div>
  );
}
