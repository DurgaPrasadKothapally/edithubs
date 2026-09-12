import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-20 px-6 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4 border border-surface-border">
        <Icon size={32} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary text-sm max-w-sm mb-6">{description}</p>
      )}
      {action && action}
    </div>
  );
}
