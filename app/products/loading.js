// app/products/loading.js
export default function ProductsLoading() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-8 sm:py-12">
        <div className="container-custom">
          <div className="h-12 w-64 mx-auto bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 max-w-full mx-auto bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </section>
      
      {/* Products Grid Skeleton */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="product-grid">
            {[...Array(6)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Product Card Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        
        {/* Price */}
        <div className="flex items-center gap-2 mt-4">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-full mt-4" />
      </div>
    </div>
  );
}