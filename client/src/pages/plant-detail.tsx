import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ArrowLeft, Calendar, MapPin, User, Camera, Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AmazonAffiliateBanner from "@/components/amazon-affiliate-banner";
import type { Plant } from "@shared/schema";
import { getFeaturedProducts } from "@shared/amazon-products";

interface PlantPhoto {
  id: number;
  filename: string;
  originalName: string;
  uploadedAt: string;
}

interface PublicPlantDetail extends Plant {
  photos: PlantPhoto[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    profileImageUrl: string;
  };
}

export default function PlantDetail() {
  const { plantId } = useParams();
  
  const { data: plant, isLoading, error } = useQuery<PublicPlantDetail>({
    queryKey: ["/api/plants/public", plantId],
    queryFn: async () => {
      const response = await fetch(`/api/plants/public/${plantId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Plant not found");
        }
        if (response.status === 403) {
          throw new Error("This plant is private");
        }
        throw new Error("Failed to fetch plant details");
      }
      return response.json();
    },
  });

  const featuredProducts = getFeaturedProducts('collection');

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  const getUserDisplayName = () => {
    if (!plant?.user) return "Anonymous";
    return plant.user.displayName || 
           `${plant.user.firstName || ''} ${plant.user.lastName || ''}`.trim() || 
           "Anonymous";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-cactus-green border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading plant details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {error?.message === "This plant is private" ? (
                <EyeOff className="w-8 h-8 text-gray-400" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {error?.message === "This plant is private" ? "Private Plant" : "Plant Not Found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error?.message === "This plant is private" 
                ? "This plant collection is set to private by the owner."
                : "The plant you're looking for doesn't exist or has been removed."
              }
            </p>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO 
        title={`${plant.commonName || `${plant.genus} ${plant.species || ""}`} - ${getUserDisplayName()}'s Collection`}
        description={`View ${plant.commonName || `${plant.genus} ${plant.species || ""}`} from ${getUserDisplayName()}'s plant collection on Cactilog. ${plant.notes ? plant.notes.slice(0, 100) + "..." : ""}`}
      />
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Community</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plant Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded">
                        {plant.customId || `#${plant.id}`}
                      </span>
                      <Badge 
                        variant={plant.family === 'Cactaceae' ? 'default' : 'secondary'}
                        className={`${plant.family === 'Cactaceae' ? 'bg-cactus-green/10 text-cactus-green' : 'bg-desert-sage/10 text-desert-sage'}`}
                      >
                        {plant.family}
                      </Badge>
                      <div className="flex items-center space-x-1 text-cactus-green">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Public</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {plant.commonName || `${plant.genus} ${plant.species || ""}`}
                    </CardTitle>
                    <p className="text-lg text-gray-600 italic">
                      {plant.genus} {plant.species}
                      {plant.cultivar && <span className="not-italic"> '{plant.cultivar}'</span>}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Owner Info */}
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="w-10 h-10 bg-cactus-green/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-cactus-green" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Shared by {getUserDisplayName()}
                    </p>
                    <p className="text-sm text-gray-600">Community Member</p>
                  </div>
                </div>

                {/* Plant Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plant.acquisitionDate && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Acquired {formatDate(plant.acquisitionDate)}</span>
                    </div>
                  )}
                  {plant.supplier && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{plant.supplier}</span>
                    </div>
                  )}
                </div>

                {plant.notes && (
                  <div className="mt-4 p-4 bg-lime-wash/10 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{plant.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Photos ({plant.photos?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {plant.photos && plant.photos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plant.photos.map((photo) => (
                      <div key={photo.id} className="space-y-2">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={`/uploads/${photo.filename}`}
                            alt={photo.originalName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Uploaded {formatDate(photo.uploadedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No photos available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="w-full bg-cactus-green hover:bg-cactus-green/90 mb-4"
                >
                  Join Cactilog
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Create your free account to start tracking your own collection
                </p>
              </CardContent>
            </Card>

            {/* Amazon Affiliate Products */}
            <AmazonAffiliateBanner 
              title="Recommended Supplies"
              limit={3}
              category="tools"
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}