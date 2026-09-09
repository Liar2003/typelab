import { memo, useMemo } from 'react';
import { useTypingStore } from '../../store/typingStore';
import { FINGER_MAP } from '../../engine/fingerMapping';

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const fingerColors: Record<string, string> = {
  leftPinky: 'bg-purple-500/30',
  leftRing: 'bg-blue-500/30',
  leftMiddle: 'bg-green-500/30',
  leftIndex: 'bg-yellow-500/30',
  rightIndex: 'bg-yellow-500/30',
  rightMiddle: 'bg-green-500/30',
  rightRing: 'bg-blue-500/30',
  rightPinky: 'bg-purple-500/30',
};

export const Keyboard2D = memo(function Keyboard2D() {
  const characters = useTypingStore((s) => s.characters);
  const currentIndex = useTypingStore((s) => s.currentIndex);

  const pressedKeys = useMemo(() => new Set(
    characters
      .slice(0, currentIndex)
      .map((c) => c.expected.toLowerCase())
  ), [characters, currentIndex]);

  const incorrectKeys = useMemo(() => new Set(
    characters
      .slice(0, currentIndex)
      .filter((c) => c.state === 'incorrect')
      .map((c) => c.expected.toLowerCase())
  ), [characters, currentIndex]);

  const expectedKey = characters[currentIndex]?.expected.toLowerCase();

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col items-center gap-1 p-4 rounded-2xl glass">
        {keyboardLayout.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1"
            style={{ paddingLeft: `${rowIndex * 16}px` }}
          >
            {row.map((key) => {
              const isPressed = pressedKeys.has(key);
              const isIncorrect = incorrectKeys.has(key);
              const isExpected = key === expectedKey;
              const finger = FINGER_MAP[key]?.finger;
              const fingerColor = finger ? fingerColors[finger] : '';

              return (
                <div
                  key={key}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                    rounded-lg font-mono text-sm uppercase transition-all duration-150
                    ${isExpected ? 'bg-type-accent text-white scale-105' : ''}
                    ${isPressed && !isIncorrect ? 'bg-type-success/30 text-type-success' : ''}
                    ${isIncorrect ? 'bg-type-error/30 text-type-error' : ''}
                    ${!isPressed && !isExpected ? `bg-type-border text-type-dim ${fingerColor}` : ''}
                    ${isExpected ? 'ring-2 ring-type-accent' : ''}
                  `}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex gap-1 mt-1">
          <div className="w-32 md:w-40 h-10 md:h-12 flex items-center justify-center rounded-lg bg-type-border text-type-dim text-xs uppercase">
            Space
          </div>
        </div>
      </div>
    </div>
  );
});
