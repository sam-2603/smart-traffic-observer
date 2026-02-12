import { cn } from "@/lib/utils";
import { violationTypeLabels } from "@/lib/mockData";

interface ViolationTypeBadgeProps {
  type: string;
  className?: string;
}

const typeStyles: Record<string, string> = {
  red_light: "bg-destructive/10 text-destructive border-destructive/20",
  overspeeding: "bg-warning/10 text-warning border-warning/20",
  no_helmet: "bg-primary/10 text-primary border-primary/20",
  wrong_way: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  stop_line: "bg-success/10 text-success border-success/20",
};

const ViolationTypeBadge = ({ type, className }: ViolationTypeBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        typeStyles[type] || "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      {violationTypeLabels[type] || type}
    </span>
  );
};

export default ViolationTypeBadge;
