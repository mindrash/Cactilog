// Amazon affiliate product data for cactus and succulent enthusiasts
export interface AmazonProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  category: 'soil' | 'pots' | 'tools' | 'fertilizer' | 'books' | 'lights' | 'watering' | 'seeds';
  tags: string[];
  rating: number;
  reviewCount: number;
}

export const amazonProducts: AmazonProduct[] = [
  // Soil & Growing Medium
  {
    id: 'miracle-gro-cactus-soil',
    title: 'Miracle-Gro Cactus, Palm & Citrus Potting Mix',
    description: 'Fast-draining formula enriched with forest products for healthy cactus and succulent growth',
    price: '$12.97',
    imageUrl: 'https://m.media-amazon.com/images/I/81D1Rs8OvLL._AC_SY679_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B00GRAJTEK?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'soil',
    tags: ['cactus', 'succulent', 'potting-mix', 'drainage'],
    rating: 4.4,
    reviewCount: 8432
  },
  {
    id: 'harris-premium-cactus-soil',
    title: 'Harris Premium Succulent and Cactus Potting Soil',
    description: 'Fast draining mix with added nutrients, forest humus, pumice, compost and fish bone meal',
    price: '$16.99',
    imageUrl: 'https://m.media-amazon.com/images/I/81iVVjAdYUL._AC_SS115_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B09HHMSM3J?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'soil',
    tags: ['premium', 'cactus', 'succulent', 'nutrients', 'fast-draining'],
    rating: 4.6,
    reviewCount: 2841
  },

  // Pots & Containers
  {
    id: 'zoutog-ceramic-pots',
    title: 'ZOUTOG Succulent Pots 3.1 Inch - 6 Pack',
    description: 'White ceramic flower planters with drainage holes and bamboo tray for indoor plants',
    price: '$24.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61AgupjenjL._AC_SY355_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07DWS4X3Y?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'pots',
    tags: ['ceramic', 'drainage', 'bamboo-tray', 'white', '6-pack'],
    rating: 4.5,
    reviewCount: 1823
  },
  {
    id: 'lamdawn-ceramic-planters',
    title: 'LamDawn Cute Ceramic Succulent Garden Pots',
    description: 'Set of 5 planters with drainage and attached saucer, decorative round design',
    price: '$31.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71m0nCAY3-L._SS100_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B099QGBBN7?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'pots',
    tags: ['ceramic', 'decorative', 'attached-saucer', 'round', '5-pack'],
    rating: 4.7,
    reviewCount: 3241
  },

  // Tools & Equipment
  {
    id: 'mkono-succulent-tools',
    title: 'Mkono Succulent Tools 7pcs Garden Kit',
    description: 'Complete mini garden hand tools with tongs, pruning shears, watering bottles for succulents',
    price: '$18.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61Blda+HRvL._AC_SY300_SX300_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B01GWSBQVA?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'tools',
    tags: ['tools', 'tongs', 'pruning', 'watering', 'mkono'],
    rating: 4.3,
    reviewCount: 5671
  },
  {
    id: 'succulent-tweezers',
    title: 'Long Stainless Steel Tweezers with Curved Tip',
    description: 'Ideal tool for cactus and succulents gardening, removing debris and precise handling',
    price: '$14.95',
    imageUrl: 'https://m.media-amazon.com/images/I/61VdJbibWkL._AC_SX355_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07HQLDZZD?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'tools',
    tags: ['tweezers', 'curved-tip', 'stainless-steel', 'precision'],
    rating: 4.8,
    reviewCount: 892
  },

  // Fertilizer & Care
  {
    id: 'espoma-cactus-mix',
    title: 'Espoma Organic Cactus Potting Mix',
    description: 'Natural & organic soil for cactus, succulent, palm, and citrus with Myco-Tone mycorrhizae',
    price: '$8.47',
    imageUrl: 'https://m.media-amazon.com/images/I/81YQxSvJqZL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07DHX8H39?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'fertilizer',
    tags: ['organic', 'mycorrhizae', 'espoma', 'potting-mix'],
    rating: 4.4,
    reviewCount: 2156
  },

  // Books & Guides
  {
    id: 'succulent-care-book',
    title: 'Succulents Simplified: Growing & Designing',
    description: 'Comprehensive guide to growing and designing with drought-tolerant plants',
    price: '$19.95',
    imageUrl: 'https://m.media-amazon.com/images/I/81etdhhfUOL._SY342_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B01D8JDJ9K?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'books',
    tags: ['succulent', 'design', 'care', 'drought-tolerant'],
    rating: 4.6,
    reviewCount: 1432
  },

  // Grow Lights
  {
    id: 'led-grow-light',
    title: 'LED Grow Light for Indoor Plants',
    description: 'Full spectrum LED grow light perfect for succulents and cacti, 3 modes & timer',
    price: '$29.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61VVN43S7sL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07QWV1KVT?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'lights',
    tags: ['led', 'full-spectrum', 'timer', 'indoor'],
    rating: 4.2,
    reviewCount: 6789
  },

  // Watering
  {
    id: 'watering-can-long-spout',
    title: 'Long Spout Watering Can for Indoor Plants',
    description: 'Stainless steel watering can with precision pour spout for delicate plants',
    price: '$22.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61xC5t3EwZL._AC_SL1500_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B083QM4VWF?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'watering',
    tags: ['precision', 'stainless-steel', 'long-spout', 'indoor'],
    rating: 4.5,
    reviewCount: 1876
  }
];

// Get products by category
export function getProductsByCategory(category: AmazonProduct['category']): AmazonProduct[] {
  return amazonProducts.filter(product => product.category === category);
}

// Get products by tags
export function getProductsByTags(tags: string[]): AmazonProduct[] {
  return amazonProducts.filter(product => 
    tags.some(tag => product.tags.includes(tag))
  );
}

// Get featured products for different page types
export function getFeaturedProducts(context: 'collection' | 'species' | 'care' | 'home'): AmazonProduct[] {
  switch (context) {
    case 'collection':
      return amazonProducts.filter(p => 
        ['pots', 'soil', 'tools'].includes(p.category)
      ).slice(0, 3);
    
    case 'species':
      return amazonProducts.filter(p => 
        ['books', 'tools', 'fertilizer'].includes(p.category)
      ).slice(0, 2);
    
    case 'home':
      // Featured products for the landing page
      return amazonProducts.filter(p => 
        ['soil', 'pots', 'tools'].includes(p.category)
      ).slice(0, 6);
      
    case 'care':
      return amazonProducts.filter(p => 
        ['fertilizer', 'watering', 'books'].includes(p.category)
      ).slice(0, 3);
    
    default:
      return amazonProducts.slice(0, 3);
  }
}

// Get products for specific plant families
export function getProductsForFamily(family: string): AmazonProduct[] {
  if (family === 'Cactaceae') {
    return amazonProducts.filter(p => 
      p.tags.includes('cactus') || ['soil', 'tools', 'pots'].includes(p.category)
    ).slice(0, 4);
  }
  
  // For other succulent families
  return amazonProducts.filter(p => 
    p.tags.includes('succulent') || ['soil', 'tools', 'pots'].includes(p.category)
  ).slice(0, 4);
}