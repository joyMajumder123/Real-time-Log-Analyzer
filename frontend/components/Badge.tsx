import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "secondary";
}

const variantStyles = {
  default: "border border-primary/30 bg-primary/10 text-primary",
  success: "border border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  warning: "border border-amber-500/25 bg-amber-500/10 text-amber-300",
  error: "border border-red-500/25 bg-red-500/10 text-red-300",
  info: "border border-sky-500/25 bg-sky-500/10 text-sky-300",
  secondary: "border border-border bg-secondary text-secondary-foreground",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "pending";
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const IconMap = {
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
    pending: Info,
  };

  const variantMap = {
    success: "success" as const,
    warning: "warning" as const,
    error: "error" as const,
    pending: "info" as const,
  };

  const Icon = IconMap[status];

  return (
    <Badge
      variant={variantMap[status]}
      className="inline-flex gap-2 items-center"
    >
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}

interface LevelBadgeProps {
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const levelVariants = {
    DEBUG: "default" as const,
    INFO: "info" as const,
    WARN: "warning" as const,
    ERROR: "error" as const,
    FATAL: "error" as const,
  };

  return <Badge variant={levelVariants[level]}>{level}</Badge>;
}
