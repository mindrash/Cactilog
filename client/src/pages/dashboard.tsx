import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import StatsCard from "@/components/stats-card";
import PlantCard from "@/components/plant-card";
import AddPlantModal from "@/components/add-plant-modal";
import { SEO, seoConfigs } from "@/components/seo";
import AmazonAffiliateProducts from "@/components/amazon-affiliate-products";
import { Plant } from "@shared/schema";
import { getFeaturedProducts } from "@shared/amazon-products";
import { Sprout, Table, Plus, TrendingUp } from "lucide-react";
import CactusIcon from "@/components/cactus-icon";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/cactilog-logo.png";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

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

  const { data: stats } = useQuery<{
    totalPlants: number;
    uniqueGenera: number;
    recentAdditions: number;
    growthRecords: number;
  }>({
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
  const featuredProducts = getFeaturedProducts('home');

  return (
    <div className="min-h-screen cactus-pattern-bg-light">
      <SEO {...seoConfigs.dashboard} />
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="page-title-xl mb-2">Dashboard</h2>
                <p className="text-gray-600">Track and manage your plant collection</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="bg-cactus-green hover:bg-succulent">
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Plants"
              value={stats?.totalPlants || 0}
              icon={<img 
                src={logoImage} 
                alt="Plants"
                className="w-5 h-5 object-contain"
              />}
              bgColor="bg-cactus-green/10"
            />
            <StatsCard
              title="Unique Genera"
              value={stats?.uniqueGenera || 0}
              icon={<Table className="text-succulent" />}
              bgColor="bg-succulent/10"
            />
            <StatsCard
              title="Recent Additions"
              value={stats?.recentAdditions || 0}
              icon={<Plus className="text-desert-sage" />}
              bgColor="bg-desert-sage/10"
            />
            <StatsCard
              title="Growth Records"
              value={stats?.growthRecords || 0}
              icon={<TrendingUp className="text-jade" />}
              bgColor="bg-jade/10"
            />
          </div>

          {/* Recent Plants */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title">Recent Plants</h3>
              <a href="/collection" className="text-cactus-green hover:text-succulent font-medium">View all →</a>
            </div>

            {recentPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <img 
                  src={logoImage} 
                  alt="No plants"
                  className="w-12 h-12 object-contain mx-auto mb-4 opacity-40"
                />
                <h3 className="section-title mb-2">No plants yet</h3>
                <p className="text-gray-600 mb-4">Start building your collection by adding your first plant.</p>
                <Button onClick={() => setShowAddModal(true)} className="bg-cactus-green hover:bg-succulent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Plant
                </Button>
              </div>
            )}
          </div>

          {/* Amazon Affiliate Products Section */}
          <div className="mt-8">
            <AmazonAffiliateProducts 
              products={featuredProducts}
              title="Top-Rated Cactus & Succulent Supplies"
              context="Essential Tools"
            />
          </div>
        </main>
      </div>

      <AddPlantModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
