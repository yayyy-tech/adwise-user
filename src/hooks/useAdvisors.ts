import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

export function useAdvisors(filters?: {
  specialisation?: string;
  minRating?: number;
  language?: string;
  sortBy?: string;
}) {
  const { user } = useUserStore();

  return useQuery({
    queryKey: ['advisors', user?.id, filters],
    queryFn: async () => {
      let query = supabase
        .from('advisor_profiles')
        .select(`
          id, bio, tagline, photo_url, years_experience, qualifications,
          languages, specialisations, primary_specialisation, rating, review_count,
          response_time_hours, client_count, sebi_registration_number,
          profiles!id(full_name, city, avatar_url),
          advisor_plans(id, name, price_inr, sessions_included, is_popular),
          match_scores(score)
        `)
        .eq('status', 'active')
        .eq('onboarding_completed', true);

      if (user?.id) {
        query = query.eq('match_scores.user_id', user.id);
      }
      if (filters?.minRating) query = query.gte('rating', filters.minRating);
      if (filters?.specialisation) query = query.contains('specialisations', [filters.specialisation]);
      if (filters?.language) query = query.contains('languages', [filters.language]);

      const { data, error } = await query;
      if (error) throw error;

      const sorted = [...(data || [])].sort((a, b) => {
        const scoreA = a.match_scores?.[0]?.score ?? 0;
        const scoreB = b.match_scores?.[0]?.score ?? 0;
        if (filters?.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (filters?.sortBy === 'experience') return (b.years_experience || 0) - (a.years_experience || 0);
        if (filters?.sortBy === 'fee_low') return (a.advisor_plans?.[0]?.price_inr || 0) - (b.advisor_plans?.[0]?.price_inr || 0);
        return scoreB - scoreA;
      });

      return sorted;
    },
    enabled: !!user?.id,
  });
}

export function useAdvisor(advisorId: string) {
  return useQuery({
    queryKey: ['advisor', advisorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select(`
          *, profiles!id(full_name, city, avatar_url, email),
          advisor_plans(*),
          advisor_availability(*),
          advisor_blocked_dates(*),
          reviews(*, profiles!user_id(full_name, avatar_url))
        `)
        .eq('id', advisorId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!advisorId,
  });
}
