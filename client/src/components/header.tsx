import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Plus, Menu, User, LogOut, LogIn, ChevronDown, Home, BarChart3, FolderOpen, TrendingUp, Camera, Users, Settings, Sprout, BookOpen, Search, Shield, Leaf, Store, Share2, FileText } from "lucide-react";
import { useAuthOptional } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CactusIcon from "@/components/cactus-icon";
import AddPlantModal from "@/components/add-plant-modal";
import logoImage from "@/assets/cactilog-logo.png";

const navigationGroups = {
  main: [
    { href: "/", label: "Home", icon: Home },
  ],
  myCollection: [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/collection", label: "Collection", icon: FolderOpen },
    { href: "/growth-tracking", label: "Growth Tracking", icon: TrendingUp },
    { href: "/photos", label: "Photos", icon: Camera },
  ],
  community: [
    { href: "/users", label: "Community Collections", icon: Users },
    { href: "/community/photos", label: "Photo Gallery", icon: Camera },
    { href: "/articles", label: "Articles", icon: FileText },
    { href: "/recommended-socials", label: "Recommended Socials", icon: Share2 },
  ],
  knowledge: [
    { href: "/knowledge", label: "Browse Genera", icon: BookOpen },
    { href: "/knowledge/search", label: "Species Search", icon: Search },
    { href: "/knowledge/care-guides", icon: Leaf, label: "Care Guides" },
    { href: "/knowledge/diseases-pests", icon: Shield, label: "Diseases & Pests" },
    { href: "/vendors", label: "Trusted Vendors", icon: Store },
  ],
  account: [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/admin", label: "Admin Dashboard", icon: Shield, adminOnly: true },
    { href: "/admin/articles", label: "Manage Articles", icon: FileText, adminOnly: true },
  ],
};

function Header() {
  const { user, isAuthenticated } = useAuthOptional();
  const [location] = useLocation();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check admin status
  const { data: adminStatus } = useQuery({
    queryKey: ["/api/admin/status"],
    enabled: !!user,
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  const isGroupActive = (items: typeof navigationGroups.myCollection) => {
    return items?.some(item => isActive(item.href)) || false;
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 mr-4 lg:mr-8">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Cactilog"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="cactilog-title font-bold">
                  <span className="cacti-green">Cacti</span><span className="log-green">log</span>
                  <span className="beta-superscript">BETA</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Public Navigation - shown when not authenticated */}
              {!isAuthenticated && (
                <>
                  {/* Community Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={isGroupActive(navigationGroups.community) ? "default" : "ghost"}
                        className={isGroupActive(navigationGroups.community) ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Community
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Community</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {navigationGroups.community.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <DropdownMenuItem className="cursor-pointer">
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Knowledge Base Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={isGroupActive(navigationGroups.knowledge.slice(0, -1)) ? "default" : "ghost"}
                        className={isGroupActive(navigationGroups.knowledge.slice(0, -1)) ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Knowledge Base
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Knowledge Base</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {navigationGroups.knowledge.slice(0, -1).map((item) => (
                        <Link key={item.href} href={item.href}>
                          <DropdownMenuItem className="cursor-pointer">
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                          </DropdownMenuItem>
                        </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Vendors Link */}
                  <Link href="/vendors">
                    <Button
                      variant={isActive("/vendors") ? "default" : "ghost"}
                      className={isActive("/vendors") ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Vendors
                    </Button>
                  </Link>
                </>
              )}

              {/* Authenticated Navigation - shown when logged in */}
              {isAuthenticated && (
                <>
                  {/* Home */}
                  {navigationGroups.main.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={isActive(item.href) ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}

                  {/* My Collection Dropdown */}
                  <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isGroupActive(navigationGroups.myCollection) ? "default" : "ghost"}
                    className={isGroupActive(navigationGroups.myCollection) ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    My Cacti
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>My Cacti</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navigationGroups.myCollection.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Community Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isGroupActive(navigationGroups.community) ? "default" : "ghost"}
                    className={isGroupActive(navigationGroups.community) ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Community
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Community</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navigationGroups.community.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Knowledge Base Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isGroupActive(navigationGroups.knowledge) ? "default" : "ghost"}
                    className={isGroupActive(navigationGroups.knowledge) ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Knowledge Base
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Knowledge Base</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navigationGroups.knowledge.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </DropdownMenuItem>
                    </Link>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Public Sign In Button */}
              {!isAuthenticated && (
                <Button asChild className="bg-cactus-green hover:bg-cactus-green/90">
                  <a href="/api/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </a>
                </Button>
              )}

              {/* Authenticated Actions */}
              {isAuthenticated && (
                <>
                  <Button
                    onClick={() => setShowAddPlant(true)}
                    className="bg-cactus-green hover:bg-cactus-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plant
                  </Button>

                  {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      Account
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{user?.firstName || user?.email?.split("@")[0] || "User"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navigationGroups.account.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center space-x-2 text-red-600 cursor-pointer"
                    onClick={async () => {
                      try {
                        // Make a POST request to logout endpoint
                        const response = await fetch('/api/logout', {
                          method: 'POST',
                          credentials: 'include'
                        });
                        
                        // Force logout regardless of server response
                        console.log('Logout response:', response.status);
                        
                        // Clear all possible browser storage
                        try {
                          // Clear localStorage
                          localStorage.clear();
                          
                          // Clear sessionStorage  
                          sessionStorage.clear();
                          
                          // Clear service worker caches
                          if (window.caches) {
                            const cacheNames = await window.caches.keys();
                            await Promise.all(cacheNames.map(name => window.caches.delete(name)));
                          }
                          
                          // Clear cookies via document.cookie
                          document.cookie.split(";").forEach(function(c) { 
                            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                          });
                          
                        } catch (e) {
                          console.error('Error clearing storage:', e);
                        }
                        
                        // Force complete reload with cache busting
                        window.location.href = "/?t=" + Date.now();
                      } catch (error) {
                        console.error('Logout error:', error);
                        // Fallback: force reload to landing page
                        window.location.href = "/";
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Public Mobile Sign In */}
              {!isAuthenticated && (
                <Button size="sm" asChild className="bg-cactus-green hover:bg-cactus-green/90">
                  <a href="/api/login">
                    <LogIn className="w-4 h-4" />
                  </a>
                </Button>
              )}

              {/* Authenticated Mobile Add Plant */}
              {isAuthenticated && (
                <Button
                  size="sm"
                  onClick={() => setShowAddPlant(true)}
                  className="bg-cactus-green hover:bg-cactus-green/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}

              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 overflow-y-auto max-h-screen">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-1">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <img 
                          src={logoImage} 
                          alt="Cactilog"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="cactilog-title">
                        <span className="cacti-green">Cacti</span><span className="log-green">log</span>
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-1">
                    {/* Authenticated Navigation */}
                    {isAuthenticated && (
                      <>
                        {/* Home */}
                        {navigationGroups.main.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <Button
                              variant={isActive(item.href) ? "default" : "ghost"}
                              className={`w-full justify-start ${
                                isActive(item.href) ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                              }`}
                              onClick={() => setShowMobileMenu(false)}
                            >
                              <item.icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </Button>
                          </Link>
                        ))}

                        {/* My Collection Section */}
                        <div className="pt-4">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            My Cacti
                          </div>
                          {navigationGroups.myCollection.map((item) => (
                            <Link key={item.href} href={item.href}>
                              <Button
                                variant={isActive(item.href) ? "default" : "ghost"}
                                className={`w-full justify-start ${
                                  isActive(item.href) ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                                }`}
                                onClick={() => setShowMobileMenu(false)}
                              >
                                <item.icon className="w-4 h-4 mr-2" />
                                {item.label}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Community Section - Available to Everyone */}
                    <div className="pt-4">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Community
                      </div>
                      
                      {/* Community Collections */}
                      <Link href="/users">
                        <Button
                          variant={isActive("/users") ? "default" : "ghost"}
                          className={`w-full justify-start mb-1 ${
                            isActive("/users") ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Collections Directory
                        </Button>
                      </Link>
                      
                      {/* Photo Gallery */}
                      <Link href="/community/photos">
                        <Button
                          variant={isActive("/community/photos") ? "default" : "ghost"}
                          className={`w-full justify-start mb-1 ${
                            isActive("/community/photos") ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Photo Gallery
                        </Button>
                      </Link>
                      
                      {/* Articles */}
                      <Link href="/articles">
                        <Button
                          variant={isActive("/articles") ? "default" : "ghost"}
                          className={`w-full justify-start mb-1 ${
                            isActive("/articles") ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Articles
                        </Button>
                      </Link>
                      
                      {/* Recommended Socials */}
                      <Link href="/recommended-socials">
                        <Button
                          variant={isActive("/recommended-socials") ? "default" : "ghost"}
                          className={`w-full justify-start mb-1 ${
                            isActive("/recommended-socials") ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Recommended Socials
                        </Button>
                      </Link>
                    </div>

                    {/* Knowledge Base Section */}
                    <div className="pt-4">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Knowledge Base
                      </div>
                      {navigationGroups.knowledge.slice(0, -1).map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActive(item.href) ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive(item.href) ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                            }`}
                            onClick={() => setShowMobileMenu(false)}
                          >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>

                    {/* Vendors Section */}
                    <div className="pt-4">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Other
                      </div>
                      <Link href="/vendors">
                        <Button
                          variant={isActive("/vendors") ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            isActive("/vendors") ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Store className="w-4 h-4 mr-2" />
                          Trusted Vendors
                        </Button>
                      </Link>
                    </div>

                    {/* Account Section - Only for authenticated users */}
                    {isAuthenticated && (
                      <div className="pt-4">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Account
                        </div>
                        {navigationGroups.account.filter((item) => 
                          !item.adminOnly || (adminStatus && typeof adminStatus === 'object' && 'isAdmin' in adminStatus && adminStatus.isAdmin)
                        ).map((item) => (
                          <Link key={item.href} href={item.href}>
                            <Button
                              variant={isActive(item.href) ? "default" : "ghost"}
                              className={`w-full justify-start ${
                                isActive(item.href) ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                              }`}
                              onClick={() => setShowMobileMenu(false)}
                            >
                              <item.icon className="w-4 h-4 mr-2" />
                              {item.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer section - different for authenticated vs unauthenticated */}
                  <div className="mt-6 pt-6 border-t space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center space-x-2 px-3 py-2">
                          {user?.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt="Profile"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span className="text-sm">
                            {user?.firstName || user?.email?.split("@")[0] || "User"}
                          </span>
                        </div>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600"
                          onClick={async () => {
                            try {
                              // Make a POST request to logout endpoint
                              const response = await fetch('/api/logout', {
                                method: 'POST',
                                credentials: 'include'
                              });
                              
                              // Force logout regardless of server response
                              console.log('Mobile logout response:', response.status);
                              
                              // Clear all possible browser storage
                              try {
                                // Clear localStorage
                                localStorage.clear();
                                
                                // Clear sessionStorage  
                                sessionStorage.clear();
                                
                                // Clear service worker caches
                                if (window.caches) {
                                  const cacheNames = await window.caches.keys();
                                  await Promise.all(cacheNames.map(name => window.caches.delete(name)));
                                }
                                
                                // Clear cookies via document.cookie
                                document.cookie.split(";").forEach(function(c) { 
                                  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                                });
                                
                              } catch (e) {
                                console.error('Error clearing storage:', e);
                              }
                              
                              // Force complete reload with cache busting
                              window.location.href = "/?t=" + Date.now();
                            } catch (error) {
                              console.error('Logout error:', error);
                              // Fallback: force reload to landing page
                              window.location.href = "/";
                            }
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      // Unauthenticated user footer
                      <Button asChild className="w-full bg-cactus-green hover:bg-cactus-green/90">
                        <a href="/api/login">
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </a>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Add Plant Modal */}
      <AddPlantModal
        open={showAddPlant}
        onOpenChange={setShowAddPlant}
      />
    </>
  );
}

export default Header;