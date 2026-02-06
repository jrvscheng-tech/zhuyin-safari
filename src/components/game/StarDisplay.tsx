import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarDisplayProps {
  earned: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

export function StarDisplay({ 
  earned, 
  total, 
  size = 'md', 
  animated = false,
  className 
}: StarDisplayProps) {
  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            'transition-all duration-500',
            i < earned
              ? 'fill-star-gold text-star-gold drop-shadow-lg'
              : 'fill-transparent text-star-empty',
            animated && i < earned && 'animate-pop-in',
            animated && i < earned && { animationDelay: `${i * 150}ms` }
          )}
          style={animated && i < earned ? { animationDelay: `${i * 150}ms` } : undefined}
        />
      ))}
    </div>
  );
}
