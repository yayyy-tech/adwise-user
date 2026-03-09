import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface LeftPanelProps {
  children: ReactNode;
  className?: string;
}

export function LeftPanel({ children, className }: LeftPanelProps) {
  return (
    <div className={cn('flex min-h-screen flex-col p-8', className)}>
      {children}
    </div>
  );
}
