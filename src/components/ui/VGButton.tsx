import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface VGButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[hsl(var(--red))] text-white hover:bg-[hsl(var(--red-hover))] border border-transparent',
  outline: 'bg-transparent text-[hsl(var(--text-primary))] border border-[hsl(var(--border-color))] hover:border-[hsl(var(--red))] hover:text-[hsl(var(--red))]',
  ghost: 'bg-transparent text-[hsl(var(--text-body))] hover:bg-[hsl(var(--bg-elevated))] border border-transparent',
  danger: 'bg-transparent text-[hsl(var(--red))] border border-[hsl(var(--red))] hover:bg-[hsl(var(--red))] hover:text-white',
};
const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-8 text-base',
};

export function VGButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: VGButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm font-semibold uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
