import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserAnswers {
  situation: string;
  moneyLocation: string;
  topGoal: string;
  employmentType: string;
  incomeRange: string;
  monthlySurplus: string;
  currentInvestments: string;
  workingStyle: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
}

interface UserStore {
  // Auth state
  user: any | null;
  profile: any | null;
  userProfile: any | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Questionnaire state (local until saved)
  email: string;
  answers: Partial<UserAnswers>;
  currentStep: number;

  // Auth methods
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  _loadUser: (session: any) => Promise<void>;

  // Legacy methods (kept for compatibility)
  setAuthenticated: (val: boolean) => void;
  setEmail: (email: string) => void;
  setAnswer: (key: keyof UserAnswers, value: string) => void;
  setStep: (step: number) => void;
  resetQuestionnaire: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  profile: null,
  userProfile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  email: '',
  answers: {},
  currentStep: 1,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await get()._loadUser(session);
      }
    } catch (e) {
      console.error('Auth init error:', e);
    }
    set({ isLoading: false });

    supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await get()._loadUser(session);
      } else {
        set({ user: null, profile: null, userProfile: null, session: null, isAuthenticated: false });
      }
    });
  },

  _loadUser: async (session) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'user') {
      await supabase.auth.signOut();
      return;
    }

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    set({
      user: session.user,
      profile,
      userProfile,
      session,
      isAuthenticated: true,
      email: session.user.email || '',
    });
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signUp: async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: 'user' } },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      profile: null,
      userProfile: null,
      session: null,
      isAuthenticated: false,
      answers: {},
      currentStep: 1,
    });
    window.location.href = '/';
  },

  refreshProfile: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) await get()._loadUser(session);
  },

  // Legacy methods
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setEmail: (email) => set({ email }),
  setAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),
  setStep: (step) => set({ currentStep: step }),
  resetQuestionnaire: () => set({ answers: {}, currentStep: 1 }),
}));
