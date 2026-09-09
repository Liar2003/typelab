import { memo } from 'react';
import { useTypingStore } from '../../store/typingStore';

export const TypingText = memo(function TypingText() {
  const characters = useTypingStore((s) => s.characters);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="font-mono text-xl md:text-2xl leading-relaxed tracking-wide select-none">
        {characters.map((char, index) => {
          let className = '';
          
          switch (char.state) {
            case 'pending':
              className = 'text-type-dim';
              break;
            case 'current':
              className = 'text-white border-b-2 border-type-accent animate-pulse';
              break;
            case 'correct':
              className = 'text-type-success';
              break;
            case 'incorrect':
              className = 'text-type-error bg-type-error/20';
              break;
          }
          
          return (
            <span
              key={index}
              className={`${className} transition-colors duration-100`}
              data-char-index={index}
            >
              {char.char}
            </span>
          );
        })}
      </div>
    </div>
  );
});
