import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Settings as SettingsIcon } from "lucide-react";
import Header from "@/components/header";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [collectionPublic, setCollectionPublic] = useState(true);

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

  // Set initial privacy setting from user data
  useEffect(() => {
    if (user?.collectionPublic) {
      setCollectionPublic(user.collectionPublic === 'public');
    }
  }, [user]);

  const updateCollectionVisibility = useMutation({
    mutationFn: async (visibility: 'public' | 'private') => {
      return await apiRequest('/api/users/collection-visibility', 'PATCH', { visibility });
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your collection visibility has been updated successfully.",
      });
      // Invalidate user query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
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
        description: "Failed to update collection visibility. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCollectionVisibilityChange = (isPublic: boolean) => {
    setCollectionPublic(isPublic);
    updateCollectionVisibility.mutate(isPublic ? 'public' : 'private');
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and privacy settings.
          </p>
        </div>

        <div className="space-y-6">
          {/* Privacy Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Collection Visibility */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Collection Visibility</Label>
                  <div className="text-sm text-gray-600">
                    {collectionPublic ? (
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-green-600" />
                        <span>Your collection is public - other users can browse your plants</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <EyeOff className="w-4 h-4 text-gray-500" />
                        <span>Your collection is private - only you can see your plants</span>
                      </div>
                    )}
                  </div>
                </div>
                <Switch
                  checked={collectionPublic}
                  onCheckedChange={handleCollectionVisibilityChange}
                  disabled={updateCollectionVisibility.isPending}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">What does this control?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Whether other users can see your profile in the Community Collections directory</li>
                  <li>• Whether other users can browse your plant collection</li>
                  <li>• Your public plant count and statistics visibility</li>
                  <li>• Individual plant privacy settings still apply regardless of this setting</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-base">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName || "Not provided"
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-base">{user?.email || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Authentication Provider</Label>
                  <p className="text-base capitalize">{user?.authProvider || "Unknown"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Member Since</Label>
                  <p className="text-base">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : "Unknown"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>More Settings Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <SettingsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Features</h3>
                <p className="text-gray-600 mb-4">
                  More customization options will be available in future updates including:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 text-left max-w-md mx-auto">
                  <li>• Email notification preferences</li>
                  <li>• Display theme customization</li>
                  <li>• Measurement unit preferences</li>
                  <li>• Export and backup options</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}