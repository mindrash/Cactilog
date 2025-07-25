import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Plus, Menu, User, LogOut, ChevronDown, Home, BarChart3, FolderOpen, TrendingUp, Camera, Users, Settings, Sprout, BookOpen, Search, Shield, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
  ],
  knowledge: [
    { href: "/knowledge", label: "Browse Genera", icon: BookOpen },
    { href: "/knowledge/search", label: "Species Search", icon: Search },
    { href: "/knowledge/care-guides", icon: Leaf, label: "Care Guides" },
  ],
  account: [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/admin", label: "Admin Dashboard", icon: Shield, adminOnly: true },
  ],
};

export default function Header() {
  const { user } = useAuth();
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
    return items.some(item => isActive(item.href));
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mr-4 lg:mr-8">
              <div className="w-8 h-8 bg-cactus-green rounded-full flex items-center justify-center">
                <CactusIcon className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Cactilog</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
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
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
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
                    onClick={() => window.location.href = "/api/logout"}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => setShowAddPlant(true)}
                className="bg-cactus-green hover:bg-cactus-green/90"
              >
                <Plus className="w-4 h-4" />
              </Button>

              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-cactus-green rounded-full flex items-center justify-center">
                        <CactusIcon className="text-white" size={16} />
                      </div>
                      <span>Cactilog</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-1">
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

                    {/* Community Section */}
                    <div className="pt-4">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Community
                      </div>
                      {navigationGroups.community.map((item) => (
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

                    {/* Knowledge Base Section */}
                    <div className="pt-4">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Knowledge Base
                      </div>
                      {navigationGroups.knowledge.map((item) => (
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

                    {/* Account Section */}
                    <div className="pt-4">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Account
                      </div>
                      {navigationGroups.account.map((item) => (
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
                  </div>

                  <div className="mt-6 pt-6 border-t space-y-2">
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
                      onClick={() => window.location.href = "/api/logout"}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
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