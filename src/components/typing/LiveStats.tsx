import { memo } from 'react';
import { useTypingStore } from '../../store/typingStore';
import { useSettingsStore } from '../../store/settingsStore';

export const LiveStats = memo(function LiveStats() {
  const wpm = useTypingStore((s) => s.wpm);
  const accuracy = useTypingStore((s) => s.accuracy);
  const errors = useTypingStore((s) => s.errors);
  const remainingTime = useTypingStore((s) => s.remainingTime);
  const elapsedTime = useTypingStore((s) => s.elapsedTime);
  const config = useTypingStore((s) => s.config);
  const status = useTypingStore((s) => s.status);
  const showLiveWpm = useSettingsStore((s) => s.settings.showLiveWpm);

  if (status !== 'running') return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-8">
        {showLiveWpm && (
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">{wpm}</div>
            <div className="text-xs text-type-dim uppercase tracking-wider">WPM</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-type-success">
            {accuracy.toFixed(1)}%
          </div>
          <div className="text-xs text-type-dim uppercase tracking-wider">Accuracy</div>
        </div>
        {errors > 0 && (
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-type-error">{errors}</div>
            <div className="text-xs text-type-dim uppercase tracking-wider">Errors</div>
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold text-type-accent">
          {config.mode === 'time' ? formatTime(remainingTime) : formatTime(elapsedTime)}
        </div>
        <div className="text-xs text-type-dim uppercase tracking-wider">
          {config.mode === 'time' ? 'Remaining' : 'Elapsed'}
        </div>
      </div>
    </div>
  );
});
