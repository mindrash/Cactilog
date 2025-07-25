import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Settings as SettingsIcon, Camera, User, Save } from "lucide-react";
import Header from "@/components/header";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [collectionPublic, setCollectionPublic] = useState(true);
  const [contributePhotos, setContributePhotos] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");

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

  // Set initial settings from user data
  useEffect(() => {
    if (user?.collectionPublic) {
      setCollectionPublic(user.collectionPublic === 'public');
    }
    if (user?.contributePhotosToKnowledgeBase !== undefined && user?.contributePhotosToKnowledgeBase !== null) {
      setContributePhotos(user.contributePhotosToKnowledgeBase);
    }
    setDisplayName(user?.displayName || "");
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

  const updateKnowledgeBaseContribution = useMutation({
    mutationFn: async (contribute: boolean) => {
      return await apiRequest('/api/users/knowledge-base-contribution', 'PATCH', { contribute });
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your Knowledge Base contribution setting has been updated successfully.",
      });
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
        description: "Failed to update Knowledge Base contribution setting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateDisplayName = useMutation({
    mutationFn: async (name: string) => {
      return await apiRequest('/api/auth/user/display-name', 'PUT', { displayName: name });
    },
    onSuccess: () => {
      toast({
        title: "Display Name Updated",
        description: "Your collection display name has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setDisplayNameError("");
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
      
      const errorMessage = error instanceof Error ? error.message : "Failed to update display name";
      setDisplayNameError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleCollectionVisibilityChange = (isPublic: boolean) => {
    setCollectionPublic(isPublic);
    updateCollectionVisibility.mutate(isPublic ? 'public' : 'private');
  };

  const handleKnowledgeBaseContributionChange = (contribute: boolean) => {
    setContributePhotos(contribute);
    updateKnowledgeBaseContribution.mutate(contribute);
  };

  const handleDisplayNameSubmit = () => {
    if (displayName.length > 20) {
      setDisplayNameError("Display name must be 20 characters or less");
      return;
    }
    
    setDisplayNameError("");
    updateDisplayName.mutate(displayName);
  };

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    setDisplayNameError("");
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

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Contribute Photos to Knowledge Base
                  </Label>
                  <div className="text-sm text-gray-600">
                    {contributePhotos ? (
                      <div className="flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        Your plant photos can appear in the Knowledge Base for matching genus/species
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-1" />
                        Your photos will only appear in your personal collection
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Help other plant enthusiasts by sharing your photos with proper attribution
                  </div>
                </div>
                <Switch
                  checked={contributePhotos}
                  onCheckedChange={handleKnowledgeBaseContributionChange}
                  disabled={updateKnowledgeBaseContribution.isPending}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">What does this control?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Whether other users can see your profile in the Community Collections directory</li>
                  <li>• Whether other users can browse your plant collection</li>
                  <li>• Your public plant count and statistics visibility</li>
                  <li>• Individual plant privacy settings still apply regardless of this setting</li>
                  <li>• <strong>Knowledge Base Photos:</strong> When enabled, your plant photos will also appear in the species galleries for educational purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Collection Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display Name Section */}
              <div className="space-y-2">
                <Label htmlFor="display-name" className="text-base font-medium">
                  Collection Display Name
                </Label>
                <p className="text-sm text-gray-600">
                  Choose how your name appears on your public collection (max 20 characters)
                </p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="display-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => handleDisplayNameChange(e.target.value)}
                      placeholder={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.email?.split("@")[0] || "Your display name")}
                      maxLength={20}
                      disabled={updateDisplayName.isPending}
                      className={displayNameError ? "border-red-500" : ""}
                    />
                    {displayNameError && (
                      <p className="text-sm text-red-600 mt-1">{displayNameError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {displayName.length}/20 characters
                    </p>
                  </div>
                  <Button
                    onClick={handleDisplayNameSubmit}
                    disabled={updateDisplayName.isPending}
                    size="sm"
                    className="min-w-[80px]"
                  >
                    {updateDisplayName.isPending ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Account Information */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Account Information</h4>
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