import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'quantum' | 'matrix' | 'pulse';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  variant = 'quantum'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  if (variant === 'matrix') {
    return (
      <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
        <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-2 border-secondary/40 rounded-full animate-spin animate-reverse"></div>
        <div className="w-2 h-2 bg-accent rounded-full animate-quantum-pulse"></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-quantum-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-2 border-secondary/40 border-t-transparent rounded-full animate-spin animate-reverse"></div>
    </div>
  );
};