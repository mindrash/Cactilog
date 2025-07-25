import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Plus, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CactusIcon from "@/components/cactus-icon";
import AddPlantModal from "@/components/add-plant-modal";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/collection", label: "Collection" },
  { href: "/growth-tracking", label: "Growth" },
  { href: "/photos", label: "Photos" },
  { href: "/users", label: "Community Collections" },
  { href: "/settings", label: "Settings" },
];

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cactus-green rounded-full flex items-center justify-center">
                <CactusIcon className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CactiTracker</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={isActive(item.href) ? "bg-cactus-green hover:bg-cactus-green/90" : ""}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
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
                      {user?.firstName || user?.email?.split("@")[0] || "User"}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center space-x-2 text-red-600"
                    onClick={() => window.location.href = "/api/logout"}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
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
                      <span>CactiTracker</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-1">
                    {navigationItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive(item.href) ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            isActive(item.href) ? "bg-cactus-green hover:bg-cactus-green/90" : ""
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ))}
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