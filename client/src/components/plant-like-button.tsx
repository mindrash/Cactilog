import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PlantLikeButtonProps {
  plantId: number;
  className?: string;
  showCount?: boolean;
}

export function PlantLikeButton({ plantId, className = "", showCount = true }: PlantLikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: likeData, isLoading } = useQuery({
    queryKey: [`/api/plants/${plantId}/likes`],
    enabled: !!plantId,
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (isLiked) {
        return await apiRequest(`/api/plants/${plantId}/like`, 'DELETE');
      } else {
        return await apiRequest(`/api/plants/${plantId}/like`, 'POST');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/plants/${plantId}/likes`] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign in required",
          description: "Please sign in to like plants.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like plants.",
        variant: "destructive",
      });
      return;
    }
    
    toggleLikeMutation.mutate(likeData?.isLiked || false);
  };

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`${className} opacity-50`}
        disabled
      >
        <Heart className="w-4 h-4" />
        {showCount && <span className="ml-1">...</span>}
      </Button>
    );
  }

  const isLiked = likeData?.isLiked || false;
  const likeCount = likeData?.likeCount || 0;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${className} transition-colors hover:bg-red-50 ${
        isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
      }`}
      onClick={handleLikeToggle}
      disabled={toggleLikeMutation.isPending}
      data-like-button="true"
    >
      <Heart 
        className={`w-4 h-4 transition-all ${
          isLiked ? 'fill-current' : ''
        } ${toggleLikeMutation.isPending ? 'animate-pulse' : ''}`}
      />
      {showCount && (
        <span className={`ml-1 text-sm ${isLiked ? 'font-medium' : ''}`}>
          {likeCount}
        </span>
      )}
    </Button>
  );
}