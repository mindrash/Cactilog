import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import { SEO, seoConfigs } from "@/components/seo";
import { Camera, Heart, User, Calendar, Search, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PublicPhoto {
  photo: {
    id: number;
    filename: string;
    originalName: string;
    uploadedAt: string;
  };
  plant: {
    id: number;
    customId: string;
    genus: string;
    species: string;
    commonName: string;
    updatedAt: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    profileImageUrl: string;
  };
}

export default function Photos() {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { data: photos, isLoading: photosLoading } = useQuery<PublicPhoto[]>({
    queryKey: ["/api/photos/public"],
    enabled: !!isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const filteredPhotos = photos?.filter(item => 
    item.plant.customId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plant.genus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plant.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plant.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${item.user.firstName} ${item.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.plant.updatedAt).getTime() - new Date(a.plant.updatedAt).getTime();
      case "oldest":
        return new Date(a.plant.updatedAt).getTime() - new Date(b.plant.updatedAt).getTime();
      case "genus":
        return a.plant.genus.localeCompare(b.plant.genus);
      default:
        return 0;
    }
  });

  const getUserDisplayName = (user: PublicPhoto['user']) => {
    return user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO {...seoConfigs.photos} />
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title-xl mb-2">Community Photo Gallery</h1>
          <p className="text-gray-600">Explore photos shared by the Cactilog community</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-cactus-green" />
              <span className="text-lg font-semibold">{photos?.length || 0}</span>
              <span className="text-gray-600">photos shared</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-forest" />
              <span className="text-lg font-semibold">
                {new Set(photos?.map(p => p.user.id) || []).size}
              </span>
              <span className="text-gray-600">contributors</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search plants or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent Activity</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="genus">By Genus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Photo Grid */}
        {photosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedPhotos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="subsection-title mb-2">
                {searchTerm ? "No matching photos found" : "No photos shared yet"}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Be the first to share photos of your plants with the community!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPhotos.map((item) => (
              <Card key={`${item.photo.id}-${item.plant.id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Actual photo */}
                <div className="aspect-square bg-gradient-to-br from-cactus-green/10 to-forest/10 overflow-hidden">
                  <img 
                    src={`/uploads/${item.photo.filename}`}
                    alt={`${item.plant.genus} ${item.plant.species || ''} - ${item.photo.originalName || 'Plant Photo'}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      console.error('Failed to load image:', `/uploads/${item.photo.filename}`, 'Original name:', item.photo.originalName);
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-100">
                          <div class="text-center p-4">
                            <svg class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p class="text-sm text-gray-500 font-medium">Image Load Error</p>
                            <p class="text-xs text-gray-400 mt-1">${item.photo.originalName || 'Plant Photo'}</p>
                            <p class="text-xs text-gray-400">File: ${item.photo.filename}</p>
                          </div>
                        </div>
                      `;
                    }}
                    onLoad={() => {
                      console.log('Successfully loaded image:', `/uploads/${item.photo.filename}`);
                    }}
                  />
                </div>
                
                <CardContent className="p-4">
                  {/* Plant Info */}
                  <div className="mb-3">
                    <h3 className="subsection-title text-sm mb-1">
                      {item.plant.customId}
                    </h3>
                    <p className="text-xs text-gray-600 italic">
                      <span className="capitalize">{item.plant.genus}</span>{" "}
                      {item.plant.species && <span>{item.plant.species}</span>}
                    </p>
                    {item.plant.commonName && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.plant.commonName}
                      </p>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.user.profileImageUrl} />
                        <AvatarFallback className="text-xs">
                          {getUserDisplayName(item.user).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600 truncate">
                        {getUserDisplayName(item.user)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.plant.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Badge for genus */}
                  <div className="mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.plant.genus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}