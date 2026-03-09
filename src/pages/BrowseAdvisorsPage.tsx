import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, SlidersHorizontal } from 'lucide-react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Button } from '../components/ui/Button';
import { useAdvisors } from '../hooks/useAdvisors';
import { cn } from '../lib/utils';

const SPEC_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'Investment Planning', label: 'Investment Planning' },
  { id: 'Tax Optimisation', label: 'Tax Planning' },
  { id: 'Retirement Planning', label: 'Retirement' },
  { id: 'Insurance Planning', label: 'Insurance' },
  { id: 'Goal-Based Planning', label: 'Goal Planning' },
  { id: 'NRI Financial Planning', label: 'NRI Planning' },
  { id: 'Debt Management', label: 'Debt Management' },
];

const SORT_OPTIONS = [
  { label: 'Best Match', value: 'match' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Experienced', value: 'experience' },
];

export default function BrowseAdvisorsPage() {
  const navigate = useNavigate();
  const [specFilter, setSpecFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [showFilters, setShowFilters] = useState(false);

  const { data: rawAdvisors, isLoading } = useAdvisors({
    specialisation: specFilter === 'all' ? undefined : specFilter,
    sortBy,
  });

  const advisors = useMemo(() => rawAdvisors ?? [], [rawAdvisors]);

  const getInitials = (a: any) => {
    const name = a.profiles?.full_name || 'A';
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <DashboardShell>
      <div className="max-w-[960px]">
        <div className="mb-6">
          <h1 className="font-display text-[32px] text-dark-text">Find Your Advisor</h1>
          <p className="mt-1 font-body text-sm text-dark-muted">
            Showing matches based on your profile.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SPEC_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSpecFilter(f.id)}
                className={cn(
                  'whitespace-nowrap rounded-full border px-3 py-1.5 font-body text-[13px] font-medium transition-colors',
                  specFilter === f.id
                    ? 'bg-teal border-teal text-dark-base'
                    : 'bg-dark-surface border-dark-border text-dark-muted hover:text-white'
                )}
              >
                {f.label}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-dark-border bg-dark-surface px-3 py-1.5 font-body text-[13px] text-dark-muted hover:text-white"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-body text-xs text-dark-muted">{advisors.length} advisors found</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-[8px] border border-dark-border bg-dark-surface px-3 py-1.5 font-body text-[13px] text-dark-muted"
            >
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
          </div>
        ) : advisors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dark-surface mb-4">
              <Star className="h-6 w-6 text-dark-muted" />
            </div>
            <p className="font-body text-sm text-dark-muted mb-3">No advisors match your filters</p>
            <Button variant="dark-outline" size="sm" onClick={() => setSpecFilter('all')}>Reset Filters</Button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {advisors.map((advisor: any, i: number) => {
              const matchScore = advisor.match_scores?.[0]?.score ?? 0;
              const plan = advisor.advisor_plans?.[0];
              return (
                <motion.div
                  key={advisor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="rounded-[20px] bg-dark-surface p-6 transition-colors hover:bg-dark-surface-2 cursor-pointer"
                  onClick={() => navigate(`/advisor/${advisor.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal/20 font-body text-base font-semibold text-teal">
                      {getInitials(advisor)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-body text-base font-medium text-white">{advisor.profiles?.full_name}</p>
                        {matchScore > 0 && <span className="font-mono text-sm font-semibold text-teal">{matchScore}%</span>}
                      </div>
                      <p className="font-mono text-xs text-dark-muted">{advisor.qualifications} &middot; &#10003; Verified</p>
                    </div>
                  </div>

                  {advisor.tagline && (
                    <p className="mt-3 font-display italic text-sm text-dark-muted leading-relaxed line-clamp-1">
                      &ldquo;{advisor.tagline}&rdquo;
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(advisor.specialisations || []).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="rounded-full border border-teal/30 px-2 py-0.5 font-body text-[11px] text-teal">
                        {tag}
                      </span>
                    ))}
                    {advisor.rating > 0 && (
                      <span className="flex items-center gap-1 font-body text-xs text-dark-muted ml-auto">
                        <Star className="h-3 w-3 fill-teal text-teal" /> {advisor.rating} ({advisor.review_count || 0})
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-3 font-body text-xs text-dark-muted">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {advisor.profiles?.city || '—'}</span>
                    <span>&middot;</span>
                    <span>{advisor.years_experience || 0} yrs</span>
                    {advisor.response_time_hours && (
                      <>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{advisor.response_time_hours}h reply</span>
                      </>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {plan && (
                      <span className="font-mono text-sm text-dark-text">{'\u20b9'}{new Intl.NumberFormat('en-IN').format(plan.price_inr)} / year</span>
                    )}
                    <Button variant="teal" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/advisor/${advisor.id}`); }}>
                      Book Discovery Call
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
