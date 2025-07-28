import { Plant } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import PlantDetailModal from "./plant-detail-modal";
import PrivacyBadge from "./privacy-badge";
import { PlantLikeButton } from "./plant-like-button";
import { useAuth } from "@/hooks/useAuth";

interface PlantCardProps {
  plant: Plant;
  showPhotos?: boolean;
}

export default function PlantCard({ plant, showPhotos = true }: PlantCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch photos if showPhotos is true (public plants should show photos even if not authenticated)
  const { data: photos = [] } = useQuery({
    queryKey: ["/api/plants", plant.id, "photos"],
    enabled: showPhotos,
  });

  const photosArray = Array.isArray(photos) ? photos : [];
  const primaryPhoto = photosArray[0]; // Use first photo as primary

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on the like button
    if ((e.target as HTMLElement).closest('[data-like-button]')) {
      return;
    }
    setShowDetailModal(true);
  };

  return (
    <>
      <Card 
        className="border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200 relative overflow-hidden">
          {primaryPhoto ? (
            <img
              src={`/api/photos/${primaryPhoto.id}/image`}
              alt={primaryPhoto.originalName || plant.commonName || `${plant.genus} ${plant.species || ""}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-500">
              <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
              <p className="text-xs sm:text-sm">No photo yet</p>
              <p className="text-xs hidden sm:block">Click to view details</p>
            </div>
          )}
          {photosArray.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              +{photosArray.length - 1}
            </div>
          )}
        </div>
        <CardContent className="p-3 sm:p-4">
          {/* Custom ID on its own line */}
          <div className="mb-2">
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {plant.customId || `#${plant.id}`}
            </span>
          </div>
          
          {/* Badges row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <PrivacyBadge isPublic={plant.isPublic || "public"} />
              <Badge 
                variant={plant.family === 'Cactaceae' ? 'default' : 'secondary'}
                className={`text-xs ${plant.family === 'Cactaceae' ? 'bg-cactus-green/10 text-cactus-green' : 'bg-desert-sage/10 text-desert-sage'}`}
              >
                {plant.family}
              </Badge>
            </div>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2">
            {plant.commonName || `${plant.genus} ${plant.species || ""}`}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">
            <em>{plant.genus}</em> {plant.species && <span>{plant.species}</span>}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="truncate flex-1 mr-2">{plant.supplier || "Unknown"}</span>
            <span className="shrink-0">{formatDate(plant.acquisitionDate)}</span>
          </div>
          
          {/* Like Button - only show for authenticated users */}
          {isAuthenticated && (
            <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
              <PlantLikeButton 
                plantId={plant.id} 
                className="text-xs"
                showCount={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <PlantDetailModal 
        plant={plant}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      />
    </>
  );
}
