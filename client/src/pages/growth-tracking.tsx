import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Plus, TrendingUp, Calendar, Ruler, Eye, Search, BarChart3, Activity, Flower, Heart } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AddGrowthModal from "@/components/add-growth-modal";
import type { Plant, GrowthRecord } from "@shared/schema";

interface PlantWithLatestGrowth extends Plant {
  latestGrowth?: GrowthRecord;
  growthCount: number;
  growthRate?: number;
  daysSinceLastMeasurement?: number;
}

interface GrowthAnalytics {
  totalMeasurements: number;
  plantsWithGrowth: number;
  averageGrowthRate: number;
  fastestGrowing: Array<{ plant: Plant; growthRate: number }>;
  genusGrowthComparison: Array<{ genus: string; averageGrowthRate: number; count: number }>;
  healthTrends: Array<{ month: string; averageHealth: number }>;
  floweringActivity: Array<{ genus: string; floweringCount: number; totalCount: number }>;
}

export default function GrowthTracking() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

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

  const { data: plants, isLoading: plantsLoading } = useQuery<PlantWithLatestGrowth[]>({
    queryKey: ["/api/plants/growth-overview"],
    enabled: !!isAuthenticated,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<GrowthAnalytics>({
    queryKey: ["/api/growth/analytics"],
    enabled: !!isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const filteredPlants = plants?.filter(plant => 
    (plant.customId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.genus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plant.species || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedPlants = [...filteredPlants].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.latestGrowth?.date || 0).getTime() - new Date(a.latestGrowth?.date || 0).getTime();
      case "most-records":
        return b.growthCount - a.growthCount;
      case "name":
        return (a.customId || `${a.genus} ${a.species || ''}`).localeCompare(b.customId || `${b.genus} ${b.species || ''}`);
      default:
        return 0;
    }
  });

  const colors = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title-xl mb-2">Growth Tracking</h1>
          <p className="text-gray-600">Monitor and analyze your plants' growth over time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plants with Records</CardTitle>
              <TrendingUp className="h-4 w-4 text-cactus-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plants?.filter(p => p.growthCount > 0).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                of {plants?.length || 0} total plants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Measurements</CardTitle>
              <Ruler className="h-4 w-4 text-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plants?.reduce((sum, p) => sum + p.growthCount, 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                growth records logged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-desert-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {plants?.filter(p => p.latestGrowth && 
                  new Date(p.latestGrowth.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                plants measured this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent Activity</SelectItem>
                <SelectItem value="most-records">Most Records</SelectItem>
                <SelectItem value="name">Plant Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="plants">Plants</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Measurements</CardTitle>
                    <BarChart3 className="h-4 w-4 text-cactus-green" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalMeasurements}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {analytics.plantsWithGrowth} plants
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Growth Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-forest" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.averageGrowthRate.toFixed(2)}"
                    </div>
                    <p className="text-xs text-muted-foreground">
                      inches per month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Health Average</CardTitle>
                    <Heart className="h-4 w-4 text-desert-sage" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.healthTrends.length > 0 
                        ? (analytics.healthTrends.reduce((sum, trend) => sum + trend.averageHealth, 0) / analytics.healthTrends.length).toFixed(1)
                        : "N/A"
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      out of 10
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Flowering Plants</CardTitle>
                    <Flower className="h-4 w-4 text-succulent-green" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.floweringActivity.reduce((sum, activity) => sum + activity.floweringCount, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      currently flowering
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Fastest Growing Plants */}
            {analytics?.fastestGrowing && analytics.fastestGrowing.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cactus-green" />
                    Fastest Growing Plants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.fastestGrowing.slice(0, 5).map((item, index) => (
                      <div key={item.plant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">
                            {item.plant.customId || `${item.plant.genus} ${item.plant.species || ''}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.plant.genus} {item.plant.species}
                            {item.plant.cultivar && ` '${item.plant.cultivar}'`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-cactus-green">
                            {item.growthRate.toFixed(2)}" /mo
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Genus Growth Comparison */}
              {analytics?.genusGrowthComparison && analytics.genusGrowthComparison.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Rate by Genus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.genusGrowthComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="genus" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value.toFixed(2)}" /mo`, "Growth Rate"]} />
                        <Bar dataKey="averageGrowthRate" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Flowering Activity */}
              {analytics?.floweringActivity && analytics.floweringActivity.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Flowering Activity by Genus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.floweringActivity}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="floweringCount"
                        >
                          {analytics.floweringActivity.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number, name: string, props: any) => [
                          `${value} flowering`,
                          props.payload.genus
                        ]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {/* Health Trends Over Time */}
            {analytics?.healthTrends && analytics.healthTrends.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Health Trends Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={analytics.healthTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)} / 10`, "Average Health"]} />
                      <Line 
                        type="monotone" 
                        dataKey="averageHealth" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Growth Distribution */}
            {analytics?.genusGrowthComparison && analytics.genusGrowthComparison.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Growth Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={analytics.genusGrowthComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="genus" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}" /mo`, "Growth Rate"]} />
                      <Area 
                        type="monotone" 
                        dataKey="averageGrowthRate" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="plants" className="space-y-6">
            {/* Plant Growth Overview */}
            {plantsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedPlants.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="subsection-title mb-2">
                    {searchTerm ? "No matching plants found" : "Start tracking growth"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm 
                      ? "Try adjusting your search terms" 
                      : "Add measurements to your plants to begin growth tracking"
                    }
                  </p>
                  {!searchTerm && (
                    <Link href="/collection">
                      <Button className="bg-cactus-green hover:bg-cactus-green/90">
                        <Eye className="w-4 h-4 mr-2" />
                        View Collection
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPlants.map((plant) => (
                  <Card key={plant.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="subsection-title mb-1">
                            {plant.customId || `${plant.genus} ${plant.species || ''}`}
                          </h3>
                          <p className="text-sm text-gray-600 italic">
                            {plant.genus} {plant.species || ''}
                          </p>
                        </div>
                        <Badge variant={plant.growthCount > 0 ? "default" : "secondary"}>
                          {plant.growthCount} records
                        </Badge>
                      </div>

                      {plant.latestGrowth ? (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Latest:</span>{" "}
                            {new Date(plant.latestGrowth.date).toLocaleDateString()}
                          </div>
                          {plant.latestGrowth.heightInches && (
                            <div className="text-sm">
                              <span className="text-gray-600">Height:</span>{" "}
                              <span className="font-medium">{plant.latestGrowth.heightInches}"</span>
                            </div>
                          )}
                          {plant.latestGrowth.widthInches && (
                            <div className="text-sm">
                              <span className="text-gray-600">Width:</span>{" "}
                              <span className="font-medium">{plant.latestGrowth.widthInches}"</span>
                            </div>
                          )}
                          {plant.growthRate && (
                            <div className="text-sm">
                              <span className="text-gray-600">Growth rate:</span>{" "}
                              <span className="font-medium text-cactus-green">
                                {plant.growthRate.toFixed(2)}" /mo
                              </span>
                            </div>
                          )}
                          {plant.daysSinceLastMeasurement !== undefined && (
                            <div className="text-sm">
                              <span className="text-gray-600">Days since:</span>{" "}
                              <span className={`font-medium ${
                                plant.daysSinceLastMeasurement > 60 ? 'text-red-600' : 
                                plant.daysSinceLastMeasurement > 30 ? 'text-yellow-600' : 
                                'text-green-600'
                              }`}>
                                {plant.daysSinceLastMeasurement} days
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          No measurements yet
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4">
                        {plant ? (
                          <AddGrowthModal plant={plant}>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Record
                            </Button>
                          </AddGrowthModal>
                        ) : (
                          <Button size="sm" variant="outline" className="flex-1" disabled>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Record
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
