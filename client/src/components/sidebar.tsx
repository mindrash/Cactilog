import { useLocation, Link } from "wouter";
import { LayoutDashboard, Sprout, TrendingUp, Camera, Upload, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "My Collection", href: "/collection", icon: Sprout },
  { name: "Growth Tracking", href: "/growth", icon: TrendingUp },
  { name: "Photo Gallery", href: "/photos", icon: Camera },
  { name: "Import Data", href: "/import", icon: Upload },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden lg:block">
      <nav className="p-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 font-medium transition-colors",
                isActive
                  ? "text-cactus-green bg-desert-sage/10"
                  : "text-gray-600 hover:text-cactus-green hover:bg-desert-sage/10"
              )}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
