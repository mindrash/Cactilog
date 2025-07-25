import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalPath?: string;
}

const defaultSEO = {
  title: "Cactilog - Professional Cactus & Succulent Collection Management",
  description: "Track, manage, and grow your cactus and succulent collection with Cactilog. Features botanical family classification, growth tracking, community sharing, comprehensive knowledge base, and reputable vendor directory.",
  keywords: "cactus collection, succulent tracking, plant management, botanical classification, cactus care, succulent care, plant community, garden management, horticultural database",
  ogImage: "https://cactilog.replit.app/og-image.jpg"
};

export function SEO({ title, description, keywords, ogImage, canonicalPath }: SEOProps) {
  const [location] = useLocation();
  
  useEffect(() => {
    const finalTitle = title || defaultSEO.title;
    const finalDescription = description || defaultSEO.description;
    const finalKeywords = keywords || defaultSEO.keywords;
    const finalOgImage = ogImage || defaultSEO.ogImage;
    const finalCanonical = canonicalPath ? `https://cactilog.replit.app${canonicalPath}` : `https://cactilog.replit.app${location}`;

    // Update document title
    document.title = finalTitle;

    // Update or create meta tags
    updateMetaTag('name', 'description', finalDescription);
    updateMetaTag('name', 'keywords', finalKeywords);
    updateMetaTag('property', 'og:title', finalTitle);
    updateMetaTag('property', 'og:description', finalDescription);
    updateMetaTag('property', 'og:image', finalOgImage);
    updateMetaTag('property', 'og:url', finalCanonical);
    updateMetaTag('property', 'twitter:title', finalTitle);
    updateMetaTag('property', 'twitter:description', finalDescription);
    updateMetaTag('property', 'twitter:image', finalOgImage);
    updateMetaTag('property', 'twitter:url', finalCanonical);

    // Update canonical link
    updateCanonicalLink(finalCanonical);
  }, [title, description, keywords, ogImage, canonicalPath, location]);

  return null;
}

function updateMetaTag(attribute: string, value: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

function updateCanonicalLink(href: string) {
  let element = document.querySelector('link[rel="canonical"]');
  
  if (element) {
    element.setAttribute('href', href);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', href);
    document.head.appendChild(element);
  }
}

// SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "Community Feed - Cactilog",
    description: "Explore the latest cactus and succulent collections shared by the Cactilog community. Discover rare species, growing tips, and connect with fellow plant enthusiasts.",
    keywords: "cactus community, succulent sharing, plant enthusiasts, botanical community, cactus photos, succulent collection sharing"
  },
  dashboard: {
    title: "My Dashboard - Cactilog",
    description: "Your personal plant collection dashboard. View collection statistics, recent additions, and manage your cactus and succulent inventory.",
    keywords: "plant dashboard, collection management, cactus inventory, succulent tracking, personal plant statistics"
  },
  collection: {
    title: "My Collection - Cactilog",
    description: "Browse and manage your complete cactus and succulent collection. Filter by botanical family, track growth, and organize your plants with detailed records.",
    keywords: "plant collection, cactus inventory, succulent catalog, botanical family classification, plant organization"
  },
  knowledge: {
    title: "Knowledge Base - Cactilog",
    description: "Comprehensive botanical database with detailed information about cactus genera, species, care guides, and reputable vendor recommendations.",
    keywords: "cactus knowledge, succulent information, botanical database, plant care guides, horticultural resources"
  },
  knowledgeGenus: (genus: string) => ({
    title: `${genus} Species Guide - Cactilog Knowledge Base`,
    description: `Complete guide to ${genus} cactus species including botanical descriptions, care requirements, and cultivation tips for enthusiasts and collectors.`,
    keywords: `${genus}, cactus species, botanical guide, ${genus} care, cactus cultivation, horticultural information`
  }),
  knowledgeSpecies: (genus: string, species: string) => ({
    title: `${genus} ${species} - Complete Care Guide | Cactilog`,
    description: `Detailed care guide for ${genus} ${species} including lighting, watering, soil requirements, propagation methods, and common growing problems.`,
    keywords: `${genus} ${species}, cactus care, succulent care, plant cultivation, growing guide, botanical information`
  }),
  careGuides: {
    title: "Cactus & Succulent Care Guides - Cactilog",
    description: "Expert care guides for cactus and succulent species. Learn proper watering, lighting, soil requirements, and cultivation techniques for healthy plants.",
    keywords: "cactus care, succulent care, plant cultivation, watering guide, soil requirements, plant propagation"
  },
  vendors: {
    title: "Reputable Plant Vendors & Suppliers - Cactilog",
    description: "Curated directory of trusted cactus and succulent vendors, nurseries, and suppliers. Find quality plants, seeds, pots, and cultivation equipment.",
    keywords: "cactus vendors, succulent nurseries, plant suppliers, cactus seeds, succulent plants, horticultural supplies"
  },
  photos: {
    title: "Community Photo Gallery - Cactilog",
    description: "Browse stunning photographs of cacti and succulents shared by the Cactilog community. Get inspiration and share your own plant photography.",
    keywords: "cactus photos, succulent photography, plant gallery, botanical photography, community sharing"
  },
  users: {
    title: "Plant Community Directory - Cactilog",
    description: "Connect with fellow cactus and succulent enthusiasts. Browse public collections, discover new species, and join the growing plant community.",
    keywords: "plant community, cactus collectors, succulent enthusiasts, botanical network, plant sharing"
  },
  settings: {
    title: "Account Settings - Cactilog",
    description: "Manage your Cactilog account settings, privacy preferences, and collection display options.",
    keywords: "account settings, privacy settings, collection management, profile settings"
  },
  growthTracking: {
    title: "Growth Tracking - Cactilog",
    description: "Track the growth and development of your cactus and succulent collection over time with detailed measurements and observations.",
    keywords: "plant growth tracking, cactus development, succulent growth, plant measurements, botanical observations"
  }
};