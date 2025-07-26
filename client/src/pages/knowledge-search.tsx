import { useState, useEffect, useMemo } from "react";
import { useAuthOptional } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Filter, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import { Link } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import { cactusGenera } from "@shared/cactus-data";

export default function KnowledgeSearch() {
  const { isAuthenticated } = useAuthOptional();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenus, setSelectedGenus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Create flat list of all species with their genus info
  const allSpecies = useMemo(() => {
    return cactusGenera.flatMap(genus => 
      genus.species.map(species => ({
        genus: genus.name,
        species: species,
        fullName: `${genus.name} ${typeof species === 'string' ? species : species.name}`,
        description: genus.description,
        type: "cactus" // Since our data is primarily cacti
      }))
    );
  }, []);

  // Filter species based on search criteria
  const filteredSpecies = useMemo(() => {
    return allSpecies.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof item.species === 'string' ? item.species : item.species.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenus = selectedGenus === "all" || item.genus === selectedGenus;
      const matchesType = selectedType === "all" || item.type === selectedType;

      return matchesSearch && matchesGenus && matchesType;
    });
  }, [allSpecies, searchTerm, selectedGenus, selectedType]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenus("all");
    setSelectedType("all");
  };

  // Public page - no auth required

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/knowledge">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
          </div>
          
          <h1 className="page-title-xl mb-2 flex items-center">
            <Search className="w-8 h-8 mr-3 text-cactus-green" />
            Species Search
          </h1>
          <p className="text-gray-600">
            Search through our comprehensive database of cactus and succulent species.
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search species, genus, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Genus
                </label>
                <Select value={selectedGenus} onValueChange={setSelectedGenus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genera</SelectItem>
                    {cactusGenera.map((genus) => (
                      <SelectItem key={genus.name} value={genus.name}>
                        {genus.name} ({genus.species.length} species)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="cactus">Cactus</SelectItem>
                    <SelectItem value="succulent">Succulent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {filteredSpecies.length} results
                </Badge>
                {(searchTerm || selectedGenus !== "all" || selectedType !== "all") && (
                  <Badge variant="secondary">
                    Filtered from {allSpecies.length} total
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {filteredSpecies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecies.map((item, index) => (
                <Card key={`${item.genus}-${item.species}-${index}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <span className="italic text-cactus-green">
                        {item.fullName}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Genus</div>
                        <Badge variant="outline">{item.genus}</Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Species</div>
                        <div className="text-sm text-gray-600">
                          {typeof item.species === 'string' ? item.species : item.species.name}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Type</div>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">About Genus</div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2">
                        <Link href={`/knowledge/genus/${item.genus.toLowerCase()}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <BookOpen className="w-4 h-4 mr-2" />
                            View Genus Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="subsection-title mb-2">
                  No species found
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  No species match your current search criteria. Try adjusting your filters or search terms.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Search by:</h4>
                <ul className="space-y-1">
                  <li>• Species name (e.g., "grandiflorus")</li>
                  <li>• Genus name (e.g., "Echinocereus")</li>
                  <li>• Full scientific name</li>
                  <li>• Description keywords</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Filter options:</h4>
                <ul className="space-y-1">
                  <li>• Select specific genus to narrow results</li>
                  <li>• Filter by plant type (cactus/succulent)</li>
                  <li>• Combine filters for precise searches</li>
                  <li>• Clear filters to browse all species</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}