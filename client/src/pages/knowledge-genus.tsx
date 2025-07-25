import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Search, Leaf, Info } from "lucide-react";
import Header from "@/components/header";
import { Link } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import { cactusGenera } from "@shared/cactus-data";

export default function KnowledgeGenus() {
  const { genusName } = useParams<{ genusName: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  // Find the genus data
  const genus = cactusGenera.find(g => g.name.toLowerCase() === genusName?.toLowerCase());

  if (!genus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Genus not found
              </h3>
              <p className="text-gray-600 mb-4">
                The genus "{genusName}" was not found in our database.
              </p>
              <Link href="/knowledge">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Knowledge Base
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Filter species based on search term
  const filteredSpecies = genus.species.filter(species => {
    const speciesName = typeof species === 'string' ? species : species.name;
    return speciesName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/knowledge">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Knowledge Base
            </Button>
          </Link>
          <div className="text-sm text-gray-500">
            Knowledge Base → Genus Details
          </div>
        </div>

        {/* Genus Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="italic text-cactus-green">{genus.name}</span>
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="outline" className="text-sm">
              {genus.species.length} species documented
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Cactaceae Family
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  About {genus.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {genus.description}
                </p>
              </CardContent>
            </Card>

            {/* Species List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    Species in {genus.name}
                  </div>
                  <Badge variant="outline">
                    {filteredSpecies.length} of {genus.species.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search Species */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search species..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Species Grid */}
                {filteredSpecies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSpecies.map((species, index) => {
                      const speciesName = typeof species === 'string' ? species : species.name;
                      return (
                        <Link key={speciesName} href={`/knowledge/species/${genusName}/${speciesName}`}>
                          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-cactus-green transition-colors cursor-pointer">
                            <div className="font-medium text-gray-900 italic mb-1">
                              {genus.name} {speciesName}
                            </div>
                            <div className="text-sm text-gray-600">
                              Click for detailed information
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No species found matching "{searchTerm}"
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSearchTerm("")}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Total Species</div>
                  <div className="text-2xl font-bold text-cactus-green">
                    {genus.species.length}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700">Family</div>
                  <div className="text-sm text-gray-600">Cactaceae</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700">Type</div>
                  <div className="text-sm text-gray-600">Cactus</div>
                </div>
              </CardContent>
            </Card>

            {/* Common Species */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Species</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {genus.species.slice(0, 5).map((species, index) => {
                    const speciesName = typeof species === 'string' ? species : species.name;
                    return (
                      <Link key={speciesName} href={`/knowledge/species/${genusName}/${speciesName}`}>
                        <div className="text-sm hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                          <span className="font-medium italic text-cactus-green">
                            {genus.name} {speciesName}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {genus.species.length > 5 && (
                    <div className="text-sm text-gray-500 pt-2">
                      +{genus.species.length - 5} more species
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Related Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Explore More</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/knowledge/search">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    Search All Species
                  </Button>
                </Link>
                
                <Link href="/knowledge">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Other Genera
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Care Information Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Care Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 text-center py-4">
                  <Leaf className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="mb-2">Detailed care guides coming soon!</p>
                  <p className="text-xs">
                    This will include watering, light, soil, and propagation information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}