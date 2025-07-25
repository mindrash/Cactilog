import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Activity, TrendingUp, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PlantCard from "@/components/plant-card";
import type { Plant } from "@shared/schema";

interface DashboardStats {
  totalPlants: number;
  uniqueGenera: number;
  recentAdditions: number;
  growthRecords: number;
}

export default function Home() {
  const { user } = useAuth();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentPlants } = useQuery<Plant[]>({
    queryKey: ["/api/plants"],
    select: (data) => data?.slice(0, 6) || [],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || "Plant Enthusiast"}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your cactus and succulent collection.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
              <Sprout className="h-4 w-4 text-cactus-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPlants || 0}</div>
              <p className="text-xs text-muted-foreground">
                In your collection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Genera</CardTitle>
              <TrendingUp className="h-4 w-4 text-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.uniqueGenera || 0}</div>
              <p className="text-xs text-muted-foreground">
                Different plant types
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
              <Plus className="h-4 w-4 text-desert-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.recentAdditions || 0}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Records</CardTitle>
              <Activity className="h-4 w-4 text-earth-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.growthRecords || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total measurements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Plants Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Plants</h2>
            <div className="space-x-3">
              <Link href="/collection">
                <Button variant="outline">View All</Button>
              </Link>
              <Button className="bg-cactus-green hover:bg-cactus-green/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
            </div>
          </div>

          {recentPlants && recentPlants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No plants yet</CardTitle>
                <CardDescription>
                  Start building your collection by adding your first plant!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-cactus-green hover:bg-cactus-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Plant
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Track Growth</CardTitle>
              <CardDescription>
                Record measurements and monitor your plants' progress over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/growth-tracking">
                <Button variant="outline" className="w-full">
                  <Activity className="w-4 h-4 mr-2" />
                  Growth Tracking
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manage Photos</CardTitle>
              <CardDescription>
                Add and organize photos of your plants to track their visual progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/photos">
                <Button variant="outline" className="w-full">
                  📸 Photo Gallery
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>
                Customize your profile and manage your account preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings">
                <Button variant="outline" className="w-full">
                  ⚙️ Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}