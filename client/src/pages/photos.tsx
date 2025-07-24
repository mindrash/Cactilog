import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Camera } from "lucide-react";

export default function Photos() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
            <p className="text-gray-600">View and manage photos of your plants</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Photo Gallery Coming Soon</h3>
            <p className="text-gray-600 mb-4">This feature will display all your plant photos in one place.</p>
          </div>
        </main>
      </div>
    </div>
  );
}