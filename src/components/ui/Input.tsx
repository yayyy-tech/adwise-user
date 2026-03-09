import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, prefix, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block font-body text-[11px] font-medium uppercase tracking-[0.08em] text-light-muted">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-[15px] text-light-muted">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'h-12 w-full rounded-[12px] border border-light-border bg-white px-4 font-body text-[15px] text-light-text placeholder:text-light-muted focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/20 transition-colors',
              prefix && 'pl-12',
              error && 'border-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 font-body text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
