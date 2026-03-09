interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <span className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-teal">
      QUESTION {current} OF {total}
    </span>
  );
}
