import { Character, TimelineEntry, KeyStats, FingerStats, TestResult } from '../types';

export function calculateRawWpm(totalTypedCharacters: number, elapsedMinutes: number): number {
  if (elapsedMinutes <= 0) return 0;
  return Math.round(totalTypedCharacters / 5 / elapsedMinutes);
}

export function calculateNetWpm(correctCharacters: number, elapsedMinutes: number): number {
  if (elapsedMinutes <= 0) return 0;
  return Math.round(correctCharacters / 5 / elapsedMinutes);
}

export function calculateAccuracy(correctCharacters: number, totalTypedCharacters: number): number {
  if (totalTypedCharacters === 0) return 100;
  return Math.round((correctCharacters / totalTypedCharacters) * 1000) / 10;
}

export function calculateConsistency(timeline: TimelineEntry[]): number {
  if (timeline.length < 2) return 100;
  
  const wpmValues = timeline.map(t => t.wpm);
  const mean = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
  
  if (mean === 0) return 100;
  
  const variance = wpmValues.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmValues.length;
  const stdDev = Math.sqrt(variance);
  
  const consistency = Math.max(0, Math.min(100, 100 - (stdDev / mean) * 100));
  return Math.round(consistency);
}

export function calculateTimeline(
  startTime: number,
  elapsed: number,
  typedChars: Character[]
): TimelineEntry[] {
  const timeline: TimelineEntry[] = [];
  const interval = 1;
  
  for (let sec = interval; sec <= Math.floor(elapsed); sec += interval) {
    const timeRatio = sec / elapsed;
    const charsToShow = Math.floor(typedChars.length * timeRatio);
    
    const correctChars = typedChars.slice(0, charsToShow).filter(c => c.state === 'correct').length;
    const totalChars = charsToShow;
    
    const elapsedMinutes = sec / 60;
    const wpm = calculateNetWpm(correctChars, elapsedMinutes);
    const accuracy = calculateAccuracy(correctChars, totalChars);
    
    timeline.push({ second: sec, wpm, accuracy });
  }
  
  return timeline;
}

export function calculateKeyStats(
  typedChars: Character[],
  expectedText: string
): Record<string, KeyStats> {
  const stats: Record<string, KeyStats> = {};
  
  typedChars.forEach((char, index) => {
    const key = expectedText[index]?.toLowerCase() || '';
    if (!key) return;
    
    if (!stats[key]) {
      stats[key] = { total: 0, correct: 0, incorrect: 0, errors: 0 };
    }
    
    stats[key].total++;
    
    if (char.state === 'correct') {
      stats[key].correct++;
    } else if (char.state === 'incorrect') {
      stats[key].incorrect++;
      stats[key].errors++;
    }
  });
  
  return stats;
}

export function calculateFingerStats(
  keyStats: Record<string, KeyStats>,
  fingerMapping: Record<string, { finger: string; hand: string }>
): FingerStats {
  const stats: FingerStats = {
    leftPinky: 0,
    leftRing: 0,
    leftMiddle: 0,
    leftIndex: 0,
    rightIndex: 0,
    rightMiddle: 0,
    rightRing: 0,
    rightPinky: 0,
  };
  
  Object.entries(keyStats).forEach(([key, ks]) => {
    const mapping = fingerMapping[key];
    if (mapping) {
      const finger = mapping.finger as keyof FingerStats;
      stats[finger] += ks.errors;
    }
  });
  
  return stats;
}

export function findWeakKeys(keyStats: Record<string, KeyStats>, limit = 5): Array<{ key: string; errors: number }> {
  return Object.entries(keyStats)
    .map(([key, stats]) => ({ key, errors: stats.errors }))
    .filter(k => k.errors > 0)
    .sort((a, b) => b.errors - a.errors)
    .slice(0, limit);
}

export function findWeakFinger(fingerStats: FingerStats): { finger: string; hand: string } | null {
  const entries = Object.entries(fingerStats);
  if (entries.length === 0) return null;
  
  const [finger, errors] = entries.reduce((max, curr) => 
    curr[1] > max[1] ? curr : max
  );
  
  if (errors === 0) return null;
  
  const hand = finger.startsWith('left') ? 'left' : 'right';
  return { finger, hand };
}

export function calculateHandBalance(typedChars: Character[], expectedText: string, fingerMapping: Record<string, { finger: string; hand: string }>): { left: number; right: number } {
  let leftCount = 0;
  let rightCount = 0;
  
  typedChars.forEach((char, index) => {
    const key = expectedText[index]?.toLowerCase() || '';
    const mapping = fingerMapping[key];
    if (mapping) {
      if (mapping.hand === 'left') leftCount++;
      else rightCount++;
    }
  });
  
  const total = leftCount + rightCount;
  if (total === 0) return { left: 50, right: 50 };
  
  return {
    left: Math.round((leftCount / total) * 100),
    right: Math.round((rightCount / total) * 100),
  };
}

export function createTestResult(
  wpm: number,
  rawWpm: number,
  accuracy: number,
  consistency: number,
  typedChars: Character[],
  expectedText: string,
  duration: number,
  mode: string,
  language: string,
  timeline: TimelineEntry[],
  fingerMapping: Record<string, { finger: string; hand: string }>
): TestResult {
  const keyStats = calculateKeyStats(typedChars, expectedText);
  const errorsByKey: Record<string, number> = {};
  Object.entries(keyStats).forEach(([key, stats]) => {
    if (stats.errors > 0) errorsByKey[key] = stats.errors;
  });
  
  const fingerStats = calculateFingerStats(keyStats, fingerMapping);
  const errorsByFinger: Record<string, number> = {};
  Object.entries(fingerStats).forEach(([finger, errors]) => {
    if (errors > 0) errorsByFinger[finger] = errors;
  });
  
  const correctCharacters = typedChars.filter(c => c.state === 'correct').length;
  const incorrectCharacters = typedChars.filter(c => c.state === 'incorrect').length;
  
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    mode: mode as any,
    duration,
    wpm,
    rawWpm,
    accuracy,
    consistency,
    correctCharacters,
    incorrectCharacters,
    totalCharacters: typedChars.length,
    errorsByKey,
    errorsByFinger,
    timeline,
    language,
  };
}
