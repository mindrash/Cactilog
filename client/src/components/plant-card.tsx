import { Plant } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import PlantDetailModal from "./plant-detail-modal";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";

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
        <img 
          src={defaultImage} 
          alt={plant.commonName || `${plant.genus} ${plant.species}`}
          className="w-full h-48 object-cover"
        />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {plant.customId || `#${plant.id}`}
            </span>
            <Badge 
              variant={plant.type === 'cactus' ? 'default' : 'secondary'}
              className={plant.type === 'cactus' ? 'bg-forest/10 text-forest' : 'bg-sage/10 text-sage'}
            >
              {plant.type}
            </Badge>
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
