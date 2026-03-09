import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface RightPanelProps {
  children: ReactNode;
  className?: string;
}

export function RightPanel({ children, className }: RightPanelProps) {
  return (
    <div className={cn('relative z-10 flex h-full flex-col items-center justify-center p-8 md:p-12', className)}>
      {children}
    </div>
  );
}
