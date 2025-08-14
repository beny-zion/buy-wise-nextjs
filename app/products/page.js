import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import ProductsLoading from './loading';

export const metadata = {
  title: 'מוצרים מומלצים | Buy Wise',
  description: 'גלו את המוצרים הכי שווים מאלי אקספרס',
};

// Server Component - מביא נתונים
async function getProducts() {
  try {
    const response = await fetch('http://localhost:3333/full-products?page=1&limit=20', {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      console.log('Failed to fetch products');
      return [];
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        מוצרים מומלצים
      </h1>
      
      <Suspense fallback={<ProductsLoading />}>
        <ProductsClient initialProducts={products} />
      </Suspense>
    </div>
  );
}
