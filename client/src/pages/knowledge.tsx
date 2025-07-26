import { useState, useEffect } from "react";
import { useAuthOptional } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, ChevronRight, Leaf } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SEO, seoConfigs } from "@/components/seo";
import { isUnauthorizedError } from "@/lib/authUtils";
import { cactusGenera } from "@shared/cactus-data";
import AmazonAffiliateBanner from "@/components/amazon-affiliate-banner";

export default function Knowledge() {
  const { isAuthenticated } = useAuthOptional();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter genera based on search term
  const filteredGenera = cactusGenera.filter(genus =>
    genus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    genus.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO {...seoConfigs.knowledge} />
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="page-title-xl mb-2 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-cactus-green" />
            Cactus & Succulent Knowledge Base
          </h1>
          <p className="text-gray-600">
            Explore comprehensive information about cactus and succulent genera, species, and cultivation details.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/knowledge/search">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-cactus-green rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="subsection-title">Species Search</h3>
                    <p className="text-gray-600">Search detailed information about specific species</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/knowledge/care-guides">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-forest rounded-lg flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="subsection-title">Care Guides</h3>
                    <p className="text-gray-600">Detailed cultivation guides for specific species</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search genera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Genera Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Browse by Genus</h2>
            <Badge variant="outline" className="text-sm">
              {filteredGenera.length} genera available
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGenera.map((genus) => (
              <Link key={genus.name} href={`/knowledge/genus/${genus.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg font-bold text-cactus-green italic">
                        {genus.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {genus.species.length} species
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {genus.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Common species:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {genus.species.slice(0, 3).map((species) => {
                          const speciesName = typeof species === 'string' ? species : species.name;
                          return (
                            <Badge key={speciesName} variant="outline" className="text-xs">
                              {speciesName}
                            </Badge>
                          );
                        })}
                        {genus.species.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{genus.species.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredGenera.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="subsection-title mb-2">
                  No genera found
                </h3>
                <p className="text-gray-600 text-center">
                  Try adjusting your search terms or browse all available genera.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Amazon Affiliate Products */}
        <div className="mt-12">
          <AmazonAffiliateBanner 
            title="Growing Essentials for Plant Enthusiasts"
            limit={3}
          />
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cactus-green mb-2">
                {cactusGenera.length}
              </div>
              <div className="text-sm text-gray-600">Genera Available</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-forest mb-2">
                {cactusGenera.reduce((total, genus) => total + genus.species.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Species Documented</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-desert-sage mb-2">
                2
              </div>
              <div className="text-sm text-gray-600">Plant Types</div>
              <div className="text-xs text-gray-500 mt-1">Cactus & Succulent</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}