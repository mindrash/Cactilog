import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor?: string;
}

export default function StatsCard({ title, value, icon, bgColor = "bg-gray-100" }: StatsCardProps) {
  return (
    <Card className="border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", bgColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
