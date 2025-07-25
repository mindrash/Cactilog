import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoReportModal } from "./photo-report-modal";
import { Flag, ExternalLink, User, Calendar } from "lucide-react";
import { SpeciesImage } from "@shared/schema";

interface SpeciesImageGalleryProps {
  genus: string;
  species: string;
  maxImages?: number;
  showSpeciesName?: boolean;
}

export function SpeciesImageGallery({ genus, species, maxImages, showSpeciesName = true }: SpeciesImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { data: allImages = [], isLoading } = useQuery<SpeciesImage[]>({
    queryKey: [`/api/species/${genus}/${species}/images`],
  });

  const { data: userPhotos = [], isLoading: userPhotosLoading } = useQuery<any[]>({
    queryKey: [`/api/species/${genus}/${species}/user-photos`],
  });

  // Combine species images with user-contributed photos
  const combinedImages = [
    ...allImages.map(img => ({ ...img, source: 'species' as const })),
    ...userPhotos.map((photo: any) => ({
      id: `user-${photo.id}`,
      imageUrl: photo.imageUrl,
      caption: photo.caption || `Photo by ${photo.userFirstName || 'Anonymous'}`,
      genus,
      species,
      imageType: 'photograph' as const,
      isPrimary: false,
      license: 'User Contribution',
      createdAt: photo.createdAt,
      source: 'user' as const,
      contributorName: photo.userFirstName && photo.userLastName 
        ? `${photo.userFirstName} ${photo.userLastName}` 
        : photo.userFirstName || 'Anonymous'
    }))
  ];

  // Limit images if maxImages is specified
  const images = maxImages ? combinedImages.slice(0, maxImages) : combinedImages;

  if (isLoading || userPhotosLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-sage-100 h-64 rounded-lg"></div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-sage-100 h-16 w-16 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-sage-600">
        <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-lg flex items-center justify-center">
          📷
        </div>
        <p>No images available for this species yet.</p>
        <p className="text-sm mt-1">Images will be automatically sourced from botanical databases.</p>
      </div>
    );
  }

  const currentImage = images[selectedImageIndex];

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative">
        <img
          src={currentImage.imageUrl}
          alt={`${genus} ${species}`}
          className="w-full h-64 sm:h-80 object-cover rounded-lg border border-sage-200"
        />
        
        {/* Image Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {currentImage.isPrimary && (
            <Badge variant="secondary" className="bg-forest-100 text-forest-800">
              Primary
            </Badge>
          )}
          <Badge variant="outline" className="bg-white/90 text-sage-700">
            {currentImage.imageType === 'photograph' ? 'Photo' : 'Illustration'}
          </Badge>
          {(currentImage as any).source === 'user' && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              <User className="w-3 h-3 mr-1" />
              Community
            </Badge>
          )}
        </div>

        {/* Report Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReportModalOpen(true)}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
        >
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                index === selectedImageIndex
                  ? 'border-forest-500'
                  : 'border-sage-200 hover:border-sage-300'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${genus} ${species} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Metadata */}
      <div className="bg-sage-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-forest-800">Image Information</h4>
          {currentImage.sourceUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={currentImage.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Source
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {(currentImage as any).source === 'user' ? 'Community' : (currentImage as any).imageSource || 'Botanical Database'}
            </Badge>
            <span className="text-sage-600">Source</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-sage-500" />
            <span className="text-sage-600 truncate">
              {(currentImage as any).contributorName || (currentImage as any).sourceAttribution || 'Wikimedia Commons'}
            </span>
          </div>

          {currentImage.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sage-500" />
              <span className="text-sage-600">
                Added {new Date(currentImage.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {(currentImage as any).source === 'user' ? 'Community Contribution' : (currentImage as any).license || 'CC0'}
            </Badge>
            <span className="text-sage-600">License</span>
          </div>
        </div>

        <div className="text-xs text-sage-600 border-t border-sage-200 pt-2">
          {currentImage.caption}
          {(currentImage as any).contributorName && (
            <span className="block mt-1 font-medium">
              Contributed by {(currentImage as any).contributorName}
            </span>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <PhotoReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        imageId={currentImage.id}
        imageUrl={currentImage.imageUrl}
        genus={genus}
        species={species}
      />
    </div>
  );
}