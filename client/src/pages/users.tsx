import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Users as UsersIcon, Sprout, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/schema";

interface UserWithStats extends User {
  plantCount: number;
  publicPlantCount: number;
  uniqueGenera: number;
}

export default function Users() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: users = [], isLoading: usersLoading } = useQuery<UserWithStats[]>({
    queryKey: ["/api/users/public"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const getInitials = (user: UserWithStats) => {
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
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Members</h1>
          <p className="text-gray-600">
            Discover fellow cactus and succulent enthusiasts and browse their public collections.
          </p>
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UsersIcon className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No public collections yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your collection with the community!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}