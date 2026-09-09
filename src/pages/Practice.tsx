import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTypingStore } from '../store/typingStore';
import { Navigation } from '../components/layout/Navigation';
import { TypingTest } from '../components/typing/TypingTest';
import { Keyboard2D } from '../components/keyboard/Keyboard2D';
import { Keyboard3D } from '../components/keyboard/Keyboard3D';
import { useSettingsStore } from '../store/settingsStore';
import { Keyboard, Zap, Target, ArrowLeft } from 'lucide-react';

type PracticeMode = 'weakKeys' | 'weakFingers' | 'accuracy' | 'speed' | 'custom';

export function Practice() {
  const navigate = useNavigate();
  const location = useLocation();
  const status = useTypingStore((s) => s.status);
  const initTest = useTypingStore((s) => s.initTest);
  const enable3D = useSettingsStore((s) => s.settings.enable3D);
  const showKeyboard = useSettingsStore((s) => s.settings.showKeyboard);
  
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  const [weakKeys] = useState(() => {
    const state = location.state as { weakKeys?: Array<{ key: string; errors: number }> } | null;
    return state?.weakKeys || [];
  });

  const startPractice = (mode: PracticeMode) => {
    setSelectedMode(mode);
    initTest({
      mode: 'practice',
      duration: 60,
      wordCount: 50,
      difficulty: 'normal',
      language: 'english',
    });
  };

  if (selectedMode && status !== 'idle') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              useTypingStore.getState().reset();
              setSelectedMode(null);
            }}
            className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <div className="text-sm text-type-dim uppercase tracking-wider">
            Practice Mode
          </div>
        </div>
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

  const modes = [
    {
      id: 'weakKeys' as PracticeMode,
      icon: Target,
      title: 'Weak Keys',
      description: 'Practice the keys you struggle with the most',
      hasWeakKeys: weakKeys.length > 0,
    },
    {
      id: 'weakFingers' as PracticeMode,
      icon: Zap,
      title: 'Weak Fingers',
      description: 'Strengthen your weakest finger combinations',
      hasWeakKeys: false,
    },
    {
      id: 'accuracy' as PracticeMode,
      icon: Target,
      title: 'Accuracy',
      description: 'Focus on typing precision',
      hasWeakKeys: false,
    },
    {
      id: 'speed' as PracticeMode,
      icon: Keyboard,
      title: 'Speed',
      description: 'Push your typing speed limits',
      hasWeakKeys: false,
    },
    {
      id: 'custom' as PracticeMode,
      icon: Keyboard,
      title: 'Custom',
      description: 'Create your own practice session',
      hasWeakKeys: false,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors mb-8"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Back to Home</span>
            </button>

            <h1 className="text-3xl font-bold text-white mb-2">Practice Mode</h1>
            <p className="text-type-dim mb-8">
              Targeted practice to improve your weakest areas
            </p>

            {weakKeys.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-type-accent/10 border border-type-accent/20">
                <p className="text-sm text-type-accent mb-2">
                  Detected weak keys from your last test:
                </p>
                <div className="flex gap-2">
                  {weakKeys.map((wk) => (
                    <span
                      key={wk.key}
                      className="px-3 py-1 rounded-lg bg-type-accent/20 text-type-accent font-mono"
                    >
                      {wk.key.toUpperCase()} ({wk.errors} errors)
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => startPractice(mode.id)}
                    className="w-full p-4 rounded-xl glass flex items-center gap-4 hover:bg-type-border/50 transition-all duration-200 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-type-accent/20 flex items-center justify-center">
                      <Icon size={24} className="text-type-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-type-text">{mode.title}</h3>
                      <p className="text-sm text-type-dim">{mode.description}</p>
                    </div>
                    {mode.hasWeakKeys && (
                      <span className="px-2 py-1 rounded text-xs bg-type-accent/20 text-type-accent">
                        Recommended
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}


