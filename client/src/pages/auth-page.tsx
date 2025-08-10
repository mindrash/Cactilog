import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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

  // Fetch Google Client ID and load Google Sign-In
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await fetch('/api/auth/config');
        const config = await response.json();
        setGoogleClientId(config.googleClientId);

        if (config.googleClientId) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            if ((window as any).google) {
              (window as any).google.accounts.id.initialize({
                client_id: config.googleClientId,
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
        }
      } catch (error) {
        console.error('Failed to fetch auth config:', error);
        setAuthError('Authentication configuration error');
      }
    };
    
    initializeAuth();
  }, []);

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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 flex items-center justify-center p-4">
      <SEO 
        title="Sign In - Cactilog"
        description="Sign in to Cactilog to manage your cactus and succulent collection."
      />
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-forest">Welcome to Cactilog</CardTitle>
          <p className="text-muted-foreground">Sign in to start tracking your plants</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
              <div id="google-signin-button" className="flex justify-center"></div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}