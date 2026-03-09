import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { SplitLayout } from '../components/layout/SplitLayout';
import { LeftPanel } from '../components/layout/LeftPanel';
import { RightPanel } from '../components/layout/RightPanel';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { useMatchStore } from '../store/useMatchStore';

export default function MatchRevealPage() {
  const navigate = useNavigate();
  const { result } = useMatchStore();
  const [displayScore, setDisplayScore] = useState(0);

  const motionScore = useMotionValue(0);
  const roundedScore = useTransform(motionScore, (v) => Math.round(v));

  useEffect(() => {
    if (!result) {
      navigate('/');
      return;
    }
    const controls = animate(motionScore, result.matchScore, {
      duration: 1.5,
      ease: 'easeOut',
    });
    const unsub = roundedScore.on('change', (v) => setDisplayScore(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [result, motionScore, roundedScore, navigate]);

  if (!result) return null;

  const { advisor, matchScore, matchReasons } = result;
  const circumference = 2 * Math.PI * 80;

  const left = (
    <LeftPanel>
      <Logo />
      <div className="flex flex-1 flex-col justify-center max-w-[400px] mt-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-dark-base px-4 py-1.5 font-body text-[11px] font-medium text-teal">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5z"/></svg>
            YOUR MATCH IS READY
          </span>
        </motion.div>

        <div className="mt-6 space-y-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-[52px] text-light-text leading-[1.1]"
          >
            We found
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-display text-[52px] text-light-muted leading-[1.1]"
          >
            your
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-[52px] text-teal leading-[1.1]"
          >
            perfect advisor.
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 font-body text-[15px] text-light-muted leading-relaxed"
        >
          Based on your situation and goals, here&apos;s who we think is the right person for you right now.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 rounded-[20px] border border-light-border bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full font-body text-lg font-semibold text-white"
              style={{ backgroundColor: advisor.avatarColor }}
            >
              {advisor.avatarInitials}
            </div>
            <div className="flex-1">
              <p className="font-body text-lg font-semibold text-light-text">{advisor.name}</p>
              <p className="font-mono text-xs text-light-muted">
                {advisor.credentials} &middot; {advisor.sebiNumber}
              </p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 font-body text-xs font-medium text-green-700">
              &#10003; Verified
            </span>
          </div>
          <p className="mt-4 font-body text-sm leading-relaxed text-light-muted">
            {advisor.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {advisor.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-teal/30 px-2.5 py-1 font-body text-xs text-teal"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 space-y-3"
        >
          <Button variant="teal" size="lg" fullWidth onClick={() => navigate('/dashboard')}>
            Book a Session &rarr;
          </Button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-center font-body text-[15px] text-light-text hover:underline"
          >
            View My Dashboard
          </button>
        </motion.div>
      </div>
    </LeftPanel>
  );

  const right = (
    <RightPanel>
      <div className="flex flex-col items-center gap-8 max-w-[360px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#1f2b24"
              strokeWidth="8"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#00c896"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - matchScore / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              style={{ transformOrigin: '100px 100px', transform: 'rotate(-90deg)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[52px] font-medium text-white leading-none">
              {displayScore}
              <span className="text-xl">%</span>
            </span>
            <span className="mt-1 font-body text-[11px] uppercase tracking-[0.1em] text-dark-muted">
              MATCH
            </span>
          </div>
        </motion.div>

        <div className="w-full">
          <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.1em] text-dark-muted">
            WHY THIS MATCH WORKS
          </p>
          <div className="space-y-2">
            {matchReasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.15 }}
                className="rounded-[12px] bg-dark-surface px-4 py-3 font-body text-[13px] text-dark-text"
              >
                <span className="mr-2 text-teal">&#10022;</span>
                {reason}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RightPanel>
  );

  return <SplitLayout left={left} right={right} />;
}
