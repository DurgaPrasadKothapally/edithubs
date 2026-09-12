import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export function Card({ children, className, hover = false, glass = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-surface-border',
        glass
          ? 'glass'
          : 'bg-background-card',
        hover && 'tutorial-card cursor-pointer',
        'shadow-card',
        className
      )}
    >
      {children}
    </div>
  );
}
