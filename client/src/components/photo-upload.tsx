import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Trash2 } from "lucide-react";

interface PhotoUploadProps {
  plantId: number;
  className?: string;
}

export default function PhotoUpload({ plantId, className = "" }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing photos for this plant
  const { data: photos = [] } = useQuery({
    queryKey: ["/api/plants", plantId, "photos"],
  });

  const photosArray = Array.isArray(photos) ? photos : [];

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Create FormData to properly send file
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch(`/api/plants/${plantId}/photos`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants", plantId, "photos"] });
      toast({
        title: "Photo Uploaded",
        description: "Your plant photo has been added successfully.",
      });
      setIsUploading(false);
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
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (photoId: number) => {
      const response = await fetch(`/api/plants/${plantId}/photos/${photoId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants", plantId, "photos"] });
      toast({
        title: "Photo Deleted",
        description: "Photo has been removed successfully.",
      });
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
        title: "Delete Failed",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Existing Photos */}
      {photosArray.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {photosArray.map((photo: any) => (
            <div key={photo.id} className="relative group">
              <img
                src={`/uploads/${photo.filename}`}
                alt={photo.originalName}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {new Date(photo.uploadedAt).toLocaleDateString()}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteMutation.mutate(photo.id);
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload New Photo */}
      <div className="relative h-32">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-full h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-forest transition-colors">
          <div className="text-center text-gray-500">
            {isUploading ? (
              <>
                <Upload className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Add Photo</p>
                <p className="text-xs">Click to upload</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}