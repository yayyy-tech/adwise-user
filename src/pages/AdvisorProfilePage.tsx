import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Star, Heart, Calendar, Video, Check } from 'lucide-react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { StarRating } from '../components/ui/StarRating';
import { Modal } from '../components/ui/Modal';
import { useAdvisor } from '../hooks/useAdvisors';
import { useAvailableSlots, useCreateBooking } from '../hooks/useBookings';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../lib/utils';

export default function AdvisorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { data: advisor, isLoading } = useAdvisor(id || '');
  const createBooking = useCreateBooking();
  const [activeTab, setActiveTab] = useState('About');
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [booked, setBooked] = useState(false);

  const { data: availableSlots } = useAvailableSlots(id || '', selectedDate);

  // Generate next 7 available dates for the picker
  const nextDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
        </div>
      </DashboardShell>
    );
  }

  if (!advisor) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="font-body text-sm text-dark-muted">Advisor not found.</p>
          <Button variant="dark-outline" size="sm" className="mt-4" onClick={() => navigate('/browse-advisors')}>Back to Browse</Button>
        </div>
      </DashboardShell>
    );
  }

  const name = advisor.profiles?.full_name || 'Advisor';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const plans = advisor.advisor_plans || [];
  const reviews = advisor.reviews || [];

  const handleBook = async () => {
    if (!selectedSlot || !selectedDate || !user?.id || !id) return;
    const [hh, mm] = selectedSlot.split(':');
    const dt = new Date(selectedDate);
    dt.setHours(parseInt(hh), parseInt(mm), 0, 0);
    try {
      await createBooking.mutateAsync({
        user_id: user.id,
        advisor_id: id,
        scheduled_at: dt.toISOString(),
        booking_type: 'discovery',
      });
      setBooked(true);
      setTimeout(() => { setBookingModal(false); setBooked(false); navigate('/bookings'); }, 1500);
    } catch (e) {
      console.error('Booking failed:', e);
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-[960px]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm text-dark-muted hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] bg-dark-surface p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-teal/20 font-body text-2xl font-semibold text-teal">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-body text-2xl font-semibold text-white">{name}</h1>
              </div>
              <p className="font-mono text-xs text-dark-muted mt-1">{advisor.qualifications}</p>
              <p className="font-mono text-xs text-dark-muted">{advisor.sebi_registration_number}</p>
              <div className="mt-2 flex items-center gap-3 flex-wrap font-body text-xs text-dark-muted">
                <span className="text-teal">&#10003; Verified</span>
                <span>&middot;</span>
                <span>{advisor.years_experience} years</span>
                <span>&middot;</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {advisor.profiles?.city}</span>
                {advisor.rating > 0 && (
                  <>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-teal text-teal" /> {advisor.rating} ({advisor.review_count || reviews.length} reviews)</span>
                  </>
                )}
                {advisor.response_time_hours && (
                  <>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{advisor.response_time_hours}h reply</span>
                  </>
                )}
              </div>
              {advisor.tagline && (
                <p className="mt-3 font-display italic text-base text-dark-muted">&ldquo;{advisor.tagline}&rdquo;</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(advisor.specialisations || []).map((tag: string) => (
                  <span key={tag} className="rounded-full border border-teal/30 px-2.5 py-1 font-body text-xs text-teal">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="teal" onClick={() => { setBookingModal(true); if (!selectedDate) setSelectedDate(nextDates[0]); }}>Book Free Discovery Call &rarr;</Button>
            <Button variant="dark-outline"><Heart className="h-4 w-4 mr-1.5" /> Save Advisor</Button>
          </div>
        </motion.div>

        <Tabs tabs={['About', 'Plans', 'Availability', 'Reviews']} active={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'About' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="rounded-[16px] bg-dark-surface p-6">
                <h3 className="font-body text-base font-semibold text-white mb-3">About</h3>
                <p className="font-body text-sm leading-relaxed text-dark-muted">{advisor.bio}</p>
              </div>
              <div className="rounded-[16px] bg-dark-surface p-6">
                <h3 className="font-body text-base font-semibold text-white mb-3">Specialisations</h3>
                <div className="flex flex-wrap gap-2">
                  {(advisor.specialisations || []).map((tag: string) => (
                    <span key={tag} className="rounded-full border border-teal/30 px-3 py-1 font-body text-sm text-teal">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-[16px] bg-dark-surface p-6">
                <h3 className="font-body text-base font-semibold text-white mb-3">Languages</h3>
                <p className="font-body text-sm text-dark-muted">{(advisor.languages || []).join(', ')}</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'Plans' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {plans.length === 0 ? (
                <p className="col-span-3 text-center py-10 font-body text-sm text-dark-muted">No plans available yet.</p>
              ) : (
                plans.map((plan: any) => (
                  <div key={plan.id} className={cn('rounded-[20px] bg-dark-surface p-7 relative', plan.is_popular && 'border border-teal')}>
                    {plan.is_popular && (
                      <span className="absolute -top-3 left-6 rounded-full bg-teal px-3 py-1 font-body text-[11px] font-semibold text-dark-base">MOST POPULAR</span>
                    )}
                    <p className="font-body text-sm font-medium uppercase tracking-wide text-dark-muted">{plan.name}</p>
                    <p className="mt-2 font-mono text-[32px] text-dark-text">{'\u20b9'}{new Intl.NumberFormat('en-IN').format(plan.price_inr)}<span className="text-sm text-dark-muted"> / year</span></p>
                    <p className="mt-1 font-body text-sm text-dark-muted">{plan.sessions_included} sessions included</p>
                    <Button variant={plan.is_popular ? 'teal' : 'dark-outline'} fullWidth className="mt-6" onClick={() => { setBookingModal(true); if (!selectedDate) setSelectedDate(nextDates[0]); }}>
                      Book a Discovery Call First
                    </Button>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'Availability' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="font-body text-sm text-dark-muted mb-4">Select a date to see available slots:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {nextDates.slice(0, 7).map((d) => (
                  <button
                    key={d.toDateString()}
                    onClick={() => setSelectedDate(d)}
                    className={cn(
                      'rounded-[8px] border px-4 py-2 font-body text-sm transition-colors',
                      selectedDate?.toDateString() === d.toDateString()
                        ? 'border-teal bg-teal/10 text-teal'
                        : 'border-dark-border text-dark-muted hover:text-white'
                    )}
                  >
                    {d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <div className="rounded-[16px] bg-dark-surface p-5">
                  <p className="font-body text-sm font-medium text-white mb-3">
                    {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  {!availableSlots || availableSlots.length === 0 ? (
                    <p className="font-body text-sm text-dark-muted">No slots available on this date.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.map((slot: string) => (
                        <button
                          key={slot}
                          onClick={() => { setSelectedSlot(slot); setBookingModal(true); }}
                          className="rounded-[8px] border border-dark-border bg-dark-surface-2 px-4 py-2 font-body text-sm text-dark-text hover:border-teal hover:text-teal transition-colors"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="rounded-[16px] bg-dark-surface p-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-mono text-4xl text-white">{advisor.rating || '—'}</p>
                    <StarRating value={Math.round(advisor.rating || 0)} readonly size={16} />
                    <p className="mt-1 font-body text-xs text-dark-muted">{reviews.length} reviews</p>
                  </div>
                </div>
              </div>
              {reviews.length === 0 ? (
                <p className="text-center py-10 font-body text-sm text-dark-muted">No reviews yet.</p>
              ) : (
                reviews.map((review: any) => {
                  const reviewerName = review.profiles?.full_name || 'Anonymous';
                  const reviewInitials = reviewerName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={review.id} className="rounded-[16px] bg-dark-surface p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-surface-2 font-body text-xs text-dark-muted">
                          {reviewInitials}
                        </div>
                        <div>
                          <p className="font-body text-sm text-white">{reviewerName}</p>
                          <div className="flex items-center gap-2">
                            <StarRating value={review.rating} readonly size={12} />
                            <span className="font-body text-xs text-dark-muted">
                              {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 font-body text-sm text-dark-muted leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </div>

        {/* Booking Modal */}
        <Modal open={bookingModal} onClose={() => setBookingModal(false)} title="Book Discovery Call">
          {booked ? (
            <div className="flex flex-col items-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} className="flex h-14 w-14 items-center justify-center rounded-full bg-teal mb-4">
                <Check className="h-7 w-7 text-dark-base" />
              </motion.div>
              <p className="font-body text-base font-medium text-white">Booking confirmed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-body text-sm text-dark-muted">{name}</p>
              <div className="space-y-2 font-body text-sm text-dark-text">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal" />
                  {selectedDate ? selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Select a date'}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal" />
                  {selectedSlot || 'Select a time slot'} IST &middot; 60 minutes
                </p>
                <p className="flex items-center gap-2"><Video className="h-4 w-4 text-teal" /> Daily.co Video Call</p>
              </div>
              {!selectedDate && (
                <div className="flex flex-wrap gap-2">
                  {nextDates.slice(0, 5).map((d) => (
                    <button
                      key={d.toDateString()}
                      onClick={() => setSelectedDate(d)}
                      className={cn(
                        'rounded-[8px] border px-3 py-1.5 font-body text-xs transition-colors',
                        (selectedDate as Date | null)?.toDateString() === d.toDateString()
                          ? 'border-teal text-teal' : 'border-dark-border text-dark-muted hover:text-white'
                      )}
                    >
                      {d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </button>
                  ))}
                </div>
              )}
              {selectedDate && !selectedSlot && availableSlots && availableSlots.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map((slot: string) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className="rounded-[8px] border border-dark-border px-3 py-1.5 font-body text-xs text-dark-muted hover:text-teal hover:border-teal"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
              <p className="font-body text-sm font-medium text-teal">Free &mdash; no payment required</p>
              <Button
                variant="teal"
                fullWidth
                onClick={handleBook}
                disabled={!selectedDate || !selectedSlot || createBooking.isPending}
              >
                {createBooking.isPending ? 'Booking...' : 'Confirm Booking \u2192'}
              </Button>
              <button onClick={() => setBookingModal(false)} className="w-full text-center font-body text-sm text-dark-muted hover:text-white">
                &larr; Choose different time
              </button>
            </div>
          )}
        </Modal>
      </div>
    </DashboardShell>
  );
}
