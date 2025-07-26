import { Switch, Route, useLocation } from "wouter";
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
import RecommendedSocials from "@/pages/recommended-socials";
import Users from "@/pages/users";
import UserProfile from "@/pages/user-profile";
import Knowledge from "@/pages/knowledge";
import KnowledgeSearch from "@/pages/knowledge-search";
import KnowledgeGenus from "@/pages/knowledge-genus";
import KnowledgeSpecies from "@/pages/knowledge-species";
import KnowledgeVariant from "@/pages/knowledge-variant";
import KnowledgeCareGuides from "@/pages/knowledge-care-guides";
import KnowledgeDiseasesAndPests from "@/pages/knowledge-diseases-pests";
import Import from "@/pages/import";
import Settings from "@/pages/settings";
import Vendors from "@/pages/vendors";
import AdminDashboard from "@/pages/admin-dashboard";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Disclaimer from "@/pages/disclaimer";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Get current path to determine if it's a public route
  const [location] = useLocation();
  const publicRoutes = [
    '/', '/photos', '/users', '/knowledge', '/vendors', '/recommended-socials', '/about', 
    '/contact', '/privacy', '/terms', '/disclaimer', '/auth'
  ];
  const isPublicRoute = publicRoutes.some(route => 
    location === route || 
    location.startsWith('/knowledge/') || 
    location.startsWith('/users/')
  );

  // Only show loading for private routes
  if (isLoading && !isPublicRoute) {
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
          <Route path="/photos" component={Photos} />
          <Route path="/recommended-socials" component={RecommendedSocials} />
          <Route path="/users" component={Users} />
          <Route path="/users/:userId" component={UserProfile} />
          <Route path="/knowledge" component={Knowledge} />
          <Route path="/knowledge/search" component={KnowledgeSearch} />
          <Route path="/knowledge/genus/:genusName" component={KnowledgeGenus} />
          <Route path="/knowledge/species/:genusName/:speciesName" component={KnowledgeSpecies} />
          <Route path="/knowledge/variant/:genusName/:speciesName/:variantName" component={KnowledgeVariant} />
          <Route path="/knowledge/care-guides" component={KnowledgeCareGuides} />
          <Route path="/knowledge/diseases-pests" component={KnowledgeDiseasesAndPests} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/auth" component={AuthPage} />
          <Route path="*" component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/collection" component={Collection} />
          <Route path="/growth-tracking" component={GrowthTracking} />
          <Route path="/photos" component={Photos} />
          <Route path="/recommended-socials" component={RecommendedSocials} />
          <Route path="/users" component={Users} />
          <Route path="/users/:userId" component={UserProfile} />
          <Route path="/knowledge" component={Knowledge} />
          <Route path="/knowledge/search" component={KnowledgeSearch} />
          <Route path="/knowledge/genus/:genusName" component={KnowledgeGenus} />
          <Route path="/knowledge/species/:genusName/:speciesName" component={KnowledgeSpecies} />
          <Route path="/knowledge/variant/:genusName/:speciesName/:variantName" component={KnowledgeVariant} />
          <Route path="/knowledge/care-guides" component={KnowledgeCareGuides} />
          <Route path="/knowledge/diseases-pests" component={KnowledgeDiseasesAndPests} />
          <Route path="/vendors" component={Vendors} />
          <Route path="/import" component={Import} />
          <Route path="/settings" component={Settings} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/disclaimer" component={Disclaimer} />
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
