import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PrivacyBadgeProps {
  isPublic: string;
  className?: string;
}

export default function PrivacyBadge({ isPublic, className = "" }: PrivacyBadgeProps) {
  if (isPublic === "public") {
    return (
      <Badge 
        variant="outline" 
        className={`bg-forest/10 border-forest text-forest hover:bg-forest/20 ${className}`}
      >
        <Eye className="w-3 h-3 mr-1" />
        Public
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className={`bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200 ${className}`}
    >
      <EyeOff className="w-3 h-3 mr-1" />
      Private
    </Badge>
  );
}