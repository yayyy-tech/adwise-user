import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { SplitLayout } from '../components/layout/SplitLayout';
import { LeftPanel } from '../components/layout/LeftPanel';
import { RightPanel } from '../components/layout/RightPanel';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { SelectionCard } from '../components/ui/SelectionCard';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StepIndicator } from '../components/questionnaire/StepIndicator';
import { QuestionStep } from '../components/questionnaire/QuestionStep';
import { Badge } from '../components/ui/Badge';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../lib/utils';
import {
  RIGHT_PANEL_CONTENT,
  STEP1_OPTIONS,
  STEP2_OPTIONS,
  STEP3_OPTIONS,
  EMPLOYMENT_OPTIONS,
  INCOME_OPTIONS,
  INCOME_LABELS,
  SURPLUS_OPTIONS,
  SURPLUS_LABELS,
  INVESTMENTS_OPTIONS,
  INVESTMENTS_LABELS,
  STEP5_OPTIONS,
  CITIES,
} from '../data/questionnaireContent';

const TOTAL_STEPS = 6;

function PillSelector({
  options,
  labels,
  value,
  onChange,
}: {
  options: string[];
  labels: Record<string, string>;
  value?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'h-10 rounded-full border px-4 font-body text-sm font-medium transition-colors',
            value === opt
              ? 'border-dark-base bg-dark-base text-white'
              : 'border-light-border bg-white text-light-text hover:bg-light-base'
          )}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { answers, currentStep, setAnswer, setStep } = useUserStore();
  const [direction, setDirection] = useState(1);
  const [consent, setConsent] = useState(false);

  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setStep(currentStep + 1);
    } else {
      navigate('/finding-advisor');
    }
  }, [currentStep, setStep, navigate]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setStep(currentStep - 1);
    } else {
      navigate('/');
    }
  }, [currentStep, setStep, navigate]);

  const canContinue = (() => {
    switch (currentStep) {
      case 1: return !!answers.situation;
      case 2: return !!answers.moneyLocation;
      case 3: return !!answers.topGoal;
      case 4: return !!answers.employmentType && !!answers.incomeRange && !!answers.monthlySurplus && !!answers.currentInvestments;
      case 5: return !!answers.workingStyle;
      case 6: return !!answers.firstName && !!answers.lastName && !!answers.phone && answers.phone.length === 10 && !!answers.city && consent;
      default: return false;
    }
  })();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <h2 className="font-display text-[32px] text-light-text">What brings you to Adwise today?</h2>
            <p className="font-body text-sm text-light-muted">Pick the one that feels most like your situation right now.</p>
            <div className="mt-6 space-y-3">
              {STEP1_OPTIONS.map((opt) => (
                <SelectionCard
                  key={opt.id}
                  emoji={opt.emoji}
                  title={opt.title}
                  description={opt.description}
                  selected={answers.situation === opt.id}
                  onClick={() => setAnswer('situation', opt.id)}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <h2 className="font-display text-[32px] text-light-text">Where is most of your money sitting right now?</h2>
            <p className="font-body text-sm text-light-muted">Be honest &mdash; there&apos;s no wrong answer here.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {STEP2_OPTIONS.map((opt) => (
                <SelectionCard
                  key={opt.id}
                  emoji={opt.emoji}
                  title={opt.title}
                  selected={answers.moneyLocation === opt.id}
                  onClick={() => setAnswer('moneyLocation', opt.id)}
                  layout="grid"
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <h2 className="font-display text-[32px] text-light-text">What&apos;s the one thing you most want to sort out?</h2>
            <p className="font-body text-sm text-light-muted">Pick your biggest priority right now.</p>
            <div className="mt-6 space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {STEP3_OPTIONS.map((opt) => (
                <SelectionCard
                  key={opt.id}
                  emoji={opt.emoji}
                  title={opt.title}
                  description={opt.description}
                  selected={answers.topGoal === opt.id}
                  onClick={() => setAnswer('topGoal', opt.id)}
                />
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-[32px] text-light-text">Tell us about your financial situation.</h2>
              <p className="font-body text-sm text-light-muted mt-1">This helps us match you to the right advisor for your income and life stage.</p>
            </div>
            <div>
              <p className="mb-3 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-light-muted">How do you earn?</p>
              <div className="grid grid-cols-2 gap-3">
                {EMPLOYMENT_OPTIONS.map((opt) => (
                  <SelectionCard
                    key={opt.id}
                    emoji={opt.emoji}
                    title={opt.title}
                    selected={answers.employmentType === opt.id}
                    onClick={() => setAnswer('employmentType', opt.id)}
                    layout="grid"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-light-muted">Monthly take-home income</p>
              <PillSelector options={INCOME_OPTIONS} labels={INCOME_LABELS} value={answers.incomeRange} onChange={(v) => setAnswer('incomeRange', v)} />
            </div>
            <div>
              <p className="mb-3 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-light-muted">How much can you invest monthly?</p>
              <PillSelector options={SURPLUS_OPTIONS} labels={SURPLUS_LABELS} value={answers.monthlySurplus} onChange={(v) => setAnswer('monthlySurplus', v)} />
            </div>
            <div>
              <p className="mb-3 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-light-muted">Total investments you have today</p>
              <PillSelector options={INVESTMENTS_OPTIONS} labels={INVESTMENTS_LABELS} value={answers.currentInvestments} onChange={(v) => setAnswer('currentInvestments', v)} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-3">
            <h2 className="font-display text-[32px] text-light-text">How do you prefer to work with an advisor?</h2>
            <p className="font-body text-sm text-light-muted">This helps us match you to someone whose style fits yours.</p>
            <div className="mt-6 space-y-3">
              {STEP5_OPTIONS.map((opt) => (
                <SelectionCard
                  key={opt.id}
                  emoji={opt.emoji}
                  title={opt.title}
                  description={opt.description}
                  selected={answers.workingStyle === opt.id}
                  onClick={() => setAnswer('workingStyle', opt.id)}
                />
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-[32px] text-light-text">One last thing.</h2>
              <p className="font-body text-sm text-light-muted mt-1">This is how your advisor will reach out to confirm your free discovery call.</p>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="First name"
                value={answers.firstName || ''}
                onChange={(e) => setAnswer('firstName', e.target.value)}
              />
              <Input
                placeholder="Last name"
                value={answers.lastName || ''}
                onChange={(e) => setAnswer('lastName', e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Phone number"
                prefix="+91"
                value={answers.phone || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setAnswer('phone', val);
                }}
              />
              <p className="mt-2 font-body text-xs text-light-muted">
                Only shared with your matched advisor &mdash; never sold or spammed.
              </p>
            </div>
            <div>
              <p className="mb-2 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-light-muted">City</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setAnswer('city', c)}
                    className={cn(
                      'h-10 rounded-full border px-4 font-body text-sm font-medium transition-colors',
                      answers.city === c
                        ? 'border-dark-base bg-dark-base text-white'
                        : 'border-light-border bg-white text-light-text hover:bg-light-base'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-light-border accent-teal"
              />
              <span className="font-body text-[13px] text-light-muted leading-relaxed">
                I agree to be contacted via phone/email regarding advisor matching and platform communications.
              </span>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const renderRightPanel = () => {
    const content = RIGHT_PANEL_CONTENT[currentStep as keyof typeof RIGHT_PANEL_CONTENT];
    if (!content) return null;

    if (currentStep === 2 && 'chartData' in content) {
      return (
        <div className="w-full max-w-[360px]">
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.1em] text-dark-muted mb-6">
            {content.label}
          </p>
          <div className="flex items-end gap-4 h-48 mb-4">
            {content.chartData.map((bar, i) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                  className="w-full rounded-t-[8px]"
                  style={{ backgroundColor: `rgba(0, 200, 150, ${1 - i * 0.18})` }}
                />
                <span className="font-body text-[11px] text-dark-muted">{bar.label}</span>
              </div>
            ))}
          </div>
          <p className="font-body text-[13px] text-white">
            {content.subtext}{' '}
            <span className="font-semibold text-teal">{content.accent}</span>
          </p>
        </div>
      );
    }

    if (currentStep === 3 && 'stats' in content) {
      return (
        <div className="w-full max-w-[360px] rounded-[20px] bg-dark-surface p-8 border border-dark-border">
          <p className="font-body text-[10px] font-medium uppercase tracking-[0.1em] text-dark-muted mb-6">
            {content.label}
          </p>
          <div className="space-y-6">
            {content.stats.map((s) => (
              <div key={s.value}>
                <p className="font-mono text-[40px] font-medium text-teal leading-none">{s.value}</p>
                <p className="mt-2 font-body text-[13px] text-dark-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (currentStep === 6 && 'headline' in content) {
      return (
        <div className="flex flex-col items-center text-center max-w-[360px]">
          <Sparkles className="h-10 w-10 text-teal mb-6" />
          <p className="font-display italic text-[28px] text-white leading-snug">
            {content.headline}
          </p>
          <p className="mt-4 font-body text-sm text-dark-muted">
            {content.subtext}
          </p>
        </div>
      );
    }

    // Default: quote layout (steps 1, 4, 5)
    return (
      <div className="w-full max-w-[360px]">
        <div className="rounded-[20px] bg-dark-surface p-8 border border-dark-border">
          {'label' in content && content.label && (
            <p className="font-body text-[10px] font-medium uppercase tracking-[0.1em] text-teal mb-4">
              {content.label}
            </p>
          )}
          {'quote' in content && (
            <p className="font-display italic text-[24px] text-white leading-snug">
              {content.quote}
            </p>
          )}
          {'subtext' in content && (
            <p className="mt-4 font-body text-[13px] text-dark-muted flex items-center gap-2">
              {'showLock' in content && content.showLock && <Lock className="h-4 w-4 text-teal flex-shrink-0" />}
              {content.subtext}
            </p>
          )}
        </div>

        {'badges' in content && content.badges && (
          <div className="mt-4 flex flex-wrap gap-2">
            {content.badges.map((b, i) => (
              <Badge key={b} variant={i === 0 ? 'teal-outline' : 'dark'}>
                {b}
              </Badge>
            ))}
          </div>
        )}

        {'advisorPreview' in content && content.advisorPreview && (
          <div className="mt-6 flex items-center gap-3 rounded-[16px] bg-dark-surface p-4 border border-dark-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal font-body text-sm font-semibold text-dark-base">
              {content.advisorPreview.initials}
            </div>
            <div>
              <p className="font-body text-sm font-medium text-white">{content.advisorPreview.name}</p>
              <p className="font-body text-xs text-dark-muted">{content.advisorPreview.detail}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const left = (
    <LeftPanel>
      <div className="flex items-center justify-between">
        <Logo />
      </div>
      <div className="mt-4">
        <ProgressBar current={currentStep} total={TOTAL_STEPS} />
      </div>
      <div className="mt-2">
        <StepIndicator current={currentStep} total={TOTAL_STEPS} />
      </div>

      <div className="flex-1 mt-6 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <QuestionStep key={currentStep} direction={direction}>
            {renderStep()}
          </QuestionStep>
        </AnimatePresence>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          variant={currentStep === TOTAL_STEPS ? 'teal' : 'primary'}
          size="lg"
          fullWidth
          disabled={!canContinue}
          onClick={goNext}
        >
          {currentStep === TOTAL_STEPS ? 'Find My Advisor \u2192' : 'Continue'}
        </Button>
        <button
          onClick={goBack}
          className="font-body text-[13px] text-light-muted hover:text-light-text transition-colors"
        >
          &larr; Back
        </button>
      </div>
    </LeftPanel>
  );

  const right = (
    <RightPanel>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center w-full"
        >
          {renderRightPanel()}
        </motion.div>
      </AnimatePresence>
    </RightPanel>
  );

  return <SplitLayout left={left} right={right} />;
}
