import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', width, height, style, ...props }, ref) => {
    const variants = {
      text: 'h-4',
      circular: 'rounded-full',
      rectangular: '',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-100',
          variants[variant],
          className
        )}
        style={{
          width: width,
          height: height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Product card skeleton for loading states
export function ProductCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-4 space-y-3 flex flex-col items-center">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

// Grid of product card skeletons
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
