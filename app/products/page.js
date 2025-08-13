// app/products/page.js
import { Suspense } from 'react';
import ProductsGrid from '@/components/product-viewer/ProductsGrid';
import ProductsLoading from './loading';

// SEO Metadata
export const metadata = {
  title: 'מוצרים מומלצים',
  description: 'גלו את המוצרים הכי שווים מאלי אקספרס עם המלצות אישיות ממומחים',
  openGraph: {
    title: 'מוצרים מומלצים | Buy Wise',
    description: 'גלו את המוצרים הכי שווים מאלי אקספרס',
    type: 'website',
  },
};

// פונקציה שרצה בשרת ומביאה נתונים
async function getProducts(searchParams) {
  try {
    const params = new URLSearchParams({
      page: searchParams?.page || 1,
      limit: 20,
      category: searchParams?.category || '',
      sort: searchParams?.sort || 'newest',
      search: searchParams?.q || '',
    });
    
    // קריאה ל-API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    const response = await fetch(
      `${apiUrl}/full-products?${params}`,
      {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return { products: [], total: 0 };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}

export default async function ProductsPage({ searchParams }) {
  const { products, total } = await getProducts(searchParams);
  
  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-white py-8 sm:py-12">
        <div className="container-custom">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
            <span className="text-gradient">מוצרים מומלצים</span>
          </h1>
          <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
            המוצרים הכי שווים מאלי אקספרס, נבחרו בקפידה על ידי המומחים שלנו
          </p>
        </div>
      </section>
      
      <section className="section-padding">
        <div className="container-custom">
          <Suspense fallback={<ProductsLoading />}>
            <ProductsGrid 
              initialProducts={products || []}
              totalProducts={total || 0}
              currentPage={searchParams?.page || 1}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
