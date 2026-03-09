import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, callEdgeFunction } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

export function useBookings() {
  const { user } = useUserStore();
  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *, advisor_profiles!advisor_id(
            id, rating, sebi_registration_number,
            profiles!id(full_name, avatar_url)
          ),
          discovery_feedback(id, wants_to_continue)
        `)
        .eq('user_id', user!.id)
        .order('scheduled_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { session } = useUserStore();

  return useMutation({
    mutationFn: (payload: {
      user_id: string;
      advisor_id: string;
      scheduled_at: string;
      booking_type: 'discovery' | 'session';
      engagement_id?: string;
    }) => callEdgeFunction('create-booking', payload, session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
}

export function useAvailableSlots(advisorId: string, date: Date | null) {
  return useQuery({
    queryKey: ['available-slots', advisorId, date?.toDateString()],
    queryFn: async () => {
      if (!date) return [];
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split('T')[0];

      const [{ data: avail }, { data: blocked }, { data: existing }] = await Promise.all([
        supabase.from('advisor_availability').select('*').eq('advisor_id', advisorId).eq('day_of_week', dayOfWeek).single(),
        supabase.from('advisor_blocked_dates').select('*').eq('advisor_id', advisorId).lte('start_date', dateStr).gte('end_date', dateStr),
        supabase.from('bookings').select('scheduled_at, duration_minutes').eq('advisor_id', advisorId)
          .gte('scheduled_at', `${dateStr}T00:00:00`).lte('scheduled_at', `${dateStr}T23:59:59`).not('status', 'eq', 'cancelled'),
      ]);

      if (!avail?.is_available || (blocked && blocked.length > 0)) return [];

      const slots: string[] = [];
      const [sh, sm] = avail.start_time.split(':').map(Number);
      const [eh, em] = avail.end_time.split(':').map(Number);
      let cur = sh * 60 + sm;
      const end = eh * 60 + em;

      while (cur + avail.slot_duration_minutes <= end) {
        const hh = String(Math.floor(cur / 60)).padStart(2, '0');
        const mm = String(cur % 60).padStart(2, '0');
        const slotTime = `${dateStr}T${hh}:${mm}:00+05:30`;

        const conflict = existing?.some((b: any) => {
          const bs = new Date(b.scheduled_at).getTime();
          const slotMs = new Date(slotTime).getTime();
          return Math.abs(bs - slotMs) < (b.duration_minutes + avail.buffer_minutes) * 60000;
        });

        if (!conflict) slots.push(`${hh}:${mm}`);
        cur += avail.slot_duration_minutes + avail.buffer_minutes;
      }

      return slots;
    },
    enabled: !!advisorId && !!date,
  });
}
