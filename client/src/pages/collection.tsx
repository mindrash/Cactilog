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
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Collection() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [genusFilter, setGenusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

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
    queryKey: ["/api/plants", { search: searchTerm, type: typeFilter, genus: genusFilter }],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const uniqueGenera = Array.from(new Set(plants.map(p => p.genus))).filter(Boolean);

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
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="cactus">Cactus</SelectItem>
                      <SelectItem value="succulent">Succulent</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={genusFilter} onValueChange={setGenusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Genera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genera</SelectItem>
                      {uniqueGenera.map((genus) => (
                        <SelectItem key={genus} value={genus}>{genus}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="px-4">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Grid */}
          {plants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
              <p className="text-gray-600">Try adjusting your search or filters, or add a new plant to your collection.</p>
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
