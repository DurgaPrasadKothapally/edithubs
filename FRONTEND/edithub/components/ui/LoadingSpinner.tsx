import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  fullPage?: boolean;
  text?: string;
}

export function LoadingSpinner({ size = 24, className, fullPage, text }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background-DEFAULT">
        <Loader2
          size={48}
          className="animate-spin text-accent"
        />
        {text && <p className="text-text-secondary text-sm">{text}</p>}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 size={size} className="animate-spin text-accent" />
      {text && <span className="text-text-secondary text-sm">{text}</span>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-surface-border bg-background-card overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-2/3 rounded-lg" />
        <div className="flex gap-2 mt-4">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
