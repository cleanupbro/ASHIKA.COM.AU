import { Product, ProductCategory } from '@/types';

// Stock images from Pexels - ALL VERIFIED WORKING IDs
export const STOCK_IMAGES = {
  sarees: [
    'https://images.pexels.com/photos/7442282/pexels-photo-7442282.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/7442282/pexels-photo-7442282.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/7442282/pexels-photo-7442282.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  ],
  lehengas: [
    'https://images.pexels.com/photos/8881954/pexels-photo-8881954.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/8750043/pexels-photo-8750043.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/8881954/pexels-photo-8881954.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/8750043/pexels-photo-8750043.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  ],
  sherwanis: [
    'https://images.pexels.com/photos/28758797/pexels-photo-28758797.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/28758797/pexels-photo-28758797.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/28758797/pexels-photo-28758797.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/28758797/pexels-photo-28758797.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  ],
  salwar_kameez: [
    'https://images.pexels.com/photos/7442282/pexels-photo-7442282.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/7442282/pexels-photo-7442282.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
    'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  ],
  hero: [
    'https://images.pexels.com/photos/7442282/pexels-photo-7442282.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop',
    'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop',
  ],
  categories: {
    saree: 'https://images.pexels.com/photos/7442282/pexels-photo-7442282.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
    lehenga: 'https://images.pexels.com/photos/8881954/pexels-photo-8881954.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
    sherwani: 'https://images.pexels.com/photos/28758797/pexels-photo-28758797.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
    salwar_kameez: 'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
};

// Helper to create mock product
function createProduct(
  id: string,
  name: string,
  category: ProductCategory,
  rentalPrice: number,
  retailPrice: number,
  imageIndex: number,
  options: Partial<Product> = {}
): Product {
  const images = STOCK_IMAGES[category === 'salwar_kameez' ? 'salwar_kameez' :
    category === 'sherwani' ? 'sherwanis' :
    category === 'lehenga' ? 'lehengas' : 'sarees'];

  const image = images[imageIndex % images.length];

  return {
    id,
    sku: `ASH-${category.substring(0, 3).toUpperCase()}-${id.padStart(3, '0')}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    category,
    subcategory: options.subcategory,
    occasion: options.occasion || ['wedding', 'festival'],
    color: options.color || 'red',
    colors: options.colors || [options.color || 'red'],
    rental_price: rentalPrice,
    retail_price: retailPrice,
    tier: rentalPrice >= 150 ? 'premium' : 'lite',
    sizes: options.sizes || [
      { size: 'S', quantity: 2, available: 2 },
      { size: 'M', quantity: 3, available: 2 },
      { size: 'L', quantity: 2, available: 1 },
      { size: 'XL', quantity: 1, available: 1 },
    ],
    description: options.description || `Beautiful ${name} perfect for special occasions.`,
    fabric: options.fabric || 'Pure Silk',
    work: options.work || 'Zari',
    blouse_included: options.blouse_included ?? (category === 'saree' || category === 'lehenga'),
    accessories_included: options.accessories_included || [],
    images: [image],
    thumbnail: image,
    status: 'available',
    featured: options.featured || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Mock products database
export const products: Product[] = [
  // Sarees
  createProduct('1', 'Royal Blue Banarasi Silk Saree', 'saree', 129, 650, 0, {
    color: 'blue',
    colors: ['blue', 'gold'],
    subcategory: 'banarasi',
    work: 'Zari Work',
    featured: true,
    description: 'Exquisite Banarasi silk saree with intricate zari work, perfect for weddings and special occasions.',
  }),
  createProduct('2', 'Red Kanjeevaram Bridal Saree', 'saree', 189, 950, 1, {
    color: 'red',
    colors: ['red', 'gold'],
    subcategory: 'kanjeevaram',
    work: 'Temple Border',
    featured: true,
    occasion: ['wedding'],
    description: 'Traditional Kanjeevaram silk saree with temple border, ideal for South Indian weddings.',
  }),
  createProduct('3', 'Emerald Green Silk Saree', 'saree', 99, 450, 2, {
    color: 'green',
    colors: ['green', 'gold'],
    work: 'Embroidery',
    occasion: ['festival', 'party'],
  }),
  createProduct('4', 'Pink Chiffon Party Saree', 'saree', 79, 350, 3, {
    color: 'pink',
    fabric: 'Chiffon',
    work: 'Sequins',
    occasion: ['party', 'engagement'],
  }),
  createProduct('5', 'Gold Tissue Saree', 'saree', 149, 700, 4, {
    color: 'gold',
    fabric: 'Tissue',
    work: 'Self Work',
    featured: true,
    occasion: ['wedding', 'reception'],
  }),
  createProduct('6', 'Purple Georgette Saree', 'saree', 89, 400, 5, {
    color: 'purple',
    fabric: 'Georgette',
    work: 'Stone Work',
    occasion: ['party', 'sangeet'],
  }),

  // Lehengas
  createProduct('7', 'Maroon Bridal Lehenga', 'lehenga', 249, 1200, 0, {
    color: 'maroon',
    colors: ['maroon', 'gold'],
    subcategory: 'bridal',
    work: 'Heavy Embroidery',
    featured: true,
    occasion: ['wedding'],
    accessories_included: ['dupatta'],
    description: 'Stunning bridal lehenga with heavy hand embroidery, perfect for the big day.',
  }),
  createProduct('8', 'Teal Blue Designer Lehenga', 'lehenga', 179, 850, 1, {
    color: 'teal',
    colors: ['teal', 'silver'],
    work: 'Mirror Work',
    occasion: ['sangeet', 'reception'],
    accessories_included: ['dupatta'],
  }),
  createProduct('9', 'Pink Floral Lehenga', 'lehenga', 149, 700, 2, {
    color: 'pink',
    work: 'Floral Embroidery',
    occasion: ['mehendi', 'engagement'],
    accessories_included: ['dupatta'],
  }),
  createProduct('10', 'Navy Blue Party Lehenga', 'lehenga', 119, 550, 3, {
    color: 'navy',
    colors: ['navy', 'gold'],
    work: 'Sequin Work',
    occasion: ['party', 'sangeet'],
    accessories_included: ['dupatta'],
  }),

  // Sherwanis
  createProduct('11', 'Ivory Wedding Sherwani', 'sherwani', 199, 900, 0, {
    color: 'ivory',
    colors: ['ivory', 'gold'],
    work: 'Thread Work',
    featured: true,
    occasion: ['wedding'],
    blouse_included: false,
    accessories_included: ['stole', 'churidar'],
    description: 'Elegant ivory sherwani with golden thread work, perfect for grooms.',
  }),
  createProduct('12', 'Maroon Royal Sherwani', 'sherwani', 179, 850, 1, {
    color: 'maroon',
    work: 'Zardozi',
    occasion: ['wedding', 'reception'],
    blouse_included: false,
    accessories_included: ['stole'],
  }),
  createProduct('13', 'Black Indo-Western Sherwani', 'sherwani', 149, 700, 2, {
    color: 'black',
    colors: ['black', 'silver'],
    subcategory: 'indo-western',
    work: 'Modern Cut',
    occasion: ['reception', 'party'],
    blouse_included: false,
  }),
  createProduct('14', 'Navy Blue Classic Sherwani', 'sherwani', 129, 600, 3, {
    color: 'navy',
    work: 'Self Jacquard',
    occasion: ['wedding', 'engagement'],
    blouse_included: false,
    accessories_included: ['churidar'],
  }),

  // Salwar Kameez
  createProduct('15', 'Red Anarkali Suit', 'salwar_kameez', 109, 500, 0, {
    color: 'red',
    subcategory: 'anarkali',
    work: 'Embroidery',
    featured: true,
    occasion: ['festival', 'party'],
    accessories_included: ['dupatta'],
    description: 'Flowing Anarkali suit with intricate embroidery, perfect for festive occasions.',
  }),
  createProduct('16', 'Yellow Sharara Set', 'salwar_kameez', 129, 600, 1, {
    color: 'yellow',
    subcategory: 'sharara',
    work: 'Gota Patti',
    occasion: ['mehendi', 'haldi'],
    accessories_included: ['dupatta'],
  }),
  createProduct('17', 'Mint Green Palazzo Suit', 'salwar_kameez', 89, 400, 2, {
    color: 'mint',
    subcategory: 'palazzo',
    work: 'Thread Work',
    occasion: ['casual', 'festival'],
    accessories_included: ['dupatta'],
  }),
  createProduct('18', 'Peach Straight Cut Suit', 'salwar_kameez', 79, 350, 3, {
    color: 'peach',
    subcategory: 'straight',
    fabric: 'Cotton Silk',
    work: 'Print',
    occasion: ['casual', 'office'],
    accessories_included: ['dupatta'],
  }),

  // Additional featured items
  createProduct('19', 'Wine Red Velvet Saree', 'saree', 169, 800, 0, {
    color: 'wine',
    fabric: 'Velvet',
    work: 'Stone Border',
    featured: true,
    occasion: ['wedding', 'winter party'],
  }),
  createProduct('20', 'Mustard Festive Lehenga', 'lehenga', 159, 750, 1, {
    color: 'mustard',
    work: 'Mirror & Thread',
    featured: true,
    occasion: ['festival', 'garba'],
    accessories_included: ['dupatta'],
  }),
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function filterProducts(filters: {
  category?: ProductCategory;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  occasions?: string[];
}): Product[] {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.priceMin && p.rental_price < filters.priceMin) return false;
    if (filters.priceMax && p.rental_price > filters.priceMax) return false;
    if (filters.colors?.length && !filters.colors.some((c) => p.colors.includes(c))) return false;
    if (filters.occasions?.length && !filters.occasions.some((o) => p.occasion.includes(o))) return false;
    return true;
  });
}
