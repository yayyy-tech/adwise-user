import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar } from 'lucide-react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../lib/utils';

export default function EngagementsPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [tab, setTab] = useState('Active');

  const { data: engagements, isLoading } = useQuery({
    queryKey: ['user-engagements', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagements')
        .select(`
          *,
          advisor:profiles!advisor_id(full_name, avatar_url),
          advisor_profile:advisor_profiles!advisor_id(sebi_registration_number, qualifications)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const all = engagements ?? [];
  const active = all.filter((e: any) => e.status === 'active');
  const proposed = all.filter((e: any) => e.status === 'proposed');
  const completed = all.filter((e: any) => e.status === 'completed');
  const filtered = tab === 'Active' ? active : tab === 'Proposed' ? proposed : completed;

  const getInitials = (e: any) => {
    const name = e.advisor?.full_name || 'A';
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <DashboardShell>
      <div className="max-w-[960px]">
        <h1 className="font-display text-[32px] text-dark-text mb-6">My Engagements</h1>

        <Tabs tabs={['Active', 'Proposed', 'Completed']} active={tab} onChange={setTab} />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <p className="font-body text-sm text-dark-muted mb-3">No {tab.toLowerCase()} engagements</p>
                <Button variant="teal" size="sm" onClick={() => navigate('/browse-advisors')}>Find an Advisor</Button>
              </div>
            ) : (
              filtered.map((eng: any, i: number) => (
                <motion.div
                  key={eng.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-[20px] bg-dark-surface p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn(
                      'rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wide',
                      eng.status === 'active' ? 'bg-teal/10 text-teal'
                      : eng.status === 'proposed' ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-blue-500/10 text-blue-400'
                    )}>
                      {eng.status === 'active' ? 'Active Engagement' : eng.status === 'proposed' ? 'Proposal Received' : 'Completed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal/20 font-body text-base font-semibold text-teal">
                      {getInitials(eng)}
                    </div>
                    <div>
                      <p className="font-body text-base font-medium text-white">{eng.advisor?.full_name || 'Advisor'}</p>
                      <p className="font-mono text-xs text-dark-muted">
                        {eng.plan_snapshot?.name || 'Plan'} &middot; {'\u20b9'}{new Intl.NumberFormat('en-IN').format(eng.plan_snapshot?.price_inr || 0)} / year
                      </p>
                    </div>
                  </div>

                  {eng.status === 'active' && (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between font-body text-xs text-dark-muted">
                          <span>Sessions</span>
                          <span>{eng.sessions_completed || 0} of {eng.sessions_included || 0} completed</span>
                        </div>
                        <div className="flex gap-1.5">
                          {Array.from({ length: eng.sessions_included || 0 }).map((_, j) => (
                            <div key={j} className={cn('h-2.5 w-2.5 rounded-full', j < (eng.sessions_completed || 0) ? 'bg-teal' : 'border border-dark-border')} />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="teal" size="sm" onClick={() => navigate('/messages')}><MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Message Advisor</Button>
                        <Button variant="dark-outline" size="sm" onClick={() => navigate('/bookings')}><Calendar className="h-3.5 w-3.5 mr-1.5" /> Book Next Session</Button>
                        <Button variant="dark-outline" size="sm" onClick={() => navigate('/kyc')}>View Docs</Button>
                      </div>
                    </>
                  )}

                  {eng.status === 'proposed' && (
                    <>
                      <div className="flex gap-2">
                        <Button variant="dark-outline" size="sm" onClick={() => navigate(`/advisor/${eng.advisor_id}`)}>View Full Details</Button>
                        <Button variant="teal" size="sm">Accept &amp; Pay &rarr;</Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
