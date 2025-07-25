import { Plant } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Camera } from "lucide-react";
import PlantDetailModal from "./plant-detail-modal";
import PrivacyBadge from "./privacy-badge";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  // No default image - users upload their own photos

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Card 
        className="border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowDetailModal(true)}
      >
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200">
          <div className="text-center text-gray-500">
            <Camera className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No photo yet</p>
            <p className="text-xs">Click to view details</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {plant.customId || `#${plant.id}`}
            </span>
            <div className="flex items-center gap-2">
              <PrivacyBadge isPublic={plant.isPublic || "public"} />
              <Badge 
                variant={plant.type === 'cactus' ? 'default' : 'secondary'}
                className={plant.type === 'cactus' ? 'bg-cactus-green/10 text-cactus-green' : 'bg-desert-sage/10 text-desert-sage'}
              >
                {plant.type}
              </Badge>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">
            {plant.commonName || `${plant.genus} ${plant.species || ""}`}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            <em>{plant.genus}</em> {plant.species && <span>{plant.species}</span>}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{plant.supplier || "Unknown"}</span>
            <span>{formatDate(plant.acquisitionDate)}</span>
          </div>
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
