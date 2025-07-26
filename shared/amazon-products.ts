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
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'soil',
    tags: ['cactus', 'succulent', 'potting-mix', 'drainage'],
    rating: 4.4,
    reviewCount: 8432
  },
  {
    id: 'black-gold-cactus-mix',
    title: 'Black Gold Cactus Mix',
    description: 'Premium succulent and cactus potting soil with perlite and pumice for optimal drainage',
    price: '$16.99',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'soil',
    tags: ['premium', 'cactus', 'succulent', 'perlite', 'pumice'],
    rating: 4.6,
    reviewCount: 2841
  },

  // Pots & Containers
  {
    id: 'terracotta-cactus-pots',
    title: 'Terracotta Cactus Pots Set of 6',
    description: 'Ceramic planters with drainage holes and saucers, perfect for small cacti and succulents',
    price: '$24.99',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'pots',
    tags: ['terracotta', 'drainage', 'small-plants', 'ceramic'],
    rating: 4.5,
    reviewCount: 1823
  },
  {
    id: 'ceramic-succulent-planters',
    title: 'Modern Ceramic Succulent Planters with Bamboo Trays',
    description: 'Set of 4 white ceramic pots with drainage holes and bamboo saucers',
    price: '$31.99',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'pots',
    tags: ['ceramic', 'modern', 'bamboo', 'white', 'set'],
    rating: 4.7,
    reviewCount: 3241
  },

  // Tools & Equipment
  {
    id: 'succulent-tool-kit',
    title: 'Succulent Tools Set - 15 Pieces',
    description: 'Complete mini garden hand tools kit for succulents, cacti transplanting and maintenance',
    price: '$18.99',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'tools',
    tags: ['tools', 'transplanting', 'maintenance', 'mini-garden'],
    rating: 4.3,
    reviewCount: 5671
  },
  {
    id: 'cactus-tongs',
    title: 'Stainless Steel Cactus Tongs',
    description: 'Professional grade tongs for safely handling spiny cacti and succulents',
    price: '$14.95',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'tools',
    tags: ['safety', 'tongs', 'stainless-steel', 'spines'],
    rating: 4.8,
    reviewCount: 892
  },

  // Fertilizer & Care
  {
    id: 'schultz-cactus-fertilizer',
    title: 'Schultz Cactus Plus Liquid Plant Food',
    description: '2-10-10 fertilizer specially formulated for cacti and succulents',
    price: '$8.47',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'fertilizer',
    tags: ['liquid', 'fertilizer', '2-10-10', 'schultz'],
    rating: 4.4,
    reviewCount: 2156
  },

  // Books & Guides
  {
    id: 'cactus-encyclopedia',
    title: 'The Cactus Expert: The World\'s Most Popular Cactus Book',
    description: 'Comprehensive guide to growing and caring for cacti and succulents',
    price: '$19.95',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
    category: 'books',
    tags: ['guide', 'encyclopedia', 'care', 'expert'],
    rating: 4.6,
    reviewCount: 1432
  },

  // Grow Lights
  {
    id: 'led-grow-light',
    title: 'LED Grow Light for Indoor Plants',
    description: 'Full spectrum LED grow light perfect for succulents and cacti, 3 modes & timer',
    price: '$29.99',
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
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
    imageUrl: '/api/placeholder/150/150',
    affiliateUrl: 'https://amzn.to/ADD_YOUR_AFFILIATE_ID',
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
    
    case 'care':
      return amazonProducts.filter(p => 
        ['fertilizer', 'lights', 'watering'].includes(p.category)
      ).slice(0, 4);
    
    case 'home':
      return amazonProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    
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