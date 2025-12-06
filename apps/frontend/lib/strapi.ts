import qs from 'qs';
import type {
  Shop,
  Product,
  Category,
  Order,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from '@busi/types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function getStrapiURL() {
  return STRAPI_URL;
}

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Generic Strapi API fetch wrapper
 */
async function fetchAPI<T>(
  path: string,
  options: FetchOptions = {},
  query?: Record<string, any>
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers as HeadersInit | undefined);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const queryString = query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : '';
  const url = `${STRAPI_URL}/api${path}${queryString}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[fetchAPI] Error response', {
      url,
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    const error = (() => {
      try {
        return JSON.parse(errorText);
      } catch {
        return {};
      }
    })();
    throw new Error(error.error?.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Transform Strapi response to simple format
 */
function transformStrapiData<T>(data: any): T {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => transformStrapiData(item)) as T;
  }

  if (data.attributes) {
    const { id, attributes } = data;
    const transformed: any = { id, ...attributes };

    // Transform nested relations
    Object.keys(attributes).forEach((key) => {
      if (attributes[key]?.data) {
        transformed[key] = transformStrapiData(attributes[key].data);
      }
    });

    return transformed;
  }

  return data;
}

// ==================== SHOP APIs ====================

export async function getShopBySubdomain(subdomain: string): Promise<Shop | null> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Shop>>('/shops', {
      cache: 'no-store',
    }, {
      filters: {
        subdomain: {
          $eq: subdomain,
        },
      },
      populate: ['logo', 'owner'],
    });

    if (response.data && response.data.length > 0) {
      return transformStrapiData<Shop>(response.data[0]);
    }

    return null;
  } catch (error) {
    console.error('Error fetching shop by subdomain:', error);
    return null;
  }
}

export async function getShopById(id: number, token?: string): Promise<Shop | null> {
  try {
    const response = await fetchAPI<StrapiSingleResponse<Shop>>(
      `/shops/${id}`,
      { token },
      { populate: ['logo', 'owner'] }
    );

    return transformStrapiData<Shop>(response.data);
  } catch (error) {
    console.error('Error fetching shop by ID:', error);
    return null;
  }
}

export async function updateShop(id: number, data: Partial<Shop>, token: string): Promise<Shop> {
  const response = await fetchAPI<StrapiSingleResponse<Shop>>(
    `/shops/${id}`,
    {
      method: 'PUT',
      token,
      body: JSON.stringify({ data }),
    }
  );

  return transformStrapiData<Shop>(response.data);
}

// ==================== PRODUCT APIs ====================

export async function getProductsByShop(
  shopId: number,
  options: {
    featured?: boolean;
    active?: boolean;
    categoryId?: number;
    token?: string;
  } = {}
): Promise<Product[]> {
  try {
    console.log('[getProductsByShop] Called with shopId:', shopId, 'token:', options.token ? 'exists' : 'missing');

    const filters: any = {
      shop: {
        id: {
          $eq: shopId,
        },
      },
    };

    if (options.featured) {
      filters.isFeatured = { $eq: true };
    }

    if (options.active !== undefined) {
      filters.isActive = { $eq: options.active };
    }

    if (options.categoryId) {
      filters.category = {
        id: {
          $eq: options.categoryId,
        },
      };
    }

    const response = await fetchAPI<StrapiCollectionResponse<Product>>('/products', {
      cache: 'no-store',
      token: options.token,
    }, {
      filters,
      populate: ['images', 'category', 'shop'],
      sort: ['createdAt:desc'],
    });

    return transformStrapiData<Product[]>(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string, shopId: number): Promise<Product | null> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Product>>('/products', {
      cache: 'no-store',
    }, {
      filters: {
        slug: {
          $eq: slug,
        },
        shop: {
          id: {
            $eq: shopId,
          },
        },
      },
      populate: ['images', 'category', 'shop'],
    });

    if (response.data && response.data.length > 0) {
      return transformStrapiData<Product>(response.data[0]);
    }

    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getProductById(id: number, token?: string): Promise<Product | null> {
  try {
    const response = await fetchAPI<StrapiSingleResponse<Product>>(
      `/products/${id}`,
      { token },
      { populate: ['images', 'category', 'shop'] }
    );

    return transformStrapiData<Product>(response.data);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export async function createProduct(data: FormData, token: string): Promise<Product> {
  const response = await fetch(`${STRAPI_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  const result = await response.json();
  return transformStrapiData<Product>(result.data);
}

export async function updateProduct(id: number, data: FormData, token: string): Promise<Product> {
  const response = await fetch(`${STRAPI_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  const result = await response.json();
  return transformStrapiData<Product>(result.data);
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  await fetchAPI(`/products/${id}`, {
    method: 'DELETE',
    token,
  });
}

// ==================== CATEGORY APIs ====================

export async function getCategoriesByShop(shopId: number, token?: string): Promise<Category[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Category>>('/categories', {
      cache: token ? 'no-store' : 'default',
      token,
    }, {
      filters: {
        shop: {
          id: {
            $eq: shopId,
          },
        },
      },
      sort: ['sortOrder:asc', 'name:asc'],
      populate: ['shop'],
    });

    return transformStrapiData<Category[]>(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[\s\_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || `category-${Date.now()}`;
}

export async function createCategory(
  data: { name: string; sortOrder: number; shop: number },
  token: string
): Promise<Category> {
  const payload = {
    ...data,
    slug: slugify(data.name),
  };

  const response = await fetchAPI<StrapiSingleResponse<Category>>('/categories', {
    method: 'POST',
    token,
    body: JSON.stringify({ data: payload }),
  });

  return transformStrapiData<Category>(response.data);
}

export async function updateCategory(
  id: number,
  data: Partial<Category>,
  token: string
): Promise<Category> {
  const response = await fetchAPI<StrapiSingleResponse<Category>>(
    `/categories/${id}`,
    {
      method: 'PUT',
      token,
      body: JSON.stringify({ data }),
    }
  );

  return transformStrapiData<Category>(response.data);
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  await fetchAPI(`/categories/${id}`, {
    method: 'DELETE',
    token,
  });
}

// ==================== ORDER APIs ====================

export async function getOrdersByShop(shopId: number, token: string): Promise<Order[]> {
  try {
    const response = await fetchAPI<StrapiCollectionResponse<Order>>('/orders', {
      cache: 'no-store',
      token,
    }, {
      filters: {
        shop: {
          id: {
            $eq: shopId,
          },
        },
      },
      populate: ['items.product', 'shop'],
      sort: ['createdAt:desc'],
    });

    return transformStrapiData<Order[]>(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function createOrder(data: Partial<Order>, token?: string): Promise<Order> {
  const response = await fetchAPI<StrapiSingleResponse<Order>>(
    '/orders',
    {
      method: 'POST',
      token,
      body: JSON.stringify({ data }),
    }
  );

  return transformStrapiData<Order>(response.data);
}

export async function updateOrder(
  id: number,
  data: Partial<Order>,
  token: string
): Promise<Order> {
  const response = await fetchAPI<StrapiSingleResponse<Order>>(
    `/orders/${id}`,
    {
      method: 'PUT',
      token,
      body: JSON.stringify({ data }),
    }
  );

  return transformStrapiData<Order>(response.data);
}

// ==================== MEDIA APIs ====================

export function getStrapiMediaUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

// ==================== UPLOAD APIs ====================

export async function uploadFile(file: File, token: string): Promise<any> {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}

export async function deleteFile(fileId: number, token: string): Promise<void> {
  await fetch(`${STRAPI_URL}/api/upload/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}
