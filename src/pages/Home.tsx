import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTypingStore } from '../store/typingStore';
import { useHistoryStore } from '../store/historyStore';
import { Navigation } from '../components/layout/Navigation';
import { Keyboard, Zap, Code } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const initTest = useTypingStore((s) => s.initTest);
  const personalBest = useHistoryStore((s) => s.personalBest);
  const getAverageWpm = useHistoryStore((s) => s.getAverageWpm);
  const getAverageAccuracy = useHistoryStore((s) => s.getAverageAccuracy);

  const startTest = () => {
    initTest({
      mode: 'time',
      duration: 60,
      wordCount: 50,
      difficulty: 'normal',
      language: 'english',
    });
    navigate('/test');
  };

  const startPractice = () => {
    navigate('/practice');
  };

  const startProgramming = () => {
    initTest({
      mode: 'programming',
      duration: 60,
      wordCount: 50,
      difficulty: 'normal',
      language: 'english',
      programmingLanguage: 'javascript',
    });
    navigate('/test');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight">
              TYPE FASTER.
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold text-type-accent mb-6 tracking-tight">
              THINK FASTER.
            </h1>
            <p className="text-type-dim text-lg mb-12">
              A next-generation typing tutor with real-time 3D feedback.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={startTest}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-type-accent hover:bg-type-accent/80 text-white font-semibold transition-all duration-200 hover:scale-105"
            >
              <Keyboard size={20} />
              Start Typing
            </button>
            <button
              onClick={startPractice}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-type-border hover:bg-type-border/80 text-type-text font-semibold transition-all duration-200 hover:scale-105"
            >
              <Zap size={20} />
              Practice Weak Keys
            </button>
            <button
              onClick={startProgramming}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-type-border hover:bg-type-border/80 text-type-text font-semibold transition-all duration-200 hover:scale-105"
            >
              <Code size={20} />
              Programming Mode
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="p-4 rounded-xl glass">
              <div className="text-2xl font-bold text-white">{personalBest.highestWpm}</div>
              <div className="text-xs text-type-dim uppercase tracking-wider">Personal Best</div>
            </div>
            <div className="p-4 rounded-xl glass">
              <div className="text-2xl font-bold text-type-accent">{getAverageWpm()}</div>
              <div className="text-xs text-type-dim uppercase tracking-wider">Average WPM</div>
            </div>
            <div className="p-4 rounded-xl glass">
              <div className="text-2xl font-bold text-type-success">{getAverageAccuracy()}%</div>
              <div className="text-xs text-type-dim uppercase tracking-wider">Accuracy</div>
            </div>
            <div className="p-4 rounded-xl glass">
              <div className="text-2xl font-bold text-type-warning">{personalBest.testsCompleted}</div>
              <div className="text-xs text-type-dim uppercase tracking-wider">Tests Completed</div>
            </div>
          </motion.div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
