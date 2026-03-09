import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface QuestionStepProps {
  children: ReactNode;
  direction: number;
}

export function QuestionStep({ children, direction }: QuestionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -40 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
