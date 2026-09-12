import { cn, getCategoryColor } from '@/lib/utils';

interface BadgeProps {
  label: string;
  className?: string;
  useCategory?: boolean;
}

export function Badge({ label, className, useCategory = false }: BadgeProps) {
  const colorClass = useCategory ? getCategoryColor(label) : '';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        useCategory ? colorClass : 'bg-surface text-text-secondary border border-surface-border',
        className
      )}
    >
      {label}
    </span>
  );
}
