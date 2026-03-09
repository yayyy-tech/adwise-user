import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock } from 'lucide-react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { StarRating } from '../components/ui/StarRating';
import { useBookings } from '../hooks/useBookings';
import { cn } from '../lib/utils';

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  scheduled: { dot: 'bg-teal', label: 'Confirmed' },
  completed: { dot: 'bg-dark-muted', label: 'Completed' },
  cancelled: { dot: 'bg-red-500', label: 'Cancelled' },
  no_show: { dot: 'bg-amber-500', label: 'No Show' },
};

export default function BookingsPage() {
  const navigate = useNavigate();
  const { data: allBookings, isLoading } = useBookings();
  const [tab, setTab] = useState('Upcoming');
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);
  const [ratings, setRatings] = useState({ overall: 0, communication: 0, knowledge: 0 });
  const [feedbackNote, setFeedbackNote] = useState('');

  const bookings = allBookings ?? [];
  const upcoming = bookings.filter((b: any) => b.status === 'scheduled');
  const past = bookings.filter((b: any) => b.status === 'completed');
  const discovery = bookings.filter((b: any) => b.booking_type === 'discovery');
  const filtered = tab === 'Upcoming' ? upcoming : tab === 'Past' ? past : discovery;

  const handleFeedbackSubmit = (wantsToContinue: boolean) => {
    const booking = bookings.find((b: any) => b.id === feedbackFor);
    setFeedbackFor(null);
    setRatings({ overall: 0, communication: 0, knowledge: 0 });
    setFeedbackNote('');
    if (wantsToContinue && booking) {
      navigate(`/advisor/${booking.advisor_id}`);
    } else {
      navigate('/browse-advisors');
    }
  };

  const getAdvisorName = (b: any) => b.advisor_profiles?.profiles?.full_name || 'Advisor';
  const getAdvisorInitials = (b: any) => {
    const name = getAdvisorName(b);
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <DashboardShell>
      <div className="max-w-[960px]">
        <h1 className="font-display text-[32px] text-dark-text mb-6">My Bookings</h1>

        <Tabs tabs={['Upcoming', 'Past', 'Discovery Calls']} active={tab} onChange={setTab} />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-dark-surface mb-4">
                  <Calendar className="h-6 w-6 text-dark-muted" />
                </div>
                <p className="font-body text-sm text-dark-muted mb-3">No {tab.toLowerCase()} bookings</p>
                <Button variant="teal" size="sm" onClick={() => navigate('/browse-advisors')}>Browse Advisors</Button>
              </div>
            ) : (
              filtered.map((booking: any, i: number) => {
                const status = STATUS_STYLES[booking.status] || { dot: 'bg-dark-muted', label: booking.status };
                const hasFeedback = booking.discovery_feedback?.length > 0;
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-[16px] bg-dark-surface p-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal/20 font-body text-sm font-semibold text-teal">
                        {getAdvisorInitials(booking)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-body text-base font-medium text-white">
                            {getAdvisorName(booking)}
                          </p>
                          <span className="rounded-full bg-dark-surface-2 px-2 py-0.5 font-body text-xs text-dark-muted">
                            {booking.booking_type === 'discovery' ? 'Discovery Call' : 'Session'}
                          </span>
                          <span className="font-body text-xs text-dark-muted">
                            &middot; {booking.booking_type === 'discovery' ? 'FREE' : 'Included'}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 flex-wrap font-body text-sm text-dark-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(booking.scheduled_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(booking.scheduled_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} &middot; {booking.duration_minutes || 60} min
                          </span>
                          <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Video Call</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={cn('h-2 w-2 rounded-full', status.dot)} />
                          <span className="font-body text-xs text-dark-muted">{status.label}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {booking.status === 'scheduled' && booking.daily_room_url && (
                          <Button variant="teal" size="sm" onClick={() => window.open(booking.daily_room_url, '_blank')}>Join Call</Button>
                        )}
                      </div>
                    </div>

                    {booking.status === 'completed' && !hasFeedback && feedbackFor !== booking.id && (
                      <div className="mt-4 rounded-[12px] border border-dark-border bg-dark-surface-2 p-5">
                        <p className="font-body text-sm font-medium text-white mb-1">How was your call?</p>
                        <p className="font-body text-xs text-dark-muted mb-3">Rate your {booking.booking_type === 'discovery' ? 'discovery call' : 'session'} with {getAdvisorName(booking).split(' ')[0]}</p>
                        <Button variant="teal" size="sm" onClick={() => setFeedbackFor(booking.id)}>Give Feedback</Button>
                      </div>
                    )}

                    {feedbackFor === booking.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 rounded-[12px] border border-teal/20 bg-dark-surface-2 p-5 space-y-4">
                        <p className="font-body text-sm font-semibold text-white">How was your call with {getAdvisorName(booking).split(' ')[0]}?</p>
                        <div className="space-y-3">
                          {[
                            { key: 'overall', label: 'Overall experience' },
                            { key: 'communication', label: 'Communication clarity' },
                            { key: 'knowledge', label: 'Knowledge & expertise' },
                          ].map(({ key, label }) => (
                            <div key={key}>
                              <p className="font-body text-xs text-dark-muted mb-1">{label}</p>
                              <StarRating value={ratings[key as keyof typeof ratings]} onChange={(v) => setRatings({ ...ratings, [key]: v })} />
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-body text-sm text-white mb-2">Would you like to continue with {getAdvisorName(booking).split(' ')[0]}?</p>
                          <div className="flex gap-2">
                            <Button variant="teal" size="sm" onClick={() => handleFeedbackSubmit(true)}>Yes, show me their plans</Button>
                            <Button variant="dark-outline" size="sm" onClick={() => handleFeedbackSubmit(false)}>No, explore other advisors</Button>
                          </div>
                        </div>
                        <textarea
                          placeholder="Anything you'd like to add? (optional)"
                          value={feedbackNote}
                          onChange={(e) => setFeedbackNote(e.target.value)}
                          className="w-full rounded-[8px] border border-dark-border bg-dark-base px-3 py-2 font-body text-sm text-dark-text placeholder:text-dark-muted-2 focus:outline-none focus:border-teal resize-none h-20"
                        />
                        <div className="flex gap-2">
                          <Button variant="teal" size="sm" onClick={() => handleFeedbackSubmit(true)}>Submit Feedback</Button>
                          <button onClick={() => setFeedbackFor(null)} className="font-body text-xs text-dark-muted hover:text-white">Remind me later</button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
