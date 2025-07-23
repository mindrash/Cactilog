import { Sprout } from "lucide-react";
import { FaGoogle, FaFacebook, FaGithub, FaTwitter, FaApple, FaMicrosoft } from "react-icons/fa";

interface OAuthProvider {
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  hoverColor: string;
  endpoint: string;
}

const oauthProviders: OAuthProvider[] = [
  {
    name: "Google",
    icon: <FaGoogle className="w-5 h-5" />,
    bgColor: "bg-white",
    textColor: "text-gray-700",
    hoverColor: "hover:bg-gray-50",
    endpoint: "/api/login/google"
  },
  {
    name: "Facebook",
    icon: <FaFacebook className="w-5 h-5" />,
    bgColor: "bg-blue-600",
    textColor: "text-white",
    hoverColor: "hover:bg-blue-700",
    endpoint: "/api/login/facebook"
  },
  {
    name: "GitHub",
    icon: <FaGithub className="w-5 h-5" />,
    bgColor: "bg-gray-900",
    textColor: "text-white",
    hoverColor: "hover:bg-gray-800",
    endpoint: "/api/login/github"
  },
  {
    name: "Twitter",
    icon: <FaTwitter className="w-5 h-5" />,
    bgColor: "bg-blue-400",
    textColor: "text-white",
    hoverColor: "hover:bg-blue-500",
    endpoint: "/api/login/twitter"
  },
  {
    name: "Microsoft",
    icon: <FaMicrosoft className="w-5 h-5" />,
    bgColor: "bg-blue-500",
    textColor: "text-white",
    hoverColor: "hover:bg-blue-600",
    endpoint: "/api/login/microsoft"
  },
  {
    name: "Apple",
    icon: <FaApple className="w-5 h-5" />,
    bgColor: "bg-black",
    textColor: "text-white",
    hoverColor: "hover:bg-gray-800",
    endpoint: "/api/login/apple"
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-sage/10 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="text-white text-2xl" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CactiTracker</h2>
            <p className="text-gray-600">Manage your plant collection with ease</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {oauthProviders.map((provider) => (
              <button 
                key={provider.name}
                onClick={() => window.location.href = provider.endpoint}
                className={`w-full ${provider.bgColor} ${provider.textColor} ${provider.hoverColor} border-2 ${provider.name === 'Google' ? 'border-gray-300' : 'border-transparent'} rounded-lg px-4 py-3 flex items-center justify-center transition-colors font-medium shadow-sm`}
              >
                {provider.icon}
                <span className="ml-3">Continue with {provider.name}</span>
              </button>
            ))}
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 mb-2">
              Choose your preferred sign-in method
            </p>
            <p className="text-xs text-gray-400">
              All providers support the same features and data access
            </p>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
