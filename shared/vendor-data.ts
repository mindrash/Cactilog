// Comprehensive vendor database based on research
// This data will be seeded into the database

export const vendorData = [
  // Live Plants - Premium Nurseries
  {
    name: "Planet Desert",
    description: "Full-service nursery with own-grown plants, wide variety, family-owned operation with competitive pricing. Excellent for both beginners and collectors.",
    website: "https://planetdesert.com",
    location: "Southern California",
    specialties: ["plants", "pots", "supplies", "soil"],
    categories: ["cacti", "succulents", "equipment"],
    reputation: "premium",
    shippingInfo: "Specialized protective packaging for cacti, climate-appropriate shipping schedules, live arrival guarantees",
    priceRange: "moderate",
    isActive: true,
  },
  {
    name: "The Cactus Outlet",
    description: "Large cacti specialist known for Saguaro and barrel cacti. Excellent customer service and large specimen availability.",
    website: "https://www.cactusoutlet.com",
    location: "United States",
    specialties: ["plants", "soil"],
    categories: ["cacti"],
    reputation: "reliable",
    shippingInfo: "Professional grower packaging, specialized large plant shipping",
    priceRange: "moderate",
    isActive: true,
  },
  {
    name: "The Cactus King",
    description: "Expert botanist-run nursery with 250+ species. Offers expert consultation and operates with water-efficient practices.",
    website: "https://thecactusking.com",
    location: "Texas",
    specialties: ["plants", "supplies"],
    categories: ["cacti", "succulents"],
    reputation: "premium",
    shippingInfo: "Expert packaging with cultivation guidance included",
    priceRange: "premium",
    isActive: true,
  },
  {
    name: "California Cactus Center",
    description: "Premium collector plants established in 1976. Known for rare specimens and letter-coded pricing system.",
    website: "https://www.california-cactus-succulents.com",
    location: "Pasadena, CA",
    specialties: ["plants"],
    categories: ["cacti", "succulents"],
    reputation: "premium",
    shippingInfo: "Specialized rare plant packaging and shipping",
    priceRange: "luxury",
    isActive: true,
  },
  {
    name: "Cactus Jungle",
    description: "SF Bay Area specialist focusing on local flora, drought-tolerant plants, and night-blooming varieties.",
    website: "https://cactusjungle.com",
    location: "Berkeley, CA",
    specialties: ["plants", "supplies"],
    categories: ["cacti", "succulents"],
    reputation: "specialty",
    shippingInfo: "Regional specialist with local delivery options",
    priceRange: "moderate",
    isActive: true,
  },

  // Seeds - Specialist Suppliers
  {
    name: "Mesa Garden",
    description: "Premium seed specialist with hand-packed seeds, collection data, and worldwide sourcing. Known for high accuracy and quality.",
    website: "https://mesagarden.com",
    location: "New Mexico",
    specialties: ["seeds"],
    categories: ["cacti", "succulents"],
    reputation: "premium",
    shippingInfo: "Hand-packed seeds with detailed collection data and germination instructions",
    priceRange: "premium",
    isActive: true,
  },
  {
    name: "UnusualSeeds",
    description: "Rare variety specialist focusing on Lithops, mesembs, and caudex plants. Offers frequent discounts and unique specimens.",
    website: "https://unusualseeds.net",
    location: "International",
    specialties: ["seeds"],
    categories: ["succulents"],
    reputation: "specialty",
    shippingInfo: "International shipping with rare variety packaging",
    priceRange: "moderate",
    isActive: true,
  },
  {
    name: "SeedsCactus.com",
    description: "Fresh seed specialist with recently collected seeds ensuring high germination rates. Includes cultivation tutorials.",
    website: "https://seedscactus.com",
    location: "International",
    specialties: ["seeds", "supplies"],
    categories: ["cacti", "succulents"],
    reputation: "reliable",
    shippingInfo: "Fresh seed packaging with cultivation guides",
    priceRange: "moderate",
    isActive: true,
  },
  {
    name: "Cactus Kingdom",
    description: "Canadian seed supplier with fresh harvest and worldwide shipping. Extensive collection with regular updates.",
    website: "https://cactuskingdom.ca",
    location: "Canada",
    specialties: ["seeds"],
    categories: ["cacti", "succulents"],
    reputation: "reliable",
    shippingInfo: "International shipping from Canada with fresh harvest guarantee",
    priceRange: "moderate",
    isActive: true,
  },
  {
    name: "CSSA Seed Depot",
    description: "Cactus and Succulent Society of America seed depot with legally harvested, conservation-focused seeds from member organization.",
    website: "https://shop.cactusandsucculentsociety.org",
    location: "United States",
    specialties: ["seeds"],
    categories: ["cacti", "succulents"],
    reputation: "premium",
    shippingInfo: "Society-sourced seeds with conservation documentation",
    priceRange: "moderate",
    isActive: true,
  },

  // Cuttings & Propagation
  {
    name: "CactusPlaza.com",
    description: "European-based supplier (Netherlands) offering plants, seeds, and cuttings since 1998. Established international reputation.",
    website: "https://www.cactusplaza.com",
    location: "Netherlands",
    specialties: ["plants", "seeds", "cuttings"],
    categories: ["cacti", "succulents"],
    reputation: "reliable",
    shippingInfo: "European-based international shipping with established track record",
    priceRange: "moderate",
    isActive: true,
  },

  // Pots and Cultivation Supplies
  {
    name: "Succulents Box",
    description: "Decorative pot specialist with discounted prices and wide selection of aesthetic planters for succulent arrangements.",
    website: "https://succulentsbox.com",
    location: "United States",
    specialties: ["pots", "supplies"],
    categories: ["equipment"],
    reputation: "reliable",
    shippingInfo: "Protective packaging for decorative planters",
    priceRange: "budget",
    isActive: true,
  },
  {
    name: "Home Depot",
    description: "Wide selection of basic cultivation supplies including terracotta pots, soil mixes, and garden tools. Good for starter setups.",
    website: "https://www.homedepot.com",
    location: "United States",
    specialties: ["pots", "soil", "tools"],
    categories: ["equipment"],
    reputation: "budget",
    shippingInfo: "In-store pickup available, standard shipping for supplies",
    priceRange: "budget",
    isActive: true,
  },

  // Soil and Growing Medium Specialists
  {
    name: "Rosy Soil",
    description: "Premium cactus and succulent soil mix specialist offering sustainable, microbe-rich, peat-free formulations in resealable packaging.",
    website: "https://rosysoil.com",
    location: "United States",
    specialties: ["soil"],
    categories: ["equipment"],
    reputation: "premium",
    shippingInfo: "Sustainable packaging with soil care instructions",
    priceRange: "premium",
    isActive: true,
  },
  {
    name: "Bonsai Jack",
    description: "Specialized ultra-fast draining soil mixes optimized to pH 5.5 for cacti and succulents. Professional-grade growing medium.",
    website: "https://www.bonsaijack.com",
    location: "United States",
    specialties: ["soil"],
    categories: ["equipment"],
    reputation: "premium",
    shippingInfo: "Professional-grade soil packaging with pH optimization",
    priceRange: "premium",
    isActive: true,
  },

  // Tools and Equipment
  {
    name: "Walmart",
    description: "Budget-friendly mini garden tool sets perfect for basic succulent and cactus maintenance. Good starter option.",
    website: "https://www.walmart.com",
    location: "United States",
    specialties: ["tools"],
    categories: ["equipment"],
    reputation: "budget",
    shippingInfo: "Standard retail shipping and in-store pickup",
    priceRange: "budget",
    isActive: true,
  }
];

// Vendor categories for filtering
export const VENDOR_SPECIALTIES = [
  "seeds",
  "plants", 
  "pots",
  "supplies",
  "tools",
  "soil",
  "cuttings"
] as const;

export const VENDOR_CATEGORIES = [
  "cacti",
  "succulents", 
  "equipment"
] as const;

export const VENDOR_REPUTATIONS = [
  "premium",
  "reliable", 
  "budget",
  "specialty"
] as const;

export const VENDOR_PRICE_RANGES = [
  "budget",
  "moderate",
  "premium", 
  "luxury"
] as const;