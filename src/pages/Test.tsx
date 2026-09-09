import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingStore } from '../store/typingStore';
import { useHistoryStore } from '../store/historyStore';
import { TypingTest } from '../components/typing/TypingTest';
import { Keyboard2D } from '../components/keyboard/Keyboard2D';
import { Keyboard3D } from '../components/keyboard/Keyboard3D';
import { useSettingsStore } from '../store/settingsStore';

export function Test() {
  const navigate = useNavigate();
  const status = useTypingStore((s) => s.status);
  const currentResult = useTypingStore((s) => s.currentResult);
  const enable3D = useSettingsStore((s) => s.settings.enable3D);
  const showKeyboard = useSettingsStore((s) => s.settings.showKeyboard);
  const addResult = useHistoryStore((s) => s.addResult);

  useEffect(() => {
    if (status === 'finished' && currentResult) {
      addResult(currentResult);
      navigate('/results');
    }
  }, [status, currentResult, navigate, addResult]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        <TypingTest />
      </div>
      {showKeyboard && (
        <div className="pb-4">
          {enable3D ? <Keyboard3D /> : <Keyboard2D />}
        </div>
      )}
    </div>
  );
}
