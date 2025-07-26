import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, LogIn, Camera, TrendingUp, Users, BookOpen, Shield, Heart } from "lucide-react";
import CactusIcon from "@/components/cactus-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import Footer from "@/components/footer";
import type { Plant } from "@shared/schema";
import { useState } from "react";
import logoImage from "@/assets/cactilog-logo.png";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Cactilog"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="cactilog-title-large font-bold">
                <span className="cacti-green">Cacti</span><span className="log-green">log</span>
                <span className="beta-superscript-large">BETA</span>
              </h1>
              <p className="text-sm text-gray-600">Community Collection</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-cactus-green hover:bg-cactus-green/90"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <h2 className="page-title-xl mb-6">
            The Complete Platform for Cactus & Succulent Enthusiasts
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Join thousands of collectors tracking their plants, sharing discoveries, and growing their knowledge. 
            From beginners to experts, Cactilog helps you nurture your passion for cacti and succulents.
          </p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            size="lg"
            className="bg-cactus-green hover:bg-cactus-green/90 px-8 py-3 text-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Start Your Collection Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="page-title-lg mb-4">Why Join Cactilog?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to document, track, and share your plant journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Collection Management */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-cactus-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-cactus-green" />
              </div>
              <h4 className="section-title mb-3">Smart Collection Management</h4>
              <p className="text-gray-600 text-sm">
                Document your plants with photos, custom IDs, and detailed botanical information. 
                Track acquisition dates, suppliers, and personal notes for every specimen.
              </p>
            </CardContent>
          </Card>

          {/* Growth Tracking */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-succulent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-succulent-green" />
              </div>
              <h4 className="section-title mb-3">Growth Tracking & Analytics</h4>
              <p className="text-gray-600 text-sm">
                Monitor your plants' progress with measurements, photos, and observations over time. 
                View growth charts and trends to optimize your care routine.
              </p>
            </CardContent>
          </Card>

          {/* Community */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-pine-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pine-green" />
              </div>
              <h4 className="section-title mb-3">Vibrant Community</h4>
              <p className="text-gray-600 text-sm">
                Connect with fellow enthusiasts, share your collection publicly, and discover 
                amazing plants from collectors worldwide. Like and appreciate others' specimens.
              </p>
            </CardContent>
          </Card>

          {/* Knowledge Base */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-sage-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-sage-green" />
              </div>
              <h4 className="section-title mb-3">Comprehensive Knowledge Base</h4>
              <p className="text-gray-600 text-sm">
                Access detailed information on 1,200+ species across 60+ genera. Learn care guides, 
                botanical classification, and discover new species to add to your collection.
              </p>
            </CardContent>
          </Card>

          {/* Privacy & Control */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-forest-green" />
              </div>
              <h4 className="section-title mb-3">Privacy & Control</h4>
              <p className="text-gray-600 text-sm">
                Keep your collection private or share selectively. Control which plants are public, 
                set custom display names, and manage your privacy settings with granular control.
              </p>
            </CardContent>
          </Card>

          {/* Trusted Vendors */}
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-earth-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-earth-brown" />
              </div>
              <h4 className="section-title mb-3">Trusted Vendor Directory</h4>
              <p className="text-gray-600 text-sm">
                Discover reputable suppliers for plants, seeds, pots, and cultivation gear. 
                All vendors are carefully curated for quality and reliability.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Showcase */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="page-title-lg mb-4">
            Latest from Our Community
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore amazing collections shared by passionate collectors from around the world
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-cactus-green border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading plant collection...</p>
          </div>
        ) : data?.plants?.length === 0 ? (
          <div className="text-center py-12">
            <img 
              src={logoImage} 
              alt="Cactilog"
              className="w-12 h-12 object-contain mx-auto mb-4 opacity-40"
            />
            <h3 className="subsection-title mb-2">No plants shared yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your plant collection!</p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-cactus-green hover:bg-cactus-green/90"
            >
              Start Your Collection
            </Button>
          </div>
        ) : (
          <>
            {/* Plant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data?.plants?.map((plant) => (
                <LandingPlantCard key={plant.id} plant={plant} />
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!data.pagination.hasPrev}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({data.pagination.total} plants)
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!data.pagination.hasNext}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
        
        {/* Call to Action */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-cactus-green/5 to-succulent-green/5 rounded-2xl">
          <h3 className="page-title-lg mb-4">Ready to Start Your Journey?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our growing community of plant enthusiasts. Track your collection, 
            share your passion, and connect with fellow collectors today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => window.location.href = "/api/login"}
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
