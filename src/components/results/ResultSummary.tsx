import { memo } from 'react';
import { motion } from 'framer-motion';
import { TestResult } from '../../types';

interface ResultSummaryProps {
  result: TestResult;
}

export const ResultSummary = memo(function ResultSummary({ result }: ResultSummaryProps) {
  const metrics = [
    { label: 'WPM', value: result.wpm, color: 'text-white', delay: 0 },
    { label: 'Accuracy', value: `${result.accuracy}%`, color: 'text-type-success', delay: 0.3 },
    { label: 'Consistency', value: `${result.consistency}%`, color: 'text-type-accent', delay: 0.6 },
    { label: 'Errors', value: result.incorrectCharacters, color: 'text-type-error', delay: 0.9 },
    { label: 'Characters', value: result.totalCharacters, color: 'text-type-dim', delay: 1.2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: metric.delay, duration: 0.5 }}
            className="text-center p-4 rounded-2xl glass"
          >
            <div className={`text-3xl md:text-4xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <div className="text-xs text-type-dim uppercase tracking-wider mt-2">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});
