// app/products/loading.js - עמוד טעינה
export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="h-8 bg-gray-300 rounded-lg w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            
            <div className="flex justify-center gap-8 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Product Card Skeleton
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 animate-pulse relative">
        <div className="absolute top-3 left-3 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300 rounded animate-pulse"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Vendor */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-yellow-200 rounded w-16 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="h-6 bg-orange-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-orange-200 rounded-lg animate-pulse"></div>
          <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}