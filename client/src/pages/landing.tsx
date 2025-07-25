import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, LogIn } from "lucide-react";
import CactusIcon from "@/components/cactus-icon";
import PlantCard from "@/components/plant-card";
import { Button } from "@/components/ui/button";
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

export default function Landing() {
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
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Cactilog"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-henny-penny">Cactilog</h1>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest Cactus & Succulent Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the amazing plant collections shared by our community. 
            Join Cactilog to share your own plants and track their growth.
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No plants shared yet</h3>
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
                <PlantCard key={plant.id} plant={plant} />
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
      </div>
    </div>
  );
}
