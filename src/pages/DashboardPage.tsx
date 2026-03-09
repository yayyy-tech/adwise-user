import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Calendar, Search, Target, FileText, Settings } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { useUserStore } from '../store/useUserStore';
import { useMatchStore } from '../store/useMatchStore';
import { useAdvisors } from '../hooks/useAdvisors';
import { useBookings } from '../hooks/useBookings';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: User, label: 'My Advisor', id: 'advisor' },
  { icon: Calendar, label: 'Sessions', id: 'sessions' },
  { icon: Search, label: 'Find Advisors', id: 'find' },
  { icon: Target, label: 'My Goals', id: 'goals' },
  { icon: FileText, label: 'Documents', id: 'documents' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const { profile, userProfile } = useUserStore();
  const { result } = useMatchStore();
  const { data: advisors } = useAdvisors();
  const { data: bookings } = useBookings();

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const matchScore = result?.matchScore ?? 0;

  // Use matched advisor or first from DB
  const matchedAdvisor = result?.advisor;
  const topAdvisor = advisors?.[0];
  const advisor = matchedAdvisor || topAdvisor;

  const upcomingBooking = bookings?.find((b: any) => b.status === 'scheduled');
  const completedSessions = bookings?.filter((b: any) => b.status === 'completed').length ?? 0;
  const otherAdvisors = advisors?.filter((a: any) => a.id !== advisor?.id).slice(0, 3) ?? [];

  const getAdvisorName = (a: any) => a?.profiles?.full_name || a?.name || 'Advisor';
  const getAdvisorInitials = (a: any) => {
    const name = a?.profiles?.full_name || a?.name || 'A';
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-dark-base">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[240px] flex-col border-r border-dark-border bg-dark-base p-6">
        <Logo dark className="mb-8" />

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal font-body text-sm font-semibold text-dark-base">
            {(firstName[0] || 'A').toUpperCase()}
          </div>
          <div>
            <p className="font-body text-sm text-white">{firstName}</p>
            <p className="font-body text-xs text-dark-muted">Member</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 font-body text-sm transition-colors',
                  active
                    ? 'bg-dark-surface text-white border-l-[3px] border-l-teal'
                    : 'text-dark-muted hover:text-white hover:bg-dark-surface/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button className="flex items-center gap-3 px-3 py-2.5 font-body text-sm text-dark-muted hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-dark-border bg-dark-base px-4 py-3 md:hidden">
        <Logo dark />
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal font-body text-xs font-semibold text-dark-base">
          {(firstName[0] || 'A').toUpperCase()}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 pt-16 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[960px]"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-body text-[28px] text-dark-muted">
              {greeting}, <span className="font-display text-white">{firstName}.</span>
            </h1>
            <p className="mt-1 font-body text-[13px] text-dark-muted">
              {dateStr}
              {upcomingBooking && ` · Your next session is ${new Date(upcomingBooking.scheduled_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}`}
            </p>
          </div>

          {/* Stat Cards */}
          <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
            {[
              {
                label: 'YOUR MATCH SCORE',
                value: matchScore > 0 ? `${matchScore}%` : '—',
                sub: matchScore > 80 ? '\u2191 Highest in your category' : 'Complete questionnaire for score',
                subColor: matchScore > 80 ? 'text-teal' : 'text-dark-muted',
              },
              {
                label: 'SESSIONS COMPLETED',
                value: String(completedSessions),
                sub: completedSessions === 0 ? 'Book your first session' : `${completedSessions} session${completedSessions > 1 ? 's' : ''} done`,
                subColor: 'text-dark-muted',
              },
              {
                label: 'GOALS TRACKED',
                value: userProfile?.top_goal ? '1' : '0',
                sub: userProfile?.top_goal || 'Set your financial goals',
                subColor: 'text-dark-muted',
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[16px] bg-dark-surface p-6"
              >
                <p className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-dark-muted">
                  {card.label}
                </p>
                <p className="mt-2 font-mono text-4xl text-white">{card.value}</p>
                <p className={cn('mt-1 font-body text-xs', card.subColor)}>
                  {card.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Session */}
          {upcomingBooking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-[16px] bg-dark-surface px-6 py-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10">
                <Calendar className="h-5 w-5 text-teal" />
              </div>
              <div className="flex-1">
                <p className="font-body text-[15px] font-medium text-white">
                  Session with {upcomingBooking.advisor_profiles?.profiles?.full_name || 'your advisor'}
                </p>
                <p className="mt-0.5 font-body text-[13px] text-dark-muted">
                  {new Date(upcomingBooking.scheduled_at).toLocaleString('en-IN', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit',
                  })} &middot; {upcomingBooking.duration_minutes || 60} minutes &middot; Video Call
                </p>
              </div>
              {upcomingBooking.daily_room_url ? (
                <Button variant="teal" size="sm" onClick={() => window.open(upcomingBooking.daily_room_url, '_blank')}>
                  Join
                </Button>
              ) : (
                <Button variant="teal" size="sm" disabled className="opacity-50">Join</Button>
              )}
            </motion.div>
          )}

          {/* My Advisor */}
          {advisor && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-body text-base font-semibold text-white">My Advisor</h2>
                <button onClick={() => navigate(`/advisor/${advisor.id}`)} className="font-body text-[13px] text-teal hover:underline">View Profile &rarr;</button>
              </div>
              <div className="rounded-[20px] bg-dark-surface border-l-[3px] border-l-teal p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/20 font-body text-base font-semibold text-teal">
                    {getAdvisorInitials(advisor)}
                  </div>
                  <div>
                    <p className="font-body text-base font-medium text-white">{getAdvisorName(advisor)}</p>
                    <p className="font-mono text-xs text-dark-muted">
                      {advisor.qualifications || advisor.credentials || ''} &middot; {advisor.sebi_registration_number || advisor.sebiNumber || ''}
                    </p>
                  </div>
                </div>
                <p className="mt-3 font-body text-[13px] leading-relaxed text-dark-muted">
                  {advisor.bio || 'Your matched financial advisor.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="teal" size="sm" onClick={() => navigate('/bookings')}>Book Next Session</Button>
                  <Button variant="dark-outline" size="sm" onClick={() => navigate('/messages')}>Send Message</Button>
                  <Button variant="dark-outline" size="sm" onClick={() => navigate(`/advisor/${advisor.id}`)}>View Profile</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Explore More Advisors */}
          {otherAdvisors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-body text-base font-semibold text-white">Explore More Advisors</h2>
                <button onClick={() => navigate('/browse-advisors')} className="font-body text-[13px] text-teal hover:underline">See All &rarr;</button>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                {otherAdvisors.map((a: any, i: number) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="rounded-[16px] bg-dark-surface p-4 cursor-pointer hover:bg-dark-surface-2 transition-colors"
                    onClick={() => navigate(`/advisor/${a.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/20 font-body text-sm font-semibold text-teal">
                        {getAdvisorInitials(a)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-white truncate">{getAdvisorName(a)}</p>
                        <p className="font-mono text-[11px] text-dark-muted">{a.qualifications || ''}</p>
                      </div>
                    </div>
                    <p className="mt-2 font-body text-xs text-dark-muted line-clamp-2 leading-relaxed">
                      {a.bio || ''}
                    </p>
                    <p className="mt-2 font-body text-xs text-dark-muted-2">
                      {a.years_experience || 0} yrs &middot; {a.profiles?.city || ''}
                    </p>
                    <button className="mt-3 font-body text-[13px] text-teal hover:underline">
                      View &rarr;
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
