import { FaGoogle, FaGithub, FaMicrosoft, FaApple } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

interface ProviderBadgeProps {
  provider: string | null | undefined;
  size?: "sm" | "md" | "lg";
}

const providerIcons: Record<string, React.ReactNode> = {
  google: <FaGoogle className="w-3 h-3" />,
  github: <FaGithub className="w-3 h-3" />,
  microsoft: <FaMicrosoft className="w-3 h-3" />,
  apple: <FaApple className="w-3 h-3" />,
};

const providerColors: Record<string, string> = {
  google: "bg-red-50 text-red-700 border-red-200",
  github: "bg-gray-50 text-gray-700 border-gray-200",
  microsoft: "bg-blue-50 text-blue-700 border-blue-200",
  apple: "bg-gray-50 text-gray-900 border-gray-200",
};

export default function ProviderBadge({ provider, size = "sm" }: ProviderBadgeProps) {
  if (!provider) return null;

  const icon = providerIcons[provider.toLowerCase()];
  const colorClass = providerColors[provider.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <Badge 
      variant="outline" 
      className={`${colorClass} flex items-center space-x-1 text-xs`}
    >
      {icon}
      <span className="capitalize">{provider}</span>
    </Badge>
  );
}