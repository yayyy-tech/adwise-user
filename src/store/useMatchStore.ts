import { create } from 'zustand';
import type { MatchResult } from '../lib/matching';

interface MatchStore {
  result: MatchResult | null;
  isComputing: boolean;
  setResult: (result: MatchResult) => void;
  setComputing: (val: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  result: null,
  isComputing: false,
  setResult: (result) => set({ result }),
  setComputing: (val) => set({ isComputing: val }),
}));
