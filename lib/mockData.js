// Mock products data with SVG placeholders only
const createProductImage = (id, category = 'product') => {
  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  const icons = ['📱', '💻', '🎧', '📷', '⌚', '🔋', '💡', '🎮', '📺', '🖥️'];
  
  const colorIndex = (id?.length || 0) % colors.length;
  const iconIndex = (id?.length || 0) % icons.length;
  const color = colors[colorIndex];
  const icon = icons[iconIndex];
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" 
            font-family="system-ui" font-size="48" fill="white">
        ${icon}
      </text>
      <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" 
            font-family="system-ui" font-size="14" fill="white" opacity="0.8">
        ${category}
      </text>
    </svg>
  `)}`;
};

export const mockProducts = [
  {
    _id: '1',
    title: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    recommendation: 'Perfect for music lovers and commuters',
    price: 45.99,
    originalPrice: 79.99,
    rating: 4.5,
    displayImage: createProductImage('1', 'Audio'),
    affiliateLink: 'https://aliexpress.com/item/1234567890.html',
    vendor: { name: 'TechStore' }
  },
  {
    _id: '2',
    title: 'Smart Watch Fitness Tracker',
    description: 'Track your health and fitness with this advanced smartwatch',
    recommendation: 'Great for fitness enthusiasts',
    price: 89.99,
    originalPrice: 149.99,
    rating: 4.3,
    displayImage: createProductImage('2', 'Wearable'),
    affiliateLink: 'https://aliexpress.com/item/0987654321.html',
    vendor: { name: 'FitnessTech' }
  },
  {
    _id: '3',
    title: 'Portable Phone Charger',
    description: 'Fast charging power bank for all your devices',
    recommendation: 'Essential for travel and long days',
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.7,
    displayImage: createProductImage('3', 'Power'),
    affiliateLink: 'https://aliexpress.com/item/1122334455.html',
    vendor: { name: 'PowerUp' }
  },
  {
    _id: '4',
    title: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels',
    recommendation: 'Perfect for home office setup',
    price: 32.99,
    originalPrice: 54.99,
    rating: 4.4,
    displayImage: createProductImage('4', 'Lighting'),
    affiliateLink: 'https://aliexpress.com/item/5566778899.html',
    vendor: { name: 'LightCorp' }
  },
  {
    _id: '5',
    title: 'Kitchen Scale Digital',
    description: 'Precise digital kitchen scale for cooking and baking',
    recommendation: 'Must-have for precision cooking',
    price: 19.99,
    originalPrice: 34.99,
    rating: 4.6,
    displayImage: createProductImage('5', 'Kitchen'),
    affiliateLink: 'https://aliexpress.com/item/9988776655.html',
    vendor: { name: 'KitchenPro' }
  },
  {
    _id: '6',
    title: 'Bluetooth Speaker Waterproof',
    description: 'Portable waterproof Bluetooth speaker with great sound',
    recommendation: 'Perfect for outdoor activities',
    price: 67.99,
    originalPrice: 99.99,
    rating: 4.8,
    displayImage: createProductImage('6', 'Audio'),
    affiliateLink: 'https://aliexpress.com/item/4433221100.html',
    vendor: { name: 'SoundWave' }
  }
];

const productNames = [
  'Wireless Bluetooth Earbuds', 'Smart Phone Case', 'USB-C Cable', 'Portable Speaker',
  'Fitness Tracker', 'Phone Stand', 'Car Mount', 'Screen Protector',
  'Wireless Charger', 'Bluetooth Mouse', 'Keyboard Cover', 'Laptop Stand',
  'LED Strip Lights', 'Phone Ring Holder', 'Car Charger', 'Power Bank',
  'Selfie Stick', 'Phone Lens Kit', 'Wireless Adapter', 'Cable Organizer'
];

const categories = ['Electronics', 'Accessories', 'Home', 'Fashion', 'Sports'];
const brands = ['TechPro', 'SmartLife', 'PowerMax', 'StyleCorp', 'FitGear'];

export const generateMockProducts = (count = 20) => {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const basePrice = Math.round((Math.random() * 80 + 20) * 100) / 100;
    const originalPrice = Math.round(basePrice * (1.2 + Math.random() * 0.8) * 100) / 100;
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    products.push({
      _id: `mock-${Date.now()}-${i}`,
      title: productNames[Math.floor(Math.random() * productNames.length)] + ` v${i}`,
      description: `High-quality product with excellent features and reliable performance`,
      recommendation: `Highly recommended for its quality and value`,
      price: basePrice,
      originalPrice: originalPrice,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      displayImage: createProductImage(`mock-${i}`, category),
      affiliateLink: `https://aliexpress.com/item/${Math.random().toString().substr(2, 10)}.html`,
      vendor: { name: brands[Math.floor(Math.random() * brands.length)] },
      category: category
    });
  }
  
  return products;
};
