import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'dark' | 'teal-outline';
  className?: string;
}

export function Badge({ children, variant = 'dark', className }: BadgeProps) {
  const variants = {
    teal: 'bg-teal text-dark-base',
    dark: 'bg-dark-surface text-dark-muted border border-dark-border',
    'teal-outline': 'bg-transparent text-teal border border-teal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
