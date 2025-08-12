// app/products/page.js
import { Suspense } from 'react';
import ProductsGrid from '@/components/product-viewer/ProductsGrid';
import ProductsLoading from './loading';
import { fetchProducts } from '@/services/api/products';

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
    const params = {
      page: searchParams?.page || 1,
      limit: 20,
      category: searchParams?.category,
      sort: searchParams?.sort || 'newest',
      search: searchParams?.q,
    };
    
    // קריאה ל-API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/full-products?${new URLSearchParams(params)}`,
      {
        next: { 
          revalidate: 60 // רענון כל דקה
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}

// הקומפוננטה הראשית - Server Component
export default async function ProductsPage({ searchParams }) {
  // הנתונים נטענים בשרת!
  const { products, total } = await getProducts(searchParams);
  
  // Structured Data for Products List
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'Product',
      position: index + 1,
      name: product.title,
      description: product.recommendation || product.description,
      image: product.displayImage,
      offers: {
        '@type': 'Offer',
        price: product.price || 0,
        priceCurrency: 'ILS',
        availability: 'https://schema.org/InStock',
      },
    })),
  };
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Main Content */}
      <main className="min-h-screen">
        {/* Header Section */}
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
        
        {/* Filters Section (Client Component) */}
        <Suspense fallback={<div className="h-16" />}>
          {/* נוסיף את ProductFilters כאן */}
        </Suspense>
        
        {/* Products Grid */}
        <section className="section-padding">
          <div className="container-custom">
            <Suspense fallback={<ProductsLoading />}>
              <ProductsGrid 
                initialProducts={products}
                totalProducts={total}
                currentPage={searchParams?.page || 1}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}