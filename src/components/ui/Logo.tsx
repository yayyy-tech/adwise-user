import { cn } from '../../lib/utils';

interface LogoProps {
  dark?: boolean;
  className?: string;
}

export function Logo({ dark, className }: LogoProps) {
  return (
    <span className={cn('font-body text-xl font-semibold', className)}>
      <span className={dark ? 'text-white' : 'text-light-text'}>Ad</span>
      <span className="text-teal">wise</span>
    </span>
  );
}
