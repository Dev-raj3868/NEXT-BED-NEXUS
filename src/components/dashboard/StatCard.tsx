import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning" | "info";
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    border: "border-border",
  },
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    border: "border-primary/20",
  },
  success: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
    border: "border-success/20",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    border: "border-warning/20",
  },
  info: {
    iconBg: "bg-info/10",
    iconColor: "text-info",
    border: "border-info/20",
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
  trend,
  className,
}: StatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 border shadow-card transition-all duration-300 hover:shadow-lg animate-slide-up",
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", styles.iconBg)}>
          <Icon className={cn("w-6 h-6", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
