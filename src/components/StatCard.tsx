
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border",
      "transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs font-medium mt-2 flex items-center",
              trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              <span className="mr-1">
                {trend.isPositive ? "↑" : "↓"}
              </span>
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "p-2 rounded-lg",
          iconClassName || "bg-primary/10 text-primary"
        )}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
