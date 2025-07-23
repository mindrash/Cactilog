import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plant, GrowthRecord } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PhotoUpload from "@/components/photo-upload";
import { Edit, X, Plus, Trash2 } from "lucide-react";

interface PlantDetailModalProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlantDetailModal({ plant, open, onOpenChange }: PlantDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: growthRecords = [] } = useQuery<GrowthRecord[]>({
    queryKey: ["/api/plants", plant.id, "growth"],
    enabled: open,
  });

  const deletePlantMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/plants/${plant.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Plant Deleted",
        description: "The plant has been removed from your collection.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete plant. Please try again.",
        variant: "destructive",
      });
    },
  });

  // No default image - users upload their own photos

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                {plant.commonName || `${plant.genus} ${plant.species || ""}`}
              </DialogTitle>
              <p className="text-gray-600 mt-1">
                <em>{plant.genus}</em> {plant.species && <span>{plant.species}</span>}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => deletePlantMutation.mutate()}
                disabled={deletePlantMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plant Photos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
            <div className="space-y-4">
              <PhotoUpload plantId={plant.id} className="w-full h-64" />
              <div className="grid grid-cols-3 gap-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center text-gray-400 hover:border-forest transition-colors cursor-pointer">
                  <Plus className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Plant Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plant Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Plant ID</p>
                  <p className="font-mono text-sm">{plant.customId || `#${plant.id}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <Badge 
                    variant={plant.type === 'cactus' ? 'default' : 'secondary'}
                    className={plant.type === 'cactus' ? 'bg-forest/10 text-forest' : 'bg-sage/10 text-sage'}
                  >
                    {plant.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cultivar</p>
                  <p className="text-sm">{plant.cultivar || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ground Type</p>
                  <p className="text-sm">{plant.groundType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Supplier</p>
                  <p className="text-sm">{plant.supplier || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Acquired</p>
                  <p className="text-sm">{formatDate(plant.acquisitionDate)}</p>
                </div>
              </div>

              {plant.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Notes</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{plant.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Growth Tracking */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Growth Tracking</h3>
            <Button className="bg-forest hover:bg-forest/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Measurement
            </Button>
          </div>

          {/* Growth Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="w-6 h-6" />
              </div>
              <p>Growth chart will be displayed here</p>
            </div>
          </div>

          {/* Growth Records Table */}
          {growthRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Height</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Width</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Weight</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Notes</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {growthRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.heightInches ? `${record.heightInches}"` : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.widthInches ? `${record.widthInches}"` : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.weightOz ? `${record.weightOz} oz` : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.observations || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm" className="text-forest hover:text-sage mr-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No growth records yet. Add your first measurement to start tracking!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
