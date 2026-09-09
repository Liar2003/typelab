import { memo } from 'react';
import { motion } from 'framer-motion';
import { TestResult } from '../../types';

interface ErrorAnalysisProps {
  result: TestResult;
}

export const ErrorAnalysis = memo(function ErrorAnalysis({ result }: ErrorAnalysisProps) {
  const sortedErrors = Object.entries(result.errorsByKey)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  if (sortedErrors.length === 0) {
    return (
      <div className="w-full p-4 rounded-2xl glass">
        <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
          Most Difficult Keys
        </h3>
        <p className="text-type-dim text-center py-8">No errors recorded!</p>
      </div>
    );
  }

  const maxErrors = sortedErrors[0][1];

  return (
    <div className="w-full p-4 rounded-2xl glass">
      <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
        Most Difficult Keys
      </h3>
      <div className="space-y-3">
        {sortedErrors.map(([key, errors], index) => {
          const percentage = (errors / maxErrors) * 100;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-type-border font-mono text-sm uppercase">
                {key}
              </div>
              <div className="flex-1 h-2 bg-type-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="h-full bg-type-error rounded-full"
                />
              </div>
              <div className="text-sm text-type-dim w-16 text-right">
                {errors} errors
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
