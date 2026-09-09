import { useNavigate } from 'react-router-dom';
import { useTypingStore } from '../../store/typingStore';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { useTimer } from '../../hooks/useTimer';
import { TypingText } from './TypingText';
import { LiveStats } from './LiveStats';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowLeft } from 'lucide-react';

export function TypingTest() {
  const navigate = useNavigate();
  const status = useTypingStore((s) => s.status);
  const text = useTypingStore((s) => s.text);
  const config = useTypingStore((s) => s.config);

  useKeyboardInput();
  useTimer();

  if (!text) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-type-dim">No test configured</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <div className="text-sm text-type-dim uppercase tracking-wider">
          {config.mode === 'time' ? `${config.duration}s` : `${config.wordCount} words`}
        </div>
        <button
          onClick={() => {
            useTypingStore.getState().reset();
            useTypingStore.getState().initTest(config);
          }}
          className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
        >
          <RotateCcw size={18} />
          <span className="text-sm">Restart</span>
        </button>
      </div>

      <LiveStats />

      <div className="flex-1 flex items-center justify-center">
        <TypingText />
      </div>

      <AnimatePresence>
        {status === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10"
          >
            <div className="text-center">
              <p className="text-2xl font-light text-type-text mb-4">Press any key to start</p>
              <p className="text-type-dim">or press Space to begin</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
