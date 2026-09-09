import { useEffect } from 'react';
import { useTypingStore } from '../store/typingStore';

export function useTimer() {
  const { status, updateTimer, config } = useTypingStore();

  useEffect(() => {
    if (status !== 'running' || config.mode !== 'time') return;

    const interval = setInterval(() => {
      updateTimer();
    }, 100);

    return () => clearInterval(interval);
  }, [status, config.mode, updateTimer]);
}
