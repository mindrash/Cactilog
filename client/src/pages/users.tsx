import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useAuthOptional } from "@/hooks/useAuth";
import { SEO, seoConfigs } from "@/components/seo";
import { Users as UsersIcon, Sprout, Eye, EyeOff, ArrowUpDown, Heart, TreePine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/schema";
import { getFeaturedProducts } from "@shared/amazon-products";

interface UserWithStats extends User {
  plantCount: number;
  publicPlantCount: number;
  uniqueGenera: number;
  totalLikes: number;
  latestPlantDate: Date | null;
}

export default function Users() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuthOptional();
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'cacti'>('latest');

  const { data: users = [], isLoading: usersLoading } = useQuery<UserWithStats[]>({
    queryKey: [`/api/users/public?sortBy=${sortBy}`],
  });

  // Get featured products for community page
  const featuredProducts = getFeaturedProducts('collection');

  const getInitials = (user: UserWithStats) => {
    // If user has custom display name, use first 2 characters of that
    if (user.displayName && user.displayName.trim()) {
      const cleanName = user.displayName.trim();
      if (cleanName.length >= 2) {
        return cleanName.substring(0, 2).toUpperCase();
      } else {
        return cleanName[0].toUpperCase();
      }
    }
    
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const email = user.email || "";
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = (user: UserWithStats) => {
    // Prioritize custom display name if set
    if (user.displayName && user.displayName.trim()) {
      return user.displayName;
    }
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.email) {
      return user.email.split("@")[0];
    }
    return "Anonymous";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO {...seoConfigs.users} />
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="page-title-xl mb-2">Community Collections</h1>
              <p className="text-gray-600">
                Discover fellow cactus and succulent enthusiasts and browse their public collections.
              </p>
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={(value: 'latest' | 'likes' | 'cacti') => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-green-600" />
                      Latest Changes
                    </div>
                  </SelectItem>
                  <SelectItem value="likes">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Most Likes
                    </div>
                  </SelectItem>
                  <SelectItem value="cacti">
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-cactus-green" />
                      Most Cacti
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {usersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="h-6 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link key={user.id} href={`/users/${user.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={getDisplayName(user)} />
                      <AvatarFallback className="bg-cactus-green text-white">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{getDisplayName(user)}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {user.collectionPublic === "public" ? (
                          <Badge variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Public Collection
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private Collection
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xl font-bold text-cactus-green">{user.publicPlantCount}</div>
                          <div className="text-xs text-gray-600">Public Plants</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-forest">{user.plantCount}</div>
                          <div className="text-xs text-gray-600">Total Plants</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-desert-sage">{user.uniqueGenera}</div>
                          <div className="text-xs text-gray-600">Genera</div>
                        </div>
                      </div>
                      
                      {/* Additional stats based on sort type */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-gray-600">{user.totalLikes || 0} likes</span>
                          </div>
                          {user.latestPlantDate && (
                            <div className="flex items-center gap-1">
                              <Sprout className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600">
                                {new Date(user.latestPlantDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UsersIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="subsection-title mb-2">
                No public collections yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your collection with the community!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Amazon Affiliate Products */}
        <div className="mt-8 bg-white/50 rounded-lg p-6">
          <div className="text-center mb-4">
            <h3 className="section-title mb-2">Essential Supplies for Collectors</h3>
            <p className="text-sm text-gray-600">Popular products from our community of collectors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyNEMyOC42ODYzIDI0IDI2IDI2LjY4NjMgMjYgMzBDMjYgMzMuMzEzNyAyOC42ODYzIDM2IDMyIDM2QzM1LjMxMzcgMzYgMzggMzMuMzEzNyAzOCAzMEMzOCAyNi42ODYzIDM1LjMxMzcgMjQgMzIgMjRaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-cactus-green">
                          {product.price}
                        </span>
                        <a 
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-cactus-green text-white px-2 py-1 rounded hover:bg-cactus-green/90 transition-colors"
                        >
                          Shop Now
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <a 
              href="/vendors" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/vendors'; }}
              className="text-sm text-cactus-green hover:text-cactus-green/80 underline"
            >
              View All Trusted Vendors & Products →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}