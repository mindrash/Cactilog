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
    id: 'spike-bloom-mycorrhizal-soil',
    title: 'High Drainage Cactus Soil with Mycorrhizal Fungi',
    description: 'Premium 8-pound cactus potting mix with beneficial mycorrhizal fungi for healthy root development',
    price: '$34.99',
    imageUrl: 'https://m.media-amazon.com/images/I/810gpZuEcxL._AC_SX425_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B0BLF6QR2C?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'soil',
    tags: ['mycorrhizal', 'drainage', 'premium', 'root-health', '8-pounds'],
    rating: 4.7,
    reviewCount: 892
  },
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
    imageUrl: 'https://m.media-amazon.com/images/I/81D1Rs8OvLL._AC_SY679_.jpg',
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
    imageUrl: 'https://m.media-amazon.com/images/I/61VdJbibWkL._AC_SX355_.jpg',
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
    imageUrl: 'https://m.media-amazon.com/images/I/71m0nCAY3-L._SS100_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B083QM4VWF?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'watering',
    tags: ['precision', 'stainless-steel', 'long-spout', 'indoor'],
    rating: 4.5,
    reviewCount: 1876
  },

  // Additional Premium Soil Options
  {
    id: 'organic-succulent-soil-mix',
    title: 'Succulent Potting Soil - Organic Mix',
    description: 'Professionally formulated organic soil mix with proper drainage and pH balance for all succulents',
    price: '$18.99',
    imageUrl: 'https://m.media-amazon.com/images/I/81TnFx4Dt-L._AC_SY879_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B09LM26JFF?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'soil',
    tags: ['organic', 'ph-balanced', 'professional', 'drainage'],
    rating: 4.5,
    reviewCount: 2456
  },
  {
    id: 'back-to-roots-organic',
    title: 'Back to the Roots Organic Succulent & Cactus Mix',
    description: '100% organic 6-quart mix made in USA for indoor and outdoor plants',
    price: '$15.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71XhD8FcF6L._AC_SY879_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07M8Q4QZ4?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'soil',
    tags: ['organic', 'usa-made', 'indoor-outdoor', '6-quart'],
    rating: 4.6,
    reviewCount: 1834
  },

  // Premium Tool Sets
  {
    id: 'mini-garden-tool-set-13pc',
    title: '13-Piece Mini Garden Tool Set',
    description: 'Complete succulent care kit with air blower, sharp cutting tools, and precision instruments',
    price: '$19.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71pWkMcYvML._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B091K79W36?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'tools',
    tags: ['13-piece', 'air-blower', 'cutting-tools', 'precision'],
    rating: 4.4,
    reviewCount: 3247
  },
  {
    id: 'songziming-15pc-toolkit',
    title: 'SONGZIMING 15-Piece Succulent Tool Kit',
    description: 'Lightweight practical set with spray bottle, squeeze bottles, and funnel cups',
    price: '$16.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71CqhVx8zDL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07DHHM588?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'tools',
    tags: ['15-piece', 'spray-bottle', 'lightweight', 'funnel-cups'],
    rating: 4.3,
    reviewCount: 2891
  },
  {
    id: 'succulent-organizer-kit',
    title: 'Succulent Kit with Organizer Bag',
    description: 'Complete terrarium supplies with organizer bag for succulent cuttings and fertilizer management',
    price: '$24.99',
    imageUrl: 'https://m.media-amazon.com/images/I/81Uc8b9yDuL._AC_SY355_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07QYCB42M?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'tools',
    tags: ['organizer-bag', 'terrarium', 'cuttings', 'fertilizer-management'],
    rating: 4.5,
    reviewCount: 1567
  },

  // Advanced Fertilizers
  {
    id: 'grow-co-succulent-food',
    title: 'The Grow Co Succulents & Cactus Plant Food',
    description: 'Gentle long-lasting granular formula, slow release fertilizer for 9 months of nutrition',
    price: '$14.99',
    imageUrl: 'https://m.media-amazon.com/images/I/81R4bK3sQOL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B08S7V8L7G?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'fertilizer',
    tags: ['slow-release', '9-months', 'granular', 'gentle'],
    rating: 4.7,
    reviewCount: 4328
  },
  {
    id: 'wiggle-worm-castings',
    title: 'Wiggle Worm Soil Builder Worm Castings',
    description: 'Natural nutrient buffet that plants absorb quickly, organic soil amendment',
    price: '$12.99',
    imageUrl: 'https://m.media-amazon.com/images/I/81YtMxR+IQL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B000BYBD2W?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'fertilizer',
    tags: ['worm-castings', 'organic', 'soil-amendment', 'natural'],
    rating: 4.6,
    reviewCount: 5432
  },

  // Specialized Pots & Containers
  {
    id: 'ceramic-succulent-planters-set',
    title: 'Modern Ceramic Succulent Planters - 4 Pack',
    description: 'Minimalist white ceramic pots with drainage holes and bamboo saucers',
    price: '$28.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61vVyDrOxZL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B08P3QFH4V?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'pots',
    tags: ['ceramic', 'minimalist', 'bamboo-saucers', '4-pack'],
    rating: 4.4,
    reviewCount: 2134
  },
  {
    id: 'terracotta-cactus-pots',
    title: 'Terracotta Cactus Pots with Saucers - 6 Pack',
    description: 'Natural clay pots ideal for cactus drainage with matching terracotta saucers',
    price: '$22.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71KqQxLq5gL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07V3G8J4X?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'pots',
    tags: ['terracotta', 'clay', 'saucers', 'natural-drainage'],
    rating: 4.5,
    reviewCount: 3876
  },
  {
    id: 'hanging-succulent-planters',
    title: 'Hanging Ceramic Succulent Planters - Set of 3',
    description: 'Wall-mounted ceramic planters perfect for air plants and trailing succulents',
    price: '$34.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61HqZ8RxH7L._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B089XJKR4C?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'pots',
    tags: ['hanging', 'wall-mounted', 'air-plants', 'trailing'],
    rating: 4.3,
    reviewCount: 1456
  },

  // Grow Lights & Equipment
  {
    id: 'full-spectrum-grow-light-panel',
    title: 'Full Spectrum LED Grow Light Panel - 45W',
    description: 'Professional LED panel with timer and dimmer for indoor succulents and cacti',
    price: '$49.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61xMk4wJTHL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07CVB8F5P?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'lights',
    tags: ['45w', 'timer', 'dimmer', 'professional'],
    rating: 4.4,
    reviewCount: 8765
  },
  {
    id: 'clip-on-grow-lights',
    title: 'Clip-On LED Grow Lights - Dual Head',
    description: 'Flexible dual-head grow lights with clip for desktop succulent growing',
    price: '$25.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61KqQxL5gL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B08J42FG3K?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'lights',
    tags: ['clip-on', 'dual-head', 'flexible', 'desktop'],
    rating: 4.2,
    reviewCount: 4321
  },

  // Watering & Humidity
  {
    id: 'precision-watering-bottles',
    title: 'Precision Squeeze Watering Bottles - 3 Pack',
    description: 'Clear plastic bottles with bent necks for precise root zone watering',
    price: '$11.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61vVyDOxZL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B07G5K8H9P?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'watering',
    tags: ['squeeze-bottles', 'bent-neck', 'root-zone', '3-pack'],
    rating: 4.3,
    reviewCount: 2876
  },
  {
    id: 'humidity-tray-set',
    title: 'Humidity Trays for Succulents - 4 Pack',
    description: 'Clear plastic humidity trays with pebbles for maintaining proper moisture levels',
    price: '$18.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71pWVlWiQL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B08N4QF7R2?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'watering',
    tags: ['humidity-trays', 'pebbles', 'moisture-control', '4-pack'],
    rating: 4.1,
    reviewCount: 1234
  },

  // Seeds & Propagation
  {
    id: 'cactus-seed-starter-kit',
    title: 'Cactus Seed Starter Kit - 12 Varieties',
    description: 'Complete kit with seeds, soil, pots, and instructions for growing cacti from seed',
    price: '$24.99',
    imageUrl: 'https://m.media-amazon.com/images/I/81YtMxR+QQL._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B09W4K8L3M?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'seeds',
    tags: ['seed-kit', '12-varieties', 'complete-kit', 'instructions'],
    rating: 4.0,
    reviewCount: 987
  },
  {
    id: 'propagation-station',
    title: 'Acrylic Propagation Station with Test Tubes',
    description: 'Clear acrylic stand with glass tubes for water propagation of succulent cuttings',
    price: '$19.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61HqZ8RxS7L._AC_SX569_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B08K5X7Q9P?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'tools',
    tags: ['propagation', 'acrylic', 'test-tubes', 'water-propagation'],
    rating: 4.2,
    reviewCount: 1876
  },

  // Books & Educational
  {
    id: 'cactus-encyclopedia-book',
    title: 'The Cactus and Succulent Encyclopedia',
    description: 'Comprehensive reference with over 1,000 species profiles and care instructions',
    price: '$29.99',
    imageUrl: 'https://m.media-amazon.com/images/I/81etdhhfOL._SY342_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B01F8Q3R4K?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'books',
    tags: ['encyclopedia', '1000-species', 'reference', 'care-instructions'],
    rating: 4.7,
    reviewCount: 2134
  },
  {
    id: 'succulent-identification-guide',
    title: 'Field Guide to Succulent Identification',
    description: 'Portable guide for identifying succulents with photos and botanical names',
    price: '$16.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71KqQxL5gL._SY342_.jpg',
    affiliateUrl: 'https://www.amazon.com/dp/B08R6H2M4P?tag=mindrash-20&linkCode=ogi&th=1&psc=1',
    category: 'books',
    tags: ['field-guide', 'identification', 'portable', 'botanical-names'],
    rating: 4.4,
    reviewCount: 1567
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