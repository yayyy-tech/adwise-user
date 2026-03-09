import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readonly, size = 20 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer hover:text-teal'
          )}
        >
          <Star
            size={size}
            className={star <= value ? 'fill-teal text-teal' : 'fill-none text-dark-muted-2'}
          />
        </button>
      ))}
    </div>
  );
}
