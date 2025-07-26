import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import PlantCard from "@/components/plant-card";
import AddPlantModal from "@/components/add-plant-modal";
import PlantDetailModal from "@/components/plant-detail-modal";
import ExportCollectionModal from "@/components/export-collection-modal";
import { SEO, seoConfigs } from "@/components/seo";
import AmazonAffiliateProducts from "@/components/amazon-affiliate-products";
import { Plant } from "@shared/schema";
import { getFeaturedProducts, getProductsForFamily } from "@shared/amazon-products";
import { Search, Filter, Plus, Grid, List, Download, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Collection() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [familyFilter, setFamilyFilter] = useState("");
  const [genusFilter, setGenusFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

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

  const { data: plants = [] } = useQuery<Plant[]>({
    queryKey: ["/api/plants", { search: searchTerm, type: familyFilter, genus: genusFilter, sortBy }],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const uniqueGenera = Array.from(new Set(plants.map(p => p.genus))).filter(Boolean);
  const uniqueFamilies = Array.from(new Set(plants.map(p => p.family))).filter(Boolean);
  const hasMainlyCacti = uniqueFamilies.includes('Cactaceae');
  
  // Get contextual Amazon products for collection
  const featuredProducts = getFeaturedProducts('collection');
  const familyProducts = hasMainlyCacti ? 
    getProductsForFamily('Cactaceae') : 
    getFeaturedProducts('collection');

  // Plants are now filtered and sorted on the backend
  const sortedPlants = plants;

  return (
    <div className="min-h-screen cactus-pattern-bg-light">
      <SEO {...seoConfigs.collection} />
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 md:mb-6">
              <div className="min-w-0">
                <h2 className="page-title-lg md:page-title-xl mb-1 md:mb-2">My Cacti</h2>
                <p className="text-gray-600 text-sm md:text-base">Browse and manage your plants</p>
              </div>
              <Button 
                onClick={() => setShowAddModal(true)} 
                className="bg-cactus-green hover:bg-succulent shrink-0 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 border border-gray-100 mb-6 md:mb-8">
              <div className="flex flex-col space-y-4">
                {/* Search Bar - Full Width on Mobile */}
                <div className="w-full relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Filters Row - Responsive Layout */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  {/* First Row: Filters and Sort */}
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <Select value={familyFilter || "all"} onValueChange={(value) => setFamilyFilter(value === "all" ? "" : value)}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="All Families" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Families</SelectItem>
                        <SelectItem value="Cactaceae">Cactaceae</SelectItem>
                        <SelectItem value="Aizoaceae">Aizoaceae</SelectItem>
                        <SelectItem value="Crassulaceae">Crassulaceae</SelectItem>
                        <SelectItem value="Apocynaceae">Apocynaceae</SelectItem>
                        <SelectItem value="Asphodelaceae">Asphodelaceae</SelectItem>
                        <SelectItem value="Euphorbiaceae">Euphorbiaceae</SelectItem>
                        <SelectItem value="Agavoideae">Agavoideae</SelectItem>
                        <SelectItem value="Didiereaceae">Didiereaceae</SelectItem>
                        <SelectItem value="Burseraceae">Burseraceae</SelectItem>
                        <SelectItem value="Portulacaceae">Portulacaceae</SelectItem>
                        <SelectItem value="Talinaceae">Talinaceae</SelectItem>
                        <SelectItem value="Cucurbitaceae">Cucurbitaceae</SelectItem>
                        <SelectItem value="Moraceae">Moraceae</SelectItem>
                        <SelectItem value="Passifloraceae">Passifloraceae</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={genusFilter || "all"} onValueChange={(value) => setGenusFilter(value === "all" ? "" : value)}>
                      <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue placeholder="All Genera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genera</SelectItem>
                        {uniqueGenera.map((genus) => (
                          <SelectItem key={genus} value={genus}>{genus}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-[160px]">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4" />
                          <SelectValue placeholder="Sort by..." />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently Modified</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="genus-alpha">Genus A-Z</SelectItem>
                        <SelectItem value="species-alpha">Species A-Z</SelectItem>
                        <SelectItem value="custom-id">Custom ID A-Z</SelectItem>
                        <SelectItem value="id-asc">Plant ID (Low-High)</SelectItem>
                        <SelectItem value="id-desc">Plant ID (High-Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Second Row: Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="flex gap-3 flex-1 sm:flex-initial">
                      <Button variant="outline" className="flex-1 sm:flex-initial px-3">
                        <Filter className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">More Filters</span>
                        <span className="sm:hidden">Filters</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1 sm:flex-initial px-3"
                        onClick={() => setShowExportModal(true)}
                        disabled={sortedPlants.length === 0}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Export</span>
                        <span className="sm:hidden">Export</span>
                      </Button>
                    </div>
                    
                    {/* View Toggle - Mobile Friendly */}
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden self-end sm:self-auto">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-none px-3 ${viewMode === "grid" ? "bg-cactus-green hover:bg-succulent" : ""}`}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`rounded-none px-3 ${viewMode === "list" ? "bg-cactus-green hover:bg-succulent" : ""}`}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Display */}
          {sortedPlants.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {sortedPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Plant</TableHead>
                      <TableHead className="hidden md:table-cell">Family</TableHead>
                      <TableHead className="min-w-[150px]">Taxonomy</TableHead>
                      <TableHead className="hidden sm:table-cell">Custom ID</TableHead>
                      <TableHead className="hidden lg:table-cell">Supplier</TableHead>
                      <TableHead className="hidden lg:table-cell">Acquired</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPlants.map((plant) => (
                      <TableRow 
                        key={plant.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedPlant(plant)}
                      >
                        <TableCell className="font-medium min-w-[200px]">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-xs md:text-sm font-medium text-gray-600">
                                {plant.genus?.[0]}{plant.species?.[0]}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-sm md:text-base truncate">
                                {plant.commonName || `${plant.genus} ${plant.species || ""}`}
                              </div>
                              {plant.cultivar && (
                                <div className="text-xs md:text-sm text-gray-500 truncate">'{plant.cultivar}'</div>
                              )}
                              {/* Show family on mobile when column is hidden */}
                              <div className="md:hidden mt-1">
                                <Badge variant={plant.family === "Cactaceae" ? "default" : "secondary"} className="text-xs">
                                  {plant.family}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={plant.family === "Cactaceae" ? "default" : "secondary"} className="text-xs">
                            {plant.family}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[150px]">
                          <div className="text-sm">
                            <div className="font-medium italic">{plant.genus} {plant.species}</div>
                            {plant.mutation && (
                              <div className="text-gray-500 text-xs">var. {plant.mutation}</div>
                            )}
                            {/* Show additional info on mobile */}
                            <div className="sm:hidden mt-1 space-y-1">
                              {plant.customId && (
                                <div className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded inline-block">
                                  {plant.customId}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {plant.customId || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                          {plant.supplier || "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                          {plant.acquisitionDate ? new Date(plant.acquisitionDate).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="subsection-title mb-2">No plants found</h3>
              <p className="text-gray-600">
                {searchTerm || familyFilter || genusFilter ? 
                  "Try adjusting your search or filters to find plants." :
                  "Add a new plant to your collection to get started."}
              </p>
            </div>
          )}
          
          {/* Amazon Affiliate Products Section */}
          {sortedPlants.length > 0 && (
            <div className="mt-8">
              <AmazonAffiliateProducts 
                products={familyProducts}
                title="Essential Collection Care Items"
                context={hasMainlyCacti ? "Cactus Care" : "Succulent Care"}
              />
            </div>
          )}
        </main>
      </div>

      <AddPlantModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
      
      {selectedPlant && (
        <PlantDetailModal
          plant={selectedPlant}
          open={!!selectedPlant}
          onOpenChange={(open) => !open && setSelectedPlant(null)}
        />
      )}
      
      <ExportCollectionModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
