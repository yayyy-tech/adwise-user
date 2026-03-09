import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'teal' | 'outline' | 'ghost' | 'dark-outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-body font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-dark-base text-white hover:bg-dark-surface-2 disabled:bg-dark-surface disabled:text-dark-muted',
      teal: 'bg-teal text-dark-base hover:bg-teal-dim disabled:bg-dark-surface disabled:text-dark-muted',
      outline: 'bg-white border border-light-border text-light-text hover:bg-light-base disabled:opacity-50',
      ghost: 'bg-transparent text-light-muted hover:text-light-text disabled:opacity-50',
      'dark-outline': 'bg-transparent border border-dark-border text-dark-text hover:bg-dark-surface disabled:opacity-50',
    };

    const sizes = {
      sm: 'h-9 px-4 text-[13px] rounded-[8px]',
      md: 'h-12 px-6 text-[15px] rounded-[12px]',
      lg: 'h-[52px] px-8 text-[16px] rounded-[12px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
