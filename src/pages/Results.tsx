import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTypingStore } from '../store/typingStore';
import { ResultSummary } from '../components/results/ResultSummary';
import { SpeedChart } from '../components/results/SpeedChart';
import { AccuracyChart } from '../components/results/AccuracyChart';
import { ErrorAnalysis } from '../components/results/ErrorAnalysis';
import { FingerAnalysis } from '../components/results/FingerAnalysis';
import { Recommendations } from '../components/results/Recommendations';
import { Navigation } from '../components/layout/Navigation';
import { Home, RotateCcw } from 'lucide-react';

export function Results() {
  const navigate = useNavigate();
  const currentResult = useTypingStore((s) => s.currentResult);
  const config = useTypingStore((s) => s.config);
  const initTest = useTypingStore((s) => s.initTest);

  if (!currentResult) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-type-dim">No results to display</p>
      </div>
    );
  }

  const handleRetry = () => {
    initTest(config);
    navigate('/test');
  };

  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
          >
            <Home size={18} />
            <span className="text-sm">Home</span>
          </button>
          <h1 className="text-lg font-semibold text-type-text">Test Results</h1>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
          >
            <RotateCcw size={18} />
            <span className="text-sm">Retry</span>
          </button>
        </motion.div>

        <ResultSummary result={currentResult} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpeedChart timeline={currentResult.timeline} />
          <AccuracyChart timeline={currentResult.timeline} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ErrorAnalysis result={currentResult} />
          <FingerAnalysis result={currentResult} />
        </div>

        <Recommendations result={currentResult} />
      </div>
      <Navigation />
    </div>
  );
}
