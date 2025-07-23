import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import StatsCard from "@/components/stats-card";
import PlantCard from "@/components/plant-card";
import { Plant } from "@shared/schema";
import { Sprout, Table, Plus, TrendingUp } from "lucide-react";

export default function Dashboard() {
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

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  const { data: plants = [] } = useQuery<Plant[]>({
    queryKey: ["/api/plants"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const recentPlants = plants.slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Track and manage your plant collection</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Plants"
              value={stats?.totalPlants || 0}
              icon={<Sprout className="text-forest" />}
              bgColor="bg-forest/10"
            />
            <StatsCard
              title="Unique Genera"
              value={stats?.uniqueGenera || 0}
              icon={<Table className="text-sage" />}
              bgColor="bg-sage/10"
            />
            <StatsCard
              title="Recent Additions"
              value={stats?.recentAdditions || 0}
              icon={<Plus className="text-growth" />}
              bgColor="bg-growth/10"
            />
            <StatsCard
              title="Growth Records"
              value={stats?.growthRecords || 0}
              icon={<TrendingUp className="text-soil" />}
              bgColor="bg-soil/10"
            />
          </div>

          {/* Recent Plants */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Plants</h3>
              <a href="/collection" className="text-forest hover:text-sage font-medium">View all →</a>
            </div>

            {recentPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plants yet</h3>
                <p className="text-gray-600 mb-4">Start building your collection by adding your first plant.</p>
                <button className="bg-forest text-white px-4 py-2 rounded-lg hover:bg-forest/90 transition-colors">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add Your First Plant
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
