import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { LogIn, ArrowRight, TrendingUp, Users, Star, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SEO } from "@/components/seo";
import AmazonAffiliateProducts from "@/components/amazon-affiliate-products";
import type { Plant } from "@shared/schema";
import { getFeaturedProducts } from "@shared/amazon-products";

interface PublicFeedResponse {
  plants: Plant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PublicPhoto {
  photo: {
    id: number;
    plantId: number;
    filename: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: string;
  };
  plant: {
    id: number;
    customId: string;
    genus?: string;
    species?: string;
    commonName?: string;
    updatedAt: string;
  };
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    profileImageUrl?: string;
  };
}

function Landing() {
  const [currentPage, setCurrentPage] = useState(1);
  
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
      <Header />
      
      {/* Compact Info Banner */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white/80 rounded-lg border border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Track, Share & Grow Your Plant Collection
            </h2>
            <p className="text-gray-600 text-sm">
              Join thousands of cactus and succulent enthusiasts documenting their journey.
            </p>
          </div>
          <Button 
            asChild
            size="lg"
            className="bg-cactus-green hover:bg-cactus-green/90 ml-6 shrink-0"
          >
            <a href="/api/login">
              <LogIn className="w-4 h-4 mr-2" />
              Start Your Collection
            </a>
          </Button>
        </div>
      </section>

      {/* Latest Community Collections */}
      {photosLoading ? (
        <section className="max-w-6xl mx-auto px-4 py-12 bg-white/50 rounded-lg mx-4 mb-8">
          <div className="text-center mb-8">
            <h2 className="section-title mb-4">Latest Community Collections</h2>
            <p className="text-gray-600">
              Discover amazing plants shared by our passionate community
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cactus-green"></div>
          </div>
        </section>
      ) : photos && photos.length > 0 ? (
        <section className="max-w-6xl mx-auto px-4 py-12 bg-white/50 rounded-lg mx-4 mb-8">
          <div className="text-center mb-8">
            <h2 className="section-title mb-4">Latest Community Collections</h2>
            <p className="text-gray-600">
              Discover amazing plants shared by our passionate community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {photos.slice(0, 6).map((photoData) => (
              <Link key={photoData.photo.id} href={`/plants/${photoData.plant.id}`} className="group block">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={`/api/photos/${photoData.photo.id}/image`}
                      alt={photoData.plant.commonName || photoData.plant.customId}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"

                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-cactus-green transition-colors line-clamp-1">
                          {photoData.plant.commonName || photoData.plant.customId}
                        </h3>
                        {photoData.plant.genus && photoData.plant.species ? (
                          <p className="text-sm italic text-gray-600 line-clamp-1">
                            {photoData.plant.genus} {photoData.plant.species}
                          </p>
                        ) : photoData.plant.genus ? (
                          <p className="text-sm italic text-gray-600 line-clamp-1">
                            {photoData.plant.genus} sp.
                          </p>
                        ) : null}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{photoData.user.displayName || photoData.user.firstName || 'Community Member'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(photoData.plant.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/community/photos">
              <Button variant="outline" className="inline-flex items-center">
                Explore Community Gallery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        <section className="max-w-6xl mx-auto px-4 py-12 bg-white/50 rounded-lg mx-4 mb-8">
          <div className="text-center mb-8">
            <h2 className="section-title mb-4">Latest Community Collections</h2>
            <p className="text-gray-600">
              Community collections will appear here as members share their plants!
            </p>
          </div>
        </section>
      )}

      {/* Featured Products Above Fold */}
      <section className="max-w-6xl mx-auto px-4 py-8 bg-white/50 rounded-lg mx-4 mb-8">
        <div className="text-center mb-6">
          <h2 className="section-title mb-2">Essential Supplies for Plant Enthusiasts</h2>
          <p className="text-gray-600">Carefully selected products to help your collection thrive</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                      {product.title}
                    </h3>
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
        
        <div className="text-center mt-6">
          <Link href="/vendors">
            <Button variant="outline" className="inline-flex items-center">
              View All Trusted Vendors & Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Join Cactilog */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Why Join Cactilog?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to document, track, and share your plant journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-cactus-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-cactus-green" />
              </div>
              <CardTitle className="text-lg">Smart Collection Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Track your plants with detailed profiles, growth measurements, and comprehensive photo histories. 
                Never lose track of your collection again.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-cactus-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-cactus-green" />
              </div>
              <CardTitle className="text-lg">Vibrant Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Connect with fellow enthusiasts, share your discoveries, and learn from experienced collectors 
                around the world.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-cactus-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-cactus-green" />
              </div>
              <CardTitle className="text-lg">Expert Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Access comprehensive species information, care guides, and expert advice to help your 
                plants thrive in any environment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>





      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-cactus-green to-sage-green text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join thousands of plant enthusiasts who trust Cactilog to document and grow their collections.
          </p>
          <Button 
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-cactus-green hover:bg-gray-50"
          >
            <a href="/api/login">
              <LogIn className="w-5 h-5 mr-2" />
              Get Started Free
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;