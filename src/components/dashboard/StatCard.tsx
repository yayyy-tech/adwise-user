import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  subColor?: string;
}

export function StatCard({ label, value, sub, subColor = 'text-dark-muted' }: StatCardProps) {
  return (
    <div className="rounded-[16px] bg-dark-surface p-6">
      <p className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-dark-muted">
        {label}
      </p>
      <p className="mt-2 font-mono text-4xl text-white">{value}</p>
      <p className={cn('mt-1 font-body text-xs', subColor)}>{sub}</p>
    </div>
  );
}
