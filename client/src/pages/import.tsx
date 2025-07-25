import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Upload } from "lucide-react";

export default function Import() {
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
            <h2 className="text-2xl font-bold font-freckle-face title-cactus-green mb-2">Import Data</h2>
            <p className="text-gray-600">Import your existing plant collection data</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium font-freckle-face title-cactus-green mb-2">Data Import Coming Soon</h3>
            <p className="text-gray-600 mb-4">This feature will allow you to import plant data from CSV files.</p>
          </div>
        </main>
      </div>
    </div>
  );
}