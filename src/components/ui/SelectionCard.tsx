import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SelectionCardProps {
  emoji: string;
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  layout?: 'full' | 'grid';
}

export function SelectionCard({
  emoji,
  title,
  description,
  selected,
  onClick,
  layout = 'full',
}: SelectionCardProps) {
  if (layout === 'grid') {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
        whileTap={{ scale: [1, 0.98, 1] }}
        transition={{ duration: 0.15 }}
        className={cn(
          'flex flex-col items-start gap-3 rounded-[12px] border bg-white p-5 text-left transition-colors min-h-[100px]',
          selected
            ? 'border-l-[3px] border-l-teal border-t-light-border border-r-light-border border-b-light-border bg-teal-bg'
            : 'border-light-border hover:bg-[#f9f8f5]'
        )}
      >
        <span className="text-2xl">{emoji}</span>
        <span className="font-body text-sm font-medium text-light-text">{title}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: [1, 0.98, 1] }}
      transition={{ duration: 0.15 }}
      className={cn(
        'flex w-full items-center gap-4 rounded-[12px] border bg-white px-5 py-4 text-left transition-colors',
        selected
          ? 'border-l-[3px] border-l-teal border-t-light-border border-r-light-border border-b-light-border bg-teal-bg'
          : 'border-light-border hover:bg-[#f9f8f5]'
      )}
    >
      <span className="text-[28px] flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-light-text">{title}</p>
        {description && (
          <p className="font-body text-[13px] text-light-muted mt-0.5">{description}</p>
        )}
      </div>
      <div
        className={cn(
          'h-5 w-5 flex-shrink-0 rounded-full border-2 transition-colors flex items-center justify-center',
          selected ? 'border-teal bg-teal' : 'border-light-border'
        )}
      >
        {selected && (
          <div className="h-2 w-2 rounded-full bg-white" />
        )}
      </div>
    </motion.button>
  );
}
