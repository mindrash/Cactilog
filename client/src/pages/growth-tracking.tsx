import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Plus, TrendingUp, Calendar, Ruler, Eye, Search } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Plant, GrowthRecord } from "@shared/schema";

interface PlantWithLatestGrowth extends Plant {
  latestGrowth?: GrowthRecord;
  growthCount: number;
}

export default function GrowthTracking() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

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

  const { data: plants, isLoading: plantsLoading } = useQuery<PlantWithLatestGrowth[]>({
    queryKey: ["/api/plants/growth-overview"],
    enabled: !!isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const filteredPlants = plants?.filter(plant => 
    plant.customId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.genus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.species.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedPlants = [...filteredPlants].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.latestGrowth?.date || 0).getTime() - new Date(a.latestGrowth?.date || 0).getTime();
      case "most-records":
        return b.growthCount - a.growthCount;
      case "name":
        return a.customId.localeCompare(b.customId);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-freckle-face title-cactus-green mb-2">Growth Tracking</h1>
          <p className="text-gray-600">Monitor and analyze your plants' growth over time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plants with Records</CardTitle>
              <TrendingUp className="h-4 w-4 text-cactus-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plants?.filter(p => p.growthCount > 0).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                of {plants?.length || 0} total plants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Measurements</CardTitle>
              <Ruler className="h-4 w-4 text-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plants?.reduce((sum, p) => sum + p.growthCount, 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                growth records logged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-desert-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plants?.filter(p => p.latestGrowth && 
                  new Date(p.latestGrowth.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                plants measured this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent Activity</SelectItem>
                <SelectItem value="most-records">Most Records</SelectItem>
                <SelectItem value="name">Plant Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plants List */}
        {plantsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedPlants.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No matching plants found" : "Start tracking growth"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Add measurements to your plants to begin growth tracking"
                }
              </p>
              {!searchTerm && (
                <Link href="/collection">
                  <Button className="bg-cactus-green hover:bg-cactus-green/90">
                    <Eye className="w-4 h-4 mr-2" />
                    View Collection
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlants.map((plant) => (
              <Link key={plant.id} href={`/collection`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {plant.customId}
                        </h3>
                        <p className="text-sm text-gray-600 italic">
                          {plant.genus} {plant.species}
                        </p>
                      </div>
                      <Badge variant={plant.growthCount > 0 ? "default" : "secondary"}>
                        {plant.growthCount} records
                      </Badge>
                    </div>

                    {plant.latestGrowth ? (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Latest:</span>{" "}
                          {new Date(plant.latestGrowth.date).toLocaleDateString()}
                        </div>
                        {plant.latestGrowth.heightInches && (
                          <div className="text-sm">
                            <span className="text-gray-600">Height:</span>{" "}
                            <span className="font-medium">{plant.latestGrowth.heightInches}"</span>
                          </div>
                        )}
                        {plant.latestGrowth.widthInches && (
                          <div className="text-sm">
                            <span className="text-gray-600">Width:</span>{" "}
                            <span className="font-medium">{plant.latestGrowth.widthInches}"</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        No measurements yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
