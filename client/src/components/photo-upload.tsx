import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, X } from "lucide-react";

interface PhotoUploadProps {
  plantId: number;
  className?: string;
}

export default function PhotoUpload({ plantId, className = "" }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // For now, just send placeholder data - actual file upload would need proper backend setup
      const photoData = {
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
      };
      
      const response = await apiRequest('POST', `/api/plants/${plantId}/photos`, photoData);
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
    <div className={`relative ${className}`}>
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
  );
}