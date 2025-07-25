import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Plus, Users, Globe, ChevronLeft, ChevronRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlantCard from "@/components/plant-card";
import Header from "@/components/header";
import type { Plant } from "@shared/schema";

interface PublicFeedResponse {
  plants: Plant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Home() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: publicFeed, isLoading } = useQuery<PublicFeedResponse>({
    queryKey: ["/api/public/plants", currentPage],
    queryFn: async () => {
      const response = await fetch(`/api/public/plants?page=${currentPage}&limit=20`);
      if (!response.ok) throw new Error('Failed to fetch public plants');
      return response.json();
    },
  });

  const plants = publicFeed?.plants || [];
  const pagination = publicFeed?.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="page-title-xl mb-2">
            Welcome to Cactilog, {user?.firstName || "Plant Enthusiast"}!
          </h1>
          <p className="text-gray-600">
            Discover the amazing world of cacti and succulents from our community.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Plants</CardTitle>
              <Globe className="h-4 w-4 text-cactus-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Public specimens shared
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Collection</CardTitle>
              <Sprout className="h-4 w-4 text-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Link href="/collection">
                  <Button variant="outline" size="sm">View Collection</Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                Manage your plants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Plus className="h-4 w-4 text-desert-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Button size="sm" className="bg-cactus-green hover:bg-cactus-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Plant
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share with community
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Community Feed Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Community Feed</h2>
              <p className="text-gray-600">Latest plants shared by our community</p>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Page {pagination?.page || 1} of {pagination?.totalPages || 1}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : plants.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {plants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600 px-3">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Globe className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No public plants yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to share your plants with the community!
                </p>
                <Button className="bg-cactus-green hover:bg-cactus-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Plant
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}