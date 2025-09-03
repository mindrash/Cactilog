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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PhotoUpload from "@/components/photo-upload";
import AddGrowthModal from "@/components/add-growth-modal";
import { Edit, X, Plus, Trash2, TrendingUp } from "lucide-react";
import PrivacyBadge from "./privacy-badge";
import { PlantLikeButton } from "./plant-like-button";
import EditPlantModal from "./edit-plant-modal";
import { useAuth } from "@/hooks/useAuth";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface PlantDetailModalProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlantDetailModal({ plant, open, onOpenChange }: PlantDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const { user } = useAuth();
  
  // Check if current user owns this plant
  const isOwner = user && plant.userId === user.id;

  // Fetch growth records - only for owned plants since growth endpoint requires ownership
  const { data: growthRecords = [] } = useQuery<GrowthRecord[]>({
    queryKey: ["/api/plants", plant.id, "growth"],
    enabled: open && isOwner,
  });

  // Delete growth record mutation
  const deleteGrowthRecord = useMutation({
    mutationFn: async (recordId: number) => {
      await apiRequest(`/api/growth/${recordId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants", plant.id, "growth"] });
      queryClient.invalidateQueries({ queryKey: ["/api/plants/growth-overview"] });
      toast({
        title: "Growth record deleted",
        description: "The measurement has been removed from your tracking.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete growth record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/plants/${plant.id}`, "DELETE");
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

  const handleDeleteRecord = (recordId: number) => {
    deleteGrowthRecord.mutate(recordId);
    setRecordToDelete(null);
  };

  const handleEditRecord = (record: GrowthRecord) => {
    // TODO: Implement edit functionality
    toast({
      title: "Edit functionality",
      description: "Edit functionality will be implemented soon.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle>
                {plant.commonName || `${plant.genus} ${plant.species || ""}`}
              </DialogTitle>
              <p className="text-gray-600 mt-1">
                <em>{plant.genus}</em> {plant.species && <span>{plant.species}</span>}
              </p>
            </div>
            {isOwner && (
              <div className="flex items-center space-x-3 mr-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deletePlantMutation.mutate()}
                  disabled={deletePlantMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plant Photos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
            <div className="space-y-4">
              <PhotoUpload 
                plantId={plant.id} 
                className="w-full h-64" 
                readOnly={!isOwner}
                usePublicEndpoint={!isOwner}
              />
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
                  <p className="text-sm text-gray-600">Visibility</p>
                  <PrivacyBadge isPublic={plant.isPublic || "public"} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Community Likes</p>
                  <PlantLikeButton 
                    plantId={plant.id} 
                    className="p-0 h-auto text-sm"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Family</p>
                  <Badge 
                    variant={plant.family === 'Cactaceae' ? 'default' : 'secondary'}
                    className={plant.family === 'Cactaceae' ? 'bg-cactus-green/10 text-cactus-green' : 'bg-desert-sage/10 text-desert-sage'}
                  >
                    {plant.family}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cultivar</p>
                  <p className="text-sm">{plant.cultivar || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Initial Type</p>
                  <p className="text-sm">{plant.initialType || "N/A"}</p>
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

        {/* Growth Tracking - Only show for owners */}
        {isOwner && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Growth Tracking</h3>
              <AddGrowthModal plant={plant}>
                <Button className="bg-cactus-green hover:bg-succulent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Measurement
                </Button>
              </AddGrowthModal>
            </div>

          {/* Growth Records Table */}
          {growthRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Date</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Height</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Width</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Circumference</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Offsets</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Health</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Flowering</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Notes</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {growthRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-900 whitespace-nowrap">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {record.heightInches ? `${record.heightInches}"` : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {record.widthInches ? `${record.widthInches}"` : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {record.circumferenceInches ? `${record.circumferenceInches}"` : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900 text-center">
                        {record.offsetCount !== null && record.offsetCount !== undefined ? record.offsetCount : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900 text-center">
                        {record.healthScore ? (
                          <div className="flex items-center gap-1">
                            <span>{record.healthScore}</span>
                            <span className="text-gray-400">/10</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {record.floweringStatus && record.floweringStatus !== "none" ? (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              record.floweringStatus === "blooming" ? "bg-yellow-100 text-yellow-800" :
                              record.floweringStatus === "budding" ? "bg-green-100 text-green-800" :
                              record.floweringStatus === "fruiting" ? "bg-purple-100 text-purple-800" :
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {record.floweringStatus}
                          </Badge>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs">
                        {record.observations ? (
                          <div className="truncate" title={record.observations}>
                            {record.observations}
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-cactus-green hover:text-succulent p-1"
                            onClick={() => handleEditRecord(record)}
                            title="Edit record"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 p-1"
                            onClick={() => setRecordToDelete(record.id)}
                            title="Delete record"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
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

          {/* Growth Chart - Show only if there are multiple records */}
          {growthRecords.length > 1 && (
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cactus-green" />
                Growth Trends
              </h4>
              <div className="h-64 w-full">
                <ChartContainer
                  config={{
                    height: {
                      label: "Height",
                      color: "hsl(var(--chart-1))",
                    },
                    width: {
                      label: "Width", 
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <LineChart
                    data={growthRecords
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(record => ({
                        date: formatDate(record.date),
                        height: record.heightInches ? parseFloat(record.heightInches) : null,
                        width: record.widthInches ? parseFloat(record.widthInches) : null,
                      }))
                    }
                  >
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval={'preserveStartEnd'}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Inches', angle: -90, position: 'insideLeft' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {growthRecords.some(r => r.heightInches) && (
                      <Line 
                        type="monotone" 
                        dataKey="height" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        connectNulls={false}
                        dot={{ r: 4 }}
                        name="Height"
                      />
                    )}
                    {growthRecords.some(r => r.widthInches) && (
                      <Line 
                        type="monotone" 
                        dataKey="width" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        connectNulls={false}
                        dot={{ r: 4 }}
                        name="Width"
                      />
                    )}
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          )}
          </div>
        )}


        <EditPlantModal
          plant={plant}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!recordToDelete} onOpenChange={() => setRecordToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Growth Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this growth measurement? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => recordToDelete && handleDeleteRecord(recordToDelete)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
