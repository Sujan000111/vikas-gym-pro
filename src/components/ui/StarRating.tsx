import { Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
  value: number;
  onChange?: (rating: 1 | 2 | 3 | 4 | 5) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readOnly = false, size = 20 }: Props) {
  const [hover, setHover] = useState<number>(0);
  const display = hover || value;

  const handleClick = (n: number): void => {
    if (readOnly || !onChange) return;
    onChange(n as 1 | 2 | 3 | 4 | 5);
  };

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => handleClick(n)}
            className={readOnly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
          >
            <Star
              width={size}
              height={size}
              fill={active ? 'hsl(var(--red))' : 'transparent'}
              stroke={active ? 'hsl(var(--red))' : 'hsl(var(--border-color))'}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
}
