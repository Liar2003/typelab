import { TestMode, Difficulty } from '../types';
import { commonWords } from '../data/words';
import { quotes } from '../data/quotes';
import { programmingSnippets } from '../data/programming';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function filterByDifficulty(words: string[], difficulty: Difficulty): string[] {
  switch (difficulty) {
    case 'easy':
      return words.filter(w => w.length <= 5);
    case 'normal':
      return words.filter(w => w.length <= 8);
    case 'hard':
      return words.filter(w => w.length >= 4);
    case 'expert':
      return words;
    default:
      return words;
  }
}

export function generateText(
  mode: TestMode,
  wordCount: number,
  difficulty: Difficulty,
  programmingLanguage?: string,
  customText?: string
): string {
  if (mode === 'custom' && customText) {
    return customText;
  }

  if (mode === 'programming' && programmingLanguage) {
    const snippets = programmingSnippets[programmingLanguage] || programmingSnippets['javascript'];
    return snippets[Math.floor(Math.random() * snippets.length)];
  }

  if (mode === 'quote') {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return quote;
  }

  let words = filterByDifficulty([...commonWords], difficulty);
  words = shuffleArray(words);
  
  const selectedWords = words.slice(0, Math.min(wordCount, words.length));
  return selectedWords.join(' ');
}

export function generateWeakKeyExercise(weakKeys: Array<{ key: string; errors: number }>): string {
  if (weakKeys.length === 0) {
    return generateText('words', 50, 'normal');
  }

  const topKeys = weakKeys.slice(0, 3).map(k => k.key);
  const exercises: string[] = [];

  topKeys.forEach(key => {
    exercises.push(key.repeat(5));
  });

  for (let i = 0; i < 5; i++) {
    const combo = shuffleArray(topKeys).join('');
    exercises.push(combo);
  }

  const words = commonWords.filter(w => 
    topKeys.some(key => w.includes(key))
  );
  
  if (words.length > 0) {
    const selectedWords = shuffleArray(words).slice(0, 10);
    exercises.push(...selectedWords);
  }

  return exercises.join(' ');
}
