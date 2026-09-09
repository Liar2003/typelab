import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TestResult, PersonalBest } from '../types';

interface HistoryState {
  results: TestResult[];
  personalBest: PersonalBest;
  addResult: (result: TestResult) => void;
  deleteResult: (id: string) => void;
  clearHistory: () => void;
  getRecentResults: (count: number) => TestResult[];
  getResultsByMode: (mode: string) => TestResult[];
  getAverageWpm: () => number;
  getAverageAccuracy: () => number;
}

const defaultPersonalBest: PersonalBest = {
  highestWpm: 0,
  highestAccuracy: 0,
  highestConsistency: 0,
  longestTest: 0,
  testsCompleted: 0,
  totalCharactersTyped: 0,
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      results: [],
      personalBest: defaultPersonalBest,
      
      addResult: (result: TestResult) =>
        set((state) => {
          const newResults = [result, ...state.results];
          
          const newPersonalBest: PersonalBest = {
            highestWpm: Math.max(state.personalBest.highestWpm, result.wpm),
            highestAccuracy: Math.max(state.personalBest.highestAccuracy, result.accuracy),
            highestConsistency: Math.max(state.personalBest.highestConsistency, result.consistency),
            longestTest: Math.max(state.personalBest.longestTest, result.duration),
            testsCompleted: state.personalBest.testsCompleted + 1,
            totalCharactersTyped: state.personalBest.totalCharactersTyped + result.totalCharacters,
          };
          
          return {
            results: newResults,
            personalBest: newPersonalBest,
          };
        }),
      
      deleteResult: (id: string) =>
        set((state) => ({
          results: state.results.filter((r) => r.id !== id),
        })),
      
      clearHistory: () =>
        set({ results: [], personalBest: defaultPersonalBest }),
      
      getRecentResults: (count: number) => {
        return get().results.slice(0, count);
      },
      
      getResultsByMode: (mode: string) => {
        return get().results.filter((r) => r.mode === mode);
      },
      
      getAverageWpm: () => {
        const results = get().results;
        if (results.length === 0) return 0;
        const sum = results.reduce((acc, r) => acc + r.wpm, 0);
        return Math.round(sum / results.length);
      },
      
      getAverageAccuracy: () => {
        const results = get().results;
        if (results.length === 0) return 100;
        const sum = results.reduce((acc, r) => acc + r.accuracy, 0);
        return Math.round((sum / results.length) * 10) / 10;
      },
    }),
    {
      name: 'typelab-history',
    }
  )
);
