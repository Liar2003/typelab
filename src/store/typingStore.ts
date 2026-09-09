import { create } from 'zustand';
import { Character, SessionStatus, TestConfig, TimelineEntry, KeyStats, FingerStats, TestResult } from '../types';
import { calculateRawWpm, calculateNetWpm, calculateAccuracy, calculateConsistency, calculateTimeline, createTestResult } from '../engine/metrics';
import { FINGER_MAP } from '../engine/fingerMapping';
import { generateText } from '../engine/textGenerator';

interface TypingState {
  status: SessionStatus;
  config: TestConfig;
  text: string;
  characters: Character[];
  currentIndex: number;
  startTime: number | null;
  elapsedTime: number;
  remainingTime: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  errors: number;
  timeline: TimelineEntry[];
  keyStats: Record<string, KeyStats>;
  fingerStats: FingerStats;
  currentResult: TestResult | null;
  expectedFinger: string | null;
  
  initTest: (config: TestConfig) => void;
  startTest: () => void;
  handleKeyPress: (key: string) => void;
  handleBackspace: () => void;
  updateTimer: () => void;
  finishTest: () => void;
  reset: () => void;
  setStatus: (status: SessionStatus) => void;
}

function createCharacters(text: string): Character[] {
  return text.split('').map((char, index) => ({
    char,
    state: index === 0 ? 'current' : 'pending',
    expected: char,
  }));
}

export const useTypingStore = create<TypingState>((set, get) => ({
  status: 'idle',
  config: {
    mode: 'time',
    duration: 60,
    wordCount: 50,
    difficulty: 'normal',
    language: 'english',
  },
  text: '',
  characters: [],
  currentIndex: 0,
  startTime: null,
  elapsedTime: 0,
  remainingTime: 60,
  wpm: 0,
  rawWpm: 0,
  accuracy: 100,
  consistency: 100,
  errors: 0,
  timeline: [],
  keyStats: {},
  fingerStats: {
    leftPinky: 0,
    leftRing: 0,
    leftMiddle: 0,
    leftIndex: 0,
    rightIndex: 0,
    rightMiddle: 0,
    rightRing: 0,
    rightPinky: 0,
  },
  currentResult: null,
  expectedFinger: null,

  initTest: (config: TestConfig) => {
    const text = generateText(
      config.mode,
      config.wordCount,
      config.difficulty,
      config.programmingLanguage,
      config.customText
    );
    
    const characters = createCharacters(text);
    const firstKey = text[0]?.toLowerCase();
    const mapping = FINGER_MAP[firstKey];
    
    set({
      status: 'ready',
      config,
      text,
      characters,
      currentIndex: 0,
      startTime: null,
      elapsedTime: 0,
      remainingTime: config.mode === 'time' ? config.duration : 0,
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      consistency: 100,
      errors: 0,
      timeline: [],
      keyStats: {},
      fingerStats: {
        leftPinky: 0,
        leftRing: 0,
        leftMiddle: 0,
        leftIndex: 0,
        rightIndex: 0,
        rightMiddle: 0,
        rightRing: 0,
        rightPinky: 0,
      },
      currentResult: null,
      expectedFinger: mapping?.finger || null,
    });
  },

  startTest: () => {
    const state = get();
    if (state.status === 'ready' || state.status === 'idle') {
      set({
        status: 'running',
        startTime: Date.now(),
      });
    }
  },

  handleKeyPress: (key: string) => {
    const state = get();
    if (state.status !== 'running') return;
    if (key.length !== 1) return;

    const { currentIndex, characters, text } = state;
    if (currentIndex >= characters.length) return;

    const expectedChar = text[currentIndex];
    const isCorrect = key === expectedChar;

    const newCharacters = [...characters];
    newCharacters[currentIndex] = {
      ...newCharacters[currentIndex],
      state: isCorrect ? 'correct' : 'incorrect',
    };

    const nextIndex = currentIndex + 1;
    if (nextIndex < newCharacters.length) {
      newCharacters[nextIndex] = {
        ...newCharacters[nextIndex],
        state: 'current',
      };
    }

    const elapsed = (Date.now() - (state.startTime || Date.now())) / 1000;
    const elapsedMinutes = elapsed / 60;
    const totalTyped = newCharacters.filter(c => c.state === 'correct' || c.state === 'incorrect').length;
    const correctCount = newCharacters.filter(c => c.state === 'correct').length;
    
    const rawWpm = calculateRawWpm(totalTyped, elapsedMinutes);
    const netWpm = calculateNetWpm(correctCount, elapsedMinutes);
    const accuracy = calculateAccuracy(correctCount, totalTyped);
    
    const timeline = state.startTime ? calculateTimeline(state.startTime, elapsed, newCharacters) : [];
    const consistency = calculateConsistency(timeline);

    const newErrors = state.errors + (isCorrect ? 0 : 1);

    const nextKey = text[nextIndex]?.toLowerCase();
    const mapping = FINGER_MAP[nextKey];

    set({
      characters: newCharacters,
      currentIndex: nextIndex,
      wpm: netWpm,
      rawWpm,
      accuracy,
      consistency,
      errors: newErrors,
      timeline,
      expectedFinger: mapping?.finger || null,
    });

    if (nextIndex >= newCharacters.length) {
      setTimeout(() => get().finishTest(), 0);
    }
  },

  handleBackspace: () => {
    const state = get();
    if (state.status !== 'running') return;
    if (state.currentIndex <= 0) return;

    const { currentIndex, characters } = state;
    const newCharacters = [...characters];
    
    newCharacters[currentIndex - 1] = {
      ...newCharacters[currentIndex - 1],
      state: 'current',
    };
    
    if (currentIndex < newCharacters.length) {
      newCharacters[currentIndex] = {
        ...newCharacters[currentIndex],
        state: 'pending',
      };
    }

    set({
      characters: newCharacters,
      currentIndex: currentIndex - 1,
    });
  },

  updateTimer: () => {
    const state = get();
    if (state.status !== 'running') return;
    if (state.config.mode !== 'time') return;
    if (!state.startTime) return;

    const elapsed = (Date.now() - state.startTime) / 1000;
    const remaining = Math.max(0, state.config.duration - elapsed);

    if (remaining <= 0) {
      get().finishTest();
    } else {
      set({
        elapsedTime: elapsed,
        remainingTime: remaining,
      });
    }
  },

  finishTest: () => {
    const state = get();
    const elapsed = state.startTime ? (Date.now() - state.startTime) / 1000 : 0;
    const elapsedMinutes = elapsed / 60;
    
    const totalTyped = state.characters.filter(c => c.state === 'correct' || c.state === 'incorrect').length;
    const correctCount = state.characters.filter(c => c.state === 'correct').length;
    
    const rawWpm = calculateRawWpm(totalTyped, elapsedMinutes);
    const netWpm = calculateNetWpm(correctCount, elapsedMinutes);
    const accuracy = calculateAccuracy(correctCount, totalTyped);
    const timeline = state.startTime ? calculateTimeline(state.startTime, elapsed, state.characters) : [];
    const consistency = calculateConsistency(timeline);

    const result = createTestResult(
      netWpm,
      rawWpm,
      accuracy,
      consistency,
      state.characters,
      state.text,
      state.config.mode === 'time' ? state.config.duration : Math.round(elapsed),
      state.config.mode,
      state.config.language,
      timeline,
      FINGER_MAP
    );

    set({
      status: 'finished',
      elapsedTime: elapsed,
      remainingTime: 0,
      wpm: netWpm,
      rawWpm,
      accuracy,
      consistency,
      timeline,
      currentResult: result,
    });
  },

  reset: () => {
    set({
      status: 'idle',
      characters: [],
      currentIndex: 0,
      startTime: null,
      elapsedTime: 0,
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      consistency: 100,
      errors: 0,
      timeline: [],
      currentResult: null,
      expectedFinger: null,
    });
  },

  setStatus: (status: SessionStatus) => set({ status }),
}));
