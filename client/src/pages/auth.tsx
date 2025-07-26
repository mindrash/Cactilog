import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import { Chrome, Github, Twitter, Facebook } from "lucide-react";
import { FaApple, FaMicrosoft } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [googleClientId, setGoogleClientId] = useState<string>('');

  // Get configuration from backend
  useEffect(() => {
    fetch('/api/auth/config')
      .then(res => res.json())
      .then(config => {
        setGoogleClientId(config.googleClientId);
      })
      .catch(err => console.error('Failed to load auth config:', err));
  }, []);

  // Load Google Identity Services
  useEffect(() => {
    if (!googleClientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: false,
        });
        
        // Also render a proper Google button
        setTimeout(() => {
          const buttonElement = document.getElementById('google-signin-button');
          if (buttonElement) {
            window.google.accounts.id.renderButton(buttonElement, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'rectangular',
              text: 'continue_with',
              logo_alignment: 'left',
              width: '300',
            });
          }
        }, 100);
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [googleClientId]);

  const handleGoogleSignIn = async (response: any) => {
    try {
      console.log('Google sign-in response received:', response);
      
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (result.ok) {
        const data = await result.json();
        console.log('Authentication successful:', data);
        window.location.href = '/';
      } else {
        const errorData = await result.json();
        console.error('Google sign-in failed:', errorData);
        alert('Sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Sign-in error. Please try again.');
    }
  };

  const handleGoogleButtonClick = () => {
    if (window.google && googleClientId) {
      window.google.accounts.id.prompt();
    } else {
      console.error('Google Sign-In not ready or client ID missing');
    }
  };

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cactus-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Authentication Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to Cactilog
            </CardTitle>
            <CardDescription>
              Sign in with your preferred provider to start managing your plant collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign-In */}
            {googleClientId ? (
              <div className="space-y-2">
                <div id="google-signin-button" className="w-full flex justify-center min-h-[44px]"></div>
                
                {/* Fallback manual button in case the Google button doesn't render */}
                <Button 
                  onClick={handleGoogleButtonClick}
                  variant="outline" 
                  className="w-full h-12 flex items-center justify-center gap-3 border-blue-300 hover:bg-blue-50"
                >
                  <Chrome className="w-5 h-5 text-blue-500" />
                  Continue with Google
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                disabled
                className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-gray-50 cursor-not-allowed"
              >
                <Chrome className="w-5 h-5 text-gray-400" />
                Loading Google Sign-In...
              </Button>
            )}

            {/* Facebook - Coming Soon */}
            <Button 
              variant="outline" 
              disabled
              className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-gray-50 cursor-not-allowed"
            >
              <Facebook className="w-5 h-5 text-gray-400" />
              Continue with Facebook (Coming Soon)
            </Button>

            {/* Twitter - Coming Soon */}
            <Button 
              variant="outline" 
              disabled
              className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-gray-50 cursor-not-allowed"
            >
              <Twitter className="w-5 h-5 text-gray-400" />
              Continue with Twitter (Coming Soon)
            </Button>

            {/* GitHub - Coming Soon */}
            <Button 
              variant="outline" 
              disabled
              className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-gray-50 cursor-not-allowed"
            >
              <Github className="w-5 h-5 text-gray-400" />
              Continue with GitHub (Coming Soon)
            </Button>

            {/* Microsoft - Coming Soon */}
            <Button 
              variant="outline" 
              disabled
              className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-gray-50 cursor-not-allowed"
            >
              <FaMicrosoft className="w-5 h-5 text-gray-400" />
              Continue with Microsoft (Coming Soon)
            </Button>

            {/* Apple - Coming Soon */}
            <Button 
              variant="outline" 
              disabled
              className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 bg-gray-50 cursor-not-allowed"
            >
              <FaApple className="w-5 h-5 text-gray-400" />
              Continue with Apple (Coming Soon)
            </Button>

            <div className="text-center text-sm text-gray-500 mt-6">
              No account needed - just sign in with Google to get started
            </div>


          </CardContent>
        </Card>

        {/* Hero Section */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Complete Platform for
              <span className="text-cactus-green block">Cactus & Succulent</span>
              <span className="text-succulent-green">Enthusiasts</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Track your collection, connect with thousands of collectors, and access comprehensive botanical knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cactus-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Collection Management</h3>
                <p className="text-sm text-gray-600">Track 1,200+ species with photos and growth data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-succulent-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Vibrant Community</h3>
                <p className="text-sm text-gray-600">Connect with collectors worldwide</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cactus-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Growth Analytics</h3>
                <p className="text-sm text-gray-600">Monitor progress with detailed tracking</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-succulent-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Complete Privacy Control</h3>
                <p className="text-sm text-gray-600">Your data, your choice of visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}