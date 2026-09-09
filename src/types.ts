export type CharacterState = 'pending' | 'current' | 'correct' | 'incorrect' | 'skipped';

export type TestMode = 'time' | 'words' | 'quote' | 'custom' | 'practice' | 'programming';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert';

export type SessionStatus = 'idle' | 'ready' | 'running' | 'finished' | 'results';

export interface TestConfig {
  mode: TestMode;
  duration: number;
  wordCount: number;
  difficulty: Difficulty;
  language: string;
  programmingLanguage?: string;
  customText?: string;
}

export interface Character {
  char: string;
  state: CharacterState;
  expected: string;
}

export interface TimelineEntry {
  second: number;
  wpm: number;
  accuracy: number;
}

export interface KeyStats {
  total: number;
  correct: number;
  incorrect: number;
  errors: number;
}

export interface FingerStats {
  leftPinky: number;
  leftRing: number;
  leftMiddle: number;
  leftIndex: number;
  rightIndex: number;
  rightMiddle: number;
  rightRing: number;
  rightPinky: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  duration: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalCharacters: number;
  errorsByKey: Record<string, number>;
  errorsByFinger: Record<string, number>;
  timeline: TimelineEntry[];
  language: string;
}

export interface PersonalBest {
  highestWpm: number;
  highestAccuracy: number;
  highestConsistency: number;
  longestTest: number;
  testsCompleted: number;
  totalCharactersTyped: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  soundVolume: number;
  showLiveWpm: boolean;
  showErrors: boolean;
  smoothCaret: boolean;
  autoFocus: boolean;
  stopOnError: boolean;
  restartKey: string;
  enable3D: boolean;
  showHands: boolean;
  showKeyboard: boolean;
  animationQuality: 'low' | 'medium' | 'high';
  shadows: boolean;
  postProcessing: boolean;
}

export type Finger = 
  | 'leftPinky' | 'leftRing' | 'leftMiddle' | 'leftIndex'
  | 'rightIndex' | 'rightMiddle' | 'rightRing' | 'rightPinky';

export interface FingerMapping {
  [key: string]: { finger: Finger; hand: 'left' | 'right' };
}
