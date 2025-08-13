import { Suspense } from 'react';
import ProductsGrid from '@/components/product-viewer/ProductsGrid';
import ProductsLoading from './loading';

export const metadata = {
  title: 'Products',
  description: 'Best products from AliExpress'
};

async function getProducts(searchParams) {
  try {
    const params = new URLSearchParams({
      page: searchParams?.page || 1,
      limit: 20
    });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    const response = await fetch(`${apiUrl}/full-products?${params}`, {
      next: { revalidate: 60 }
    });
    if (!response.ok) return { products: [], total: 0 };
    return await response.json();
  } catch (error) {
    return { products: [], total: 0 };
  }
}

export default async function ProductsPage({ searchParams }) {
  const { products, total } = await getProducts(searchParams);
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Products</h1>
      <Suspense fallback={<ProductsLoading />}>
        <ProductsGrid initialProducts={products || []} totalProducts={total || 0} currentPage={1} />
      </Suspense>
    </main>
  );
}
