import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'premium' | 'lite' | 'sale' | 'new' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      premium: 'bg-black text-white',
      lite: 'border border-black text-black',
      sale: 'bg-red-600 text-white',
      new: 'bg-black text-white',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-[9px]',
      md: 'px-3 py-1 text-[10px]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-bold uppercase tracking-widest',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
