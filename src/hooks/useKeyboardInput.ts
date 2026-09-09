import { useEffect, useCallback } from 'react';
import { useTypingStore } from '../store/typingStore';

export function useKeyboardInput() {
  const { status, handleKeyPress, handleBackspace, startTest, reset } = useTypingStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        reset();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        reset();
        return;
      }

      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (status === 'idle' || status === 'ready') {
          startTest();
        }
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (status === 'idle' || status === 'ready') {
        if (e.key === ' ') {
          e.preventDefault();
          startTest();
          return;
        }
      }

      if (status !== 'running') return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    },
    [status, handleKeyPress, handleBackspace, startTest, reset]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
