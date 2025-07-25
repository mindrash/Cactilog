import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Collection from "@/pages/collection";
import GrowthTracking from "@/pages/growth-tracking";
import Photos from "@/pages/photos";
import Users from "@/pages/users";
import UserProfile from "@/pages/user-profile";
import Knowledge from "@/pages/knowledge";
import KnowledgeSearch from "@/pages/knowledge-search";
import KnowledgeGenus from "@/pages/knowledge-genus";
import KnowledgeSpecies from "@/pages/knowledge-species";
import KnowledgeVariant from "@/pages/knowledge-variant";
import KnowledgeCareGuides from "@/pages/knowledge-care-guides";
import Import from "@/pages/import";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="*" component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/collection" component={Collection} />
          <Route path="/growth-tracking" component={GrowthTracking} />
          <Route path="/photos" component={Photos} />
          <Route path="/users" component={Users} />
          <Route path="/users/:userId" component={UserProfile} />
          <Route path="/knowledge" component={Knowledge} />
          <Route path="/knowledge/search" component={KnowledgeSearch} />
          <Route path="/knowledge/genus/:genusName" component={KnowledgeGenus} />
          <Route path="/knowledge/species/:genusName/:speciesName" component={KnowledgeSpecies} />
          <Route path="/knowledge/variant/:genusName/:speciesName/:variantName" component={KnowledgeVariant} />
          <Route path="/knowledge/care-guides" component={KnowledgeCareGuides} />
          <Route path="/import" component={Import} />
          <Route path="/settings" component={Settings} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
