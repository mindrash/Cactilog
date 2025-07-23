import { Sprout } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-sage/10 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="text-white text-2xl" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CactiTracker</h2>
            <p className="text-gray-600">Manage your plant collection with ease</p>
          </div>
          
          <button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center hover:bg-gray-50 transition-colors mb-4"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>
          
          <div className="text-center text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
