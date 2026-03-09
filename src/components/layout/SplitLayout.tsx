import type { ReactNode } from 'react';

interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitLayout({ left, right }: SplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="w-full bg-light-base md:w-[480px] md:min-w-[480px] md:max-w-[480px]">
        {left}
      </div>
      <div className="relative flex-1 bg-dark-base noise-bg min-h-[300px] md:min-h-screen">
        {right}
      </div>
    </div>
  );
}
