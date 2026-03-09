import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'dark' | 'light';
}

export function Card({ children, className, variant = 'dark' }: CardProps) {
  const styles = variant === 'dark'
    ? 'bg-dark-surface rounded-[20px] p-8'
    : 'bg-white rounded-[20px] border border-light-border p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

  return <div className={cn(styles, className)}>{children}</div>;
}
