import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import PlantCard from "@/components/plant-card";
import AddPlantModal from "@/components/add-plant-modal";
import { Plant } from "@shared/schema";
import { Search, Filter, Plus, Grid, List, Eye } from "lucide-react";
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
  const [typeFilter, setTypeFilter] = useState("");
  const [genusFilter, setGenusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    queryKey: ["/api/plants"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const uniqueGenera = Array.from(new Set(plants.map(p => p.genus))).filter(Boolean);

  // Filter plants based on search and filters
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = !searchTerm || 
      plant.genus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.customId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || plant.type === typeFilter;
    const matchesGenus = !genusFilter || plant.genus === genusFilter;
    
    return matchesSearch && matchesType && matchesGenus;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">My Collection</h2>
                <p className="text-gray-600">Browse and manage your plants</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="bg-forest hover:bg-forest/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
                <div className="flex-1 max-w-lg relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search plants by name, genus, or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="cactus">Cactus</SelectItem>
                      <SelectItem value="succulent">Succulent</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={genusFilter || "all"} onValueChange={(value) => setGenusFilter(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Genera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genera</SelectItem>
                      {uniqueGenera.map((genus) => (
                        <SelectItem key={genus} value={genus}>{genus}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="px-4">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                  
                  {/* View Toggle */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-none px-3 ${viewMode === "grid" ? "bg-forest hover:bg-forest/90" : ""}`}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`rounded-none px-3 ${viewMode === "list" ? "bg-forest hover:bg-forest/90" : ""}`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Display */}
          {filteredPlants.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Taxonomy</TableHead>
                      <TableHead>Custom ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Acquired</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlants.map((plant) => (
                      <TableRow key={plant.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {plant.genus?.[0]}{plant.species?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {plant.commonName || `${plant.genus} ${plant.species || ""}`}
                              </div>
                              {plant.cultivar && (
                                <div className="text-sm text-gray-500">'{plant.cultivar}'</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={plant.type === "cactus" ? "default" : "secondary"}>
                            {plant.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium italic">{plant.genus} {plant.species}</div>
                            {plant.mutation && (
                              <div className="text-gray-500">var. {plant.mutation}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {plant.customId || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {plant.supplier || "—"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {plant.acquisitionDate ? new Date(plant.acquisitionDate).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
              <p className="text-gray-600">
                {searchTerm || typeFilter || genusFilter ? 
                  "Try adjusting your search or filters to find plants." :
                  "Add a new plant to your collection to get started."}
              </p>
            </div>
          )}
        </main>
      </div>

      <AddPlantModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}
