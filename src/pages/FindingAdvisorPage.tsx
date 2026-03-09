import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, FileText, Target, ShieldCheck, Sparkles } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { useUserStore } from '../store/useUserStore';
import { useMatchStore } from '../store/useMatchStore';
import { supabase } from '../lib/supabase';

const CHECKLIST = [
  { icon: FileText, label: 'Analysing your financial situation' },
  { icon: Target, label: 'Matching your goals to advisor specialisations' },
  { icon: ShieldCheck, label: 'Verifying SEBI credentials and compliance status' },
  { icon: Sparkles, label: 'Preparing your personalised match' },
];

export default function FindingAdvisorPage() {
  const navigate = useNavigate();
  const { answers, user, refreshProfile } = useUserStore();
  const { setResult, setComputing } = useMatchStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !user) return;
    hasRun.current = true;

    const saveAndMatch = async () => {
      setComputing(true);
      try {
        // Save questionnaire answers to DB
        await Promise.all([
          supabase.from('user_profiles').update({
            situation: answers.situation,
            money_situation: [answers.moneyLocation],
            top_goal: answers.topGoal,
            employment_type: answers.employmentType,
            income_bracket: answers.incomeRange,
            monthly_surplus: answers.monthlySurplus,
            current_investments: answers.currentInvestments,
            working_style: answers.workingStyle,
            questionnaire_completed: true,
            questionnaire_completed_at: new Date().toISOString(),
          }).eq('id', user.id),
          supabase.from('profiles').update({
            full_name: `${answers.firstName || ''} ${answers.lastName || ''}`.trim(),
            phone: answers.phone,
            city: answers.city,
          }).eq('id', user.id),
        ]);

        // Compute match scores for all active advisors
        const { data: advisors } = await supabase
          .from('advisor_profiles')
          .select('id')
          .eq('status', 'active')
          .eq('onboarding_completed', true);

        if (advisors?.length) {
          const scores = await Promise.all(
            advisors.map(async (a) => {
              const { data: score } = await supabase.rpc('compute_match_score', {
                p_user_id: user.id,
                p_advisor_id: a.id,
              });
              return { user_id: user.id, advisor_id: a.id, score: score ?? 50 };
            })
          );
          await supabase.from('match_scores').upsert(scores, { onConflict: 'user_id,advisor_id' });

          // Get top match for the reveal page
          const topMatch = scores.sort((a, b) => b.score - a.score)[0];
          if (topMatch) {
            const { data: advisor } = await supabase
              .from('advisor_profiles')
              .select('*, profiles!id(full_name, city, avatar_url)')
              .eq('id', topMatch.advisor_id)
              .single();

            if (advisor) {
              setResult({
                advisor: {
                  id: advisor.id,
                  name: advisor.profiles?.full_name || '',
                  credentials: advisor.qualifications?.[0] || 'CFP',
                  sebiNumber: advisor.sebi_registration_number || '',
                  bio: advisor.bio || '',
                  specialisations: advisor.specialisations || [],
                  yearsExperience: advisor.years_experience,
                  city: advisor.profiles?.city || '',
                  rating: advisor.rating,
                  reviewCount: advisor.review_count,
                  responseTimeHours: advisor.response_time_hours,
                  languages: advisor.languages || [],
                  avatarBg: 'bg-teal',
                  avatarInitials: (advisor.profiles?.full_name || 'A').split(' ').map((n: string) => n[0]).join('').slice(0, 2),
                },
                matchScore: topMatch.score,
                matchReasons: [
                  `Specialises in ${advisor.primary_specialisation || advisor.specialisations?.[0] || 'your goals'}`,
                  `${advisor.years_experience}+ years experience`,
                  `${advisor.rating} rating from ${advisor.review_count} clients`,
                ],
              });
            }
          }
        }

        await refreshProfile();
      } catch (e) {
        console.error('Match computation error:', e);
      } finally {
        setComputing(false);
      }

      setTimeout(() => navigate('/your-match'), 3500);
    };

    saveAndMatch();
  }, [answers, user, setResult, setComputing, navigate, refreshProfile]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-base noise-bg px-4">
      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center">
        <div className="mb-8">
          <Logo dark />
        </div>

        <motion.div
          className="mb-8 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-dark-surface"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Search className="h-8 w-8 text-teal" />
          </motion.div>
        </motion.div>

        <h1 className="mb-3 text-center font-body text-[32px] font-semibold text-white">
          Finding your advisor...
        </h1>
        <p className="mb-10 max-w-[400px] text-center font-body text-[15px] leading-relaxed text-dark-muted">
          Based on your situation, priorities, and preferences, we&apos;re matching you to the right certified professional from our verified network.
        </p>

        <div className="w-full space-y-3">
          {CHECKLIST.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.6 }}
                className="flex items-center gap-4 rounded-[12px] bg-dark-surface px-5 py-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-surface-2">
                  <Icon className="h-4 w-4 text-dark-muted" />
                </div>
                <span className="flex-1 font-body text-sm text-dark-text">{item.label}</span>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [0, 1.3, 1] }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.6 + 0.4,
                    type: 'spring',
                    bounce: 0.5,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#00c896" />
                    <path d="M6 10l3 3 5-5" stroke="#0b0f0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
