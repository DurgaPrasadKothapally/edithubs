'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent text-background-DEFAULT font-semibold hover:bg-accent-light active:scale-[0.98] shadow-glow-accent hover:shadow-glow-accent',
  secondary:
    'bg-surface text-text-primary border border-surface-border hover:bg-surface-hover hover:border-accent/30 active:scale-[0.98]',
  outline:
    'bg-transparent text-accent border border-accent/50 hover:bg-accent/10 hover:border-accent active:scale-[0.98]',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface active:scale-[0.98]',
  danger:
    'bg-error text-white hover:bg-red-600 active:scale-[0.98]',
  gradient:
    'bg-accent-gradient text-white font-semibold hover:opacity-90 active:scale-[0.98] shadow-glow-accent',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
  xl: 'px-8 py-4 text-lg rounded-2xl gap-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-DEFAULT',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'xl' ? 20 : 16} />
        ) : icon ? (
          icon
        ) : null}
        {children}
        {!loading && iconRight && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';
