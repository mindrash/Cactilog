import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthOptional } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SEO, seoConfigs } from "@/components/seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Filter, Store, MapPin, Star, DollarSign, Plus, Settings, Database, List, Grid3X3 } from "lucide-react";

interface Vendor {
  id: number;
  name: string;
  description: string;
  website: string;
  location: string;
  specialties: string[];
  categories: string[];
  reputation: string;
  shippingInfo: string;
  priceRange: string;
  isActive: boolean;
}

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReputation, setSelectedReputation] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  
  const { user } = useAuthOptional();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const { data: adminStatus } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/status"],
    enabled: !!user,
  });

  const seedVendorsMutation = useMutation({
    mutationFn: () => apiRequest("/api/vendors/seed", "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      toast({
        title: "Success",
        description: "Vendor database seeded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-light to-background-alt">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading vendors...</div>
        </div>
      </div>
    );
  }

  const filteredVendors = vendors?.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "all" || !selectedSpecialty || vendor.specialties.includes(selectedSpecialty);
    const matchesCategory = selectedCategory === "all" || !selectedCategory || vendor.categories.includes(selectedCategory);
    const matchesReputation = selectedReputation === "all" || !selectedReputation || vendor.reputation === selectedReputation;

    return matchesSearch && matchesSpecialty && matchesCategory && matchesReputation;
  }) || [];

  const getReputationIcon = (reputation: string) => {
    switch (reputation) {
      case "premium": return <Star className="w-4 h-4 text-yellow-500" />;
      case "specialty": return <Star className="w-4 h-4 text-purple-500" />;
      case "reliable": return <Star className="w-4 h-4 text-green-500" />;
      case "budget": return <DollarSign className="w-4 h-4 text-blue-500" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case "budget": return "bg-green-100 text-green-800";
      case "moderate": return "bg-blue-100 text-blue-800";
      case "premium": return "bg-purple-100 text-purple-800";
      case "luxury": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      seeds: "bg-orange-100 text-orange-800",
      plants: "bg-green-100 text-green-800",
      pots: "bg-gray-100 text-gray-800",
      supplies: "bg-blue-100 text-blue-800",
      tools: "bg-purple-100 text-purple-800",
      soil: "bg-amber-100 text-amber-800",
      cuttings: "bg-teal-100 text-teal-800"
    };
    return colors[specialty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-background-alt">
      <SEO {...seoConfigs.vendors} />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="hidden sm:block flex-1"></div>
            <h1 className="page-title-xl">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 inline-block mr-2 sm:mr-3 text-cactus-green" />
              Trusted Vendors
            </h1>
            <div className="flex-1 flex justify-center sm:justify-end">
              {adminStatus?.isAdmin && (
                <Button
                  onClick={() => seedVendorsMutation.mutate()}
                  disabled={seedVendorsMutation.isPending}
                  variant="outline"
                  size="sm"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {seedVendorsMutation.isPending ? "Seeding..." : "Seed Database"}
                </Button>
              )}
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover reputable suppliers for cacti, succulents, seeds, pots, and cultivation gear. 
            All vendors have been carefully curated for quality and reliability.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="seeds">Seeds</SelectItem>
                <SelectItem value="plants">Plants</SelectItem>
                <SelectItem value="pots">Pots</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="soil">Soil</SelectItem>
                <SelectItem value="cuttings">Cuttings</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cacti">Cacti</SelectItem>
                <SelectItem value="succulents">Succulents</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedReputation} onValueChange={setSelectedReputation}>
              <SelectTrigger>
                <SelectValue placeholder="Reputation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="reliable">Reliable</SelectItem>
                <SelectItem value="specialty">Specialty</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Toggle */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex border rounded-lg overflow-hidden w-full lg:w-auto">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none flex-1 lg:flex-initial"
                >
                  <List className="w-4 h-4 mr-2 lg:mr-0" />
                  <span className="lg:hidden">List</span>
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="rounded-none flex-1 lg:flex-initial"
                >
                  <Grid3X3 className="w-4 h-4 mr-2 lg:mr-0" />
                  <span className="lg:hidden">Cards</span>
                </Button>
              </div>
            </div>
          </div>

          {(searchTerm || (selectedSpecialty !== "all") || (selectedCategory !== "all") || (selectedReputation !== "all")) && (
            <div className="mt-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {filteredVendors.length} vendors found
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("all");
                  setSelectedCategory("all");
                  setSelectedReputation("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Vendor Display */}
        {viewMode === "list" ? (
          <div className="space-y-3">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="w-full hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Left: Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {getReputationIcon(vendor.reputation)}
                            <h3 className="text-lg font-semibold">{vendor.name}</h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{vendor.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Badge className={getPriceRangeColor(vendor.priceRange)}>
                            {vendor.priceRange}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {vendor.reputation}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {vendor.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-medium text-gray-700">Specialties:</span>
                          <div className="flex flex-wrap gap-1">
                            {vendor.specialties.slice(0, 3).map((specialty) => (
                              <Badge 
                                key={specialty} 
                                variant="secondary"
                                className={getSpecialtyColor(specialty)}
                              >
                                {specialty}
                              </Badge>
                            ))}
                            {vendor.specialties.length > 3 && (
                              <Badge variant="secondary" className="bg-gray-100">
                                +{vendor.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-medium text-gray-700">Categories:</span>
                          <div className="flex flex-wrap gap-1">
                            {vendor.categories.map((category) => (
                              <Badge key={category} variant="outline" className="capitalize">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Action Button */}
                    <div className="flex-shrink-0 self-start">
                      <Button 
                        asChild
                        size="sm"
                        className="bg-cactus-green hover:bg-cactus-green/90 w-full sm:w-auto"
                      >
                        <a 
                          href={vendor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visit Store
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expandable Shipping Info */}
                  {vendor.shippingInfo && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        <span className="font-medium">Shipping:</span> {vendor.shippingInfo}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      {getReputationIcon(vendor.reputation)}
                      {vendor.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {vendor.location}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge className={getPriceRangeColor(vendor.priceRange)}>
                        {vendor.priceRange}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {vendor.reputation}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {vendor.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Specialties */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="secondary"
                          className={getSpecialtyColor(specialty)}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-1">
                      {vendor.categories.map((category) => (
                        <Badge key={category} variant="outline" className="capitalize">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {vendor.shippingInfo && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Shipping</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {vendor.shippingInfo}
                      </p>
                    </div>
                  )}

                  {/* Visit Website Button */}
                  {vendor.website && (
                    <Button 
                      asChild 
                      className="w-full bg-cactus-green hover:bg-cactus-green/90"
                    >
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or clearing the filters.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}