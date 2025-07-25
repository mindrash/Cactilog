import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Eye, EyeOff, Sprout, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PlantCard from "@/components/plant-card";
import Header from "@/components/header";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User, Plant } from "@shared/schema";
import { Link } from "wouter";

interface UserWithStats extends User {
  plantCount: number;
  publicPlantCount: number;
  uniqueGenera: number;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
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

  const { data: user, isLoading: userLoading } = useQuery<UserWithStats>({
    queryKey: ["/api/users", userId],
    enabled: isAuthenticated && !!userId,
  });

  const { data: plants = [], isLoading: plantsLoading } = useQuery<Plant[]>({
    queryKey: ["/api/users", userId, "plants"],
    enabled: isAuthenticated && !!userId && user?.collectionPublic === "public",
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
              <p className="text-gray-600 mb-4">This user profile could not be found.</p>
              <Link href="/users">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={getDisplayName(user)} />
                  <AvatarFallback className="bg-cactus-green text-white text-2xl">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{getDisplayName(user)}</h1>
                
                <div className="flex justify-center mb-4">
                  {user.collectionPublic === "public" ? (
                    <Badge variant="outline" className="text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Public Collection
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      <EyeOff className="w-4 h-4 mr-1" />
                      Private Collection
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cactus-green">{user.publicPlantCount}</div>
                    <div className="text-sm text-gray-600">Public Plants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest">{user.plantCount}</div>
                    <div className="text-sm text-gray-600">Total Plants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-desert-sage">{user.uniqueGenera}</div>
                    <div className="text-sm text-gray-600">Unique Genera</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collection Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getDisplayName(user)}'s Collection
              </h2>
              <p className="text-gray-600">
                {user.collectionPublic === "public" 
                  ? "Browse their public plant collection" 
                  : "This user has chosen to keep their collection private"
                }
              </p>
            </div>

            {user.collectionPublic === "private" ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <EyeOff className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Private Collection
                  </h3>
                  <p className="text-gray-600 text-center">
                    This user has chosen to keep their plant collection private.
                  </p>
                </CardContent>
              </Card>
            ) : plantsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : plants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sprout className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No public plants yet
                  </h3>
                  <p className="text-gray-600 text-center">
                    {getDisplayName(user)} hasn't shared any plants publicly yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}