import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";
import { SEO } from "@/components/seo";

declare global {
  interface Window {
    handleCredentialResponse: (response: any) => void;
  }
}

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState("");
  const [authError, setAuthError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  // Fetch Google Client ID
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/auth/config');
        const config = await response.json();
        setGoogleClientId(config.googleClientId);
      } catch (error) {
        console.error('Failed to fetch auth config:', error);
        setAuthError('Authentication configuration error');
      }
    };
    
    fetchConfig();
  }, []);

  // Load Google Sign-In script
  useEffect(() => {
    if (!googleClientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: window.handleCredentialResponse,
        });
        
        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { 
            theme: "outline", 
            size: "large",
            width: "320",
            text: "continue_with"
          }
        );
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [googleClientId]);

  // Handle Google Sign-In response
  useEffect(() => {
    window.handleCredentialResponse = async (response: any) => {
      setGoogleLoading(true);
      setAuthError("");
      
      try {
        const authResponse = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
          credentials: 'include',
        });

        if (authResponse.ok) {
          const data = await authResponse.json();
          console.log('Authentication successful:', data);
          // Force page reload to update auth state
          window.location.href = '/';
        } else {
          const errorData = await authResponse.json();
          setAuthError(errorData.error || 'Authentication failed');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthError('Authentication failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 flex items-center justify-center p-4">
      <SEO 
        title="Sign In - Cactilog"
        description="Sign in to Cactilog to manage your cactus and succulent collection, track growth, and connect with fellow plant enthusiasts."
      />
      
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-forest">
              Welcome to Cactilog
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to start tracking your plant collection
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}
            
            <div className="text-center">
              {googleLoading ? (
                <Button disabled className="w-full">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </Button>
              ) : (
                <div>
                  <div id="google-signin-button" className="flex justify-center"></div>
                  {!googleClientId && (
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = '/api/login'}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Continue with Authentication
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center space-y-3">
          <h3 className="text-lg font-medium text-forest">What you'll get with Cactilog</h3>
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <span>📱</span>
              <span>Track your plant collection with photos</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>📈</span>
              <span>Monitor growth and health over time</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🌐</span>
              <span>Connect with plant enthusiasts worldwide</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>📚</span>
              <span>Access expert care guides and species info</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}