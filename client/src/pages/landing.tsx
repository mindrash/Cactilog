import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ChevronDown, LogIn, Camera, TrendingUp, Users, BookOpen, Shield, Heart, Store, Menu, X } from "lucide-react";
import CactusIcon from "@/components/cactus-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AmazonAffiliateBanner from "@/components/amazon-affiliate-banner";
import type { Plant } from "@shared/schema";
import { useState } from "react";
import logoImage from "@/assets/cactilog-logo.png";
import { amazonProducts, getFeaturedProducts } from "@shared/amazon-products";

interface PublicFeedResponse {
  plants: Plant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface PublicPhoto {
  photo: {
    id: number;
    filename: string;
    originalName: string;
    uploadedAt: string;
  };
  plant: {
    id: number;
    customId: string;
    genus: string;
    species: string;
    commonName: string;
    updatedAt: string;
    family: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    profileImageUrl: string;
  };
}

// Simple plant card for landing page that doesn't need authentication
function LandingPlantCard({ plant }: { plant: Plant }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative overflow-hidden">
        <div className="text-center text-gray-500">
          <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
          <p className="text-xs sm:text-sm">Community Plant</p>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        {/* Custom ID */}
        <div className="mb-2">
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {plant.customId || `#${plant.id}`}
          </span>
        </div>
        
        {/* Family badge */}
        <div className="flex items-center mb-2">
          <Badge 
            variant={plant.family === 'Cactaceae' ? 'default' : 'secondary'}
            className={`text-xs ${plant.family === 'Cactaceae' ? 'bg-cactus-green/10 text-cactus-green' : 'bg-desert-sage/10 text-desert-sage'}`}
          >
            {plant.family}
          </Badge>
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2">
          {plant.commonName || `${plant.genus} ${plant.species || ""}`}
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">
          <em>{plant.genus}</em> {plant.species && <span>{plant.species}</span>}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="truncate flex-1 mr-2">{plant.supplier || "Community"}</span>
          <span className="shrink-0">{formatDate(plant.acquisitionDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Landing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data, isLoading } = useQuery<PublicFeedResponse>({
    queryKey: ["/api/public/plants", currentPage],
    queryFn: async () => {
      const response = await fetch(`/api/public/plants?page=${currentPage}&limit=20`);
      if (!response.ok) {
        throw new Error("Failed to fetch public plants");
      }
      return response.json();
    },
  });

  // Fetch community photos
  const { data: photos, isLoading: photosLoading } = useQuery<PublicPhoto[]>({
    queryKey: ["/api/photos/public"],
  });

  // Get featured products for the landing page
  const featuredProducts = getFeaturedProducts('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO />
      {/* Public Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 mr-4 lg:mr-8">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Cactilog"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="cactilog-title font-bold">
                  <span className="cacti-green">Cacti</span><span className="log-green">log</span>
                  <span className="beta-superscript">BETA</span>
                </h1>
              </div>
            </div>

            {/* Desktop Public Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <div className="relative group">
                <Button variant="ghost" className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <a href="/users" onClick={(e) => { e.preventDefault(); window.location.href = '/users'; }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Collections Directory</a>
                    <a href="/photos" onClick={(e) => { e.preventDefault(); window.location.href = '/photos'; }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Photo Gallery</a>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <Button variant="ghost" className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Knowledge Base
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <a href="/knowledge" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge'; }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Browse Genera</a>
                    <a href="/knowledge/search" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge/search'; }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Species Search</a>
                    <a href="/knowledge/care-guides" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge/care-guides'; }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Care Guides</a>
                    <a href="/knowledge/diseases-pests" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge/diseases-pests'; }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Diseases & Pests</a>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" onClick={() => window.location.href = '/vendors'}>
                <Store className="w-4 h-4 mr-2" />
                Vendors
              </Button>
            </nav>

            {/* Desktop Sign In */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button 
                onClick={() => window.location.href = "/auth"}
                className="bg-cactus-green hover:bg-cactus-green/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              <Button 
                size="sm" 
                onClick={() => window.location.href = "/auth"}
                className="bg-cactus-green hover:bg-cactus-green/90"
              >
                <LogIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Community</div>
                <a href="/users" onClick={(e) => { e.preventDefault(); window.location.href = '/users'; setMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Collections Directory</a>
                <a href="/photos" onClick={(e) => { e.preventDefault(); window.location.href = '/photos'; setMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Photo Gallery</a>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2">Knowledge Base</div>
                <a href="/knowledge" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge'; setMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Browse Genera</a>
                <a href="/knowledge/search" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge/search'; setMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Species Search</a>
                <a href="/knowledge/care-guides" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge/care-guides'; setMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Care Guides</a>
                <a href="/knowledge/diseases-pests" onClick={(e) => { e.preventDefault(); window.location.href = '/knowledge/diseases-pests'; setMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Diseases & Pests</a>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2">Other</div>
                <a href="/vendors" onClick={(e) => { e.preventDefault(); window.location.href = '/vendors'; setMobileMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trusted Vendors</a>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <Button 
                    onClick={() => { window.location.href = "/auth"; setMobileMenuOpen(false); }}
                    className="w-full mx-4 mb-2 bg-cactus-green hover:bg-cactus-green/90"
                    style={{ width: 'calc(100% - 2rem)' }}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Compact Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-6 text-center">
        <div className="mb-6">
          <h2 className="page-title-xl mb-4">
            The Complete Platform for Cactus & Succulent Enthusiasts
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Join thousands of collectors tracking their plants, sharing discoveries, and growing their knowledge. 
            From beginners to experts, Cactilog helps you nurture your passion for cacti and succulents.
          </p>
          <Button 
            onClick={() => window.location.href = "/auth"}
            size="lg"
            className="bg-cactus-green hover:bg-cactus-green/90 px-8 py-3 text-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Start Your Collection Today
          </Button>
        </div>
      </section>

      {/* Featured Products Above Fold */}
      <section className="max-w-6xl mx-auto px-4 py-6 bg-white/50 rounded-lg mx-4 mb-6">
        <div className="text-center mb-4">
          <h3 className="section-title mb-2">Essential Supplies for Plant Enthusiasts</h3>
          <p className="text-sm text-gray-600">Carefully selected products to help your collection thrive</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProducts.slice(0, 3).map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNEMyOC42ODYzIDI0IDI2IDI2LjY4NjMgMjYgMzBDMjYgMzMuMzEzNyAyOC42ODYzIDM2IDMyIDM2QzM1LjMxMzcgMzYgMzggMzMuMzEzNyAzOCAzMEMzOCAyNi42ODYzIDM1LjMxMzcgMjQgMzIgMjRaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                      {product.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-cactus-green">
                        {product.price}
                      </span>
                      <a 
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-cactus-green text-white px-2 py-1 rounded hover:bg-cactus-green/90 transition-colors"
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <a 
            href="/vendors" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/vendors'; }}
            className="text-sm text-cactus-green hover:text-cactus-green/80 underline"
          >
            View All Trusted Vendors & Products →
          </a>
        </div>
      </section>

      {/* Compact Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h3 className="page-title-lg mb-3">Why Join Cactilog?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to document, track, and share your plant journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Collection Management */}
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="w-12 h-12 bg-cactus-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-cactus-green" />
              </div>
              <h4 className="section-title mb-2">Smart Collection Management</h4>
              <p className="text-gray-600 text-sm">
                Document your plants with photos, custom IDs, and detailed botanical information. 
                Track acquisition dates, suppliers, and personal notes.
              </p>
            </CardContent>
          </Card>

          {/* Growth Tracking */}
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="w-12 h-12 bg-succulent-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-succulent-green" />
              </div>
              <h4 className="section-title mb-2">Growth Tracking & Analytics</h4>
              <p className="text-gray-600 text-sm">
                Monitor your plants' progress with measurements, photos, and observations over time. 
                View growth charts and trends.
              </p>
            </CardContent>
          </Card>

          {/* Community */}
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="w-12 h-12 bg-pine-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-pine-green" />
              </div>
              <h4 className="section-title mb-2">Vibrant Community</h4>
              <p className="text-gray-600 text-sm">
                Connect with fellow enthusiasts, share your collection publicly, and discover 
                amazing plants from collectors worldwide.
              </p>
            </CardContent>
          </Card>

          {/* Knowledge Base */}
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="w-12 h-12 bg-sage-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sage-green" />
              </div>
              <h4 className="section-title mb-2">Knowledge Base</h4>
              <p className="text-gray-600 text-sm">
                Access detailed information on 1,200+ species across 60+ genera. Learn care guides 
                and discover new species.
              </p>
            </CardContent>
          </Card>

          {/* Privacy & Control */}
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="w-12 h-12 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-forest-green" />
              </div>
              <h4 className="section-title mb-2">Privacy & Control</h4>
              <p className="text-gray-600 text-sm">
                Keep your collection private or share selectively. Control which plants are public 
                with granular privacy settings.
              </p>
            </CardContent>
          </Card>

          {/* Trusted Vendors */}
          <Card className="text-center p-4 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="w-12 h-12 bg-earth-brown/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-earth-brown" />
              </div>
              <h4 className="section-title mb-2">Trusted Vendors</h4>
              <p className="text-gray-600 text-sm">
                Discover reputable suppliers for plants, seeds, pots, and cultivation gear. 
                All vendors carefully curated for quality.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h3 className="page-title-lg mb-3">
            Latest from Our Community
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore amazing photos shared by passionate collectors from around the world
          </p>
        </div>

        {photosLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-cactus-green border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading community photos...</p>
          </div>
        ) : !photos || photos.length === 0 ? (
          <div className="text-center py-12">
            <img 
              src={logoImage} 
              alt="Cactilog"
              className="w-12 h-12 object-contain mx-auto mb-4 opacity-40"
            />
            <h3 className="subsection-title mb-2">No photos shared yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share photos of your plant collection!</p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-cactus-green hover:bg-cactus-green/90"
            >
              Start Your Collection
            </Button>
          </div>
        ) : (
          <>
            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {photos?.slice(0, 12).map((item) => (
                <Card 
                  key={item.photo.id} 
                  className="border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => window.location.href = `/plants/${item.plant.id}`}
                >
                  <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative overflow-hidden">
                    <img
                      src={`/api/photos/${item.photo.id}/image`}
                      alt={item.plant.commonName || `${item.plant.genus} ${item.plant.species || ""}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error("Failed to load image:", `/api/photos/${item.photo.id}/image`, "Original name:", item.photo.originalName);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="text-center text-gray-500">
                              <svg class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p class="text-xs sm:text-sm">Community Photo</p>
                            </div>
                          `;
                        }
                      }}
                      onLoad={() => {
                        console.log("Successfully loaded image:", `/api/photos/${item.photo.id}/image`);
                      }}
                    />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    {/* Custom ID */}
                    <div className="mb-2">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.plant.customId || `#${item.plant.id}`}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2">
                      {item.plant.commonName || `${item.plant.genus} ${item.plant.species || ""}`}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">
                      <em>{item.plant.genus}</em> {item.plant.species && <span>{item.plant.species}</span>}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="truncate flex-1 mr-2">
                        by {item.user.displayName || `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() || 'Anonymous'}
                      </span>
                      <span className="shrink-0">
                        {new Date(item.photo.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View More Link */}
            {photos && photos.length > 12 && (
              <div className="text-center">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/photos"}
                  className="flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>View All Community Photos</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
        
        {/* Amazon Affiliate Products */}
        <div className="mt-16">
          <AmazonAffiliateBanner 
            title="Start Growing Today - Top-Rated Supplies"
            limit={4}
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-cactus-green/5 to-succulent-green/5 rounded-2xl">
          <h3 className="page-title-lg mb-4">Ready to Start Your Journey?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our growing community of plant enthusiasts. Track your collection, 
            share your passion, and connect with fellow collectors today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => window.location.href = "/auth"}
              size="lg"
              className="bg-cactus-green hover:bg-cactus-green/90 px-8 py-3"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Create Your Free Account
            </Button>
            <p className="text-sm text-gray-500">
              Always free • No credit card required • Join in seconds
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Landing;
