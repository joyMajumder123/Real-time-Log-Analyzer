import { Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";

export function LoadingSpinner() {
  return (
    <Card className="mx-auto mt-10 max-w-xl border-border/60 bg-card/70">
      <CardContent className="flex h-52 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading telemetry stream...</p>
      </CardContent>
    </Card>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-lg bg-muted animate-pulse h-24" />
      ))}
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title,
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="mx-auto mt-10 max-w-xl border-red-500/30 bg-red-500/5">
      <CardContent className="flex h-52 flex-col items-center justify-center gap-3 text-center">
        <div className="text-2xl">⚠️</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
        {onRetry && (
          <Button onClick={onRetry} variant="secondary" size="sm">
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="mx-auto mt-10 max-w-xl border-border/60 bg-card/65">
      <CardContent className="flex h-52 flex-col items-center justify-center gap-3 text-center">
        <div className="text-2xl">📭</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
        {action && (
          <Button onClick={action.onClick} variant="secondary" size="sm">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
