import { memo } from 'react';
import { motion } from 'framer-motion';
import { TestResult } from '../../types';
import { getFingerName } from '../../engine/fingerMapping';

interface FingerAnalysisProps {
  result: TestResult;
}

const fingerOrder = [
  'leftPinky', 'leftRing', 'leftMiddle', 'leftIndex',
  'rightIndex', 'rightMiddle', 'rightRing', 'rightPinky'
] as const;

export const FingerAnalysis = memo(function FingerAnalysis({ result }: FingerAnalysisProps) {
  const totalErrors = Object.values(result.errorsByFinger).reduce((a, b) => a + b, 0);
  
  const fingerData = fingerOrder.map((finger) => {
    const errors = result.errorsByFinger[finger] || 0;
    const percentage = totalErrors > 0 ? Math.round((errors / totalErrors) * 100) : 0;
    return { finger, errors, percentage };
  });

  const leftFingers = fingerData.filter(f => f.finger.startsWith('left'));
  const rightFingers = fingerData.filter(f => f.finger.startsWith('right'));

  const leftTotal = leftFingers.reduce((a, f) => a + f.errors, 0);
  const rightTotal = rightFingers.reduce((a, f) => a + f.errors, 0);

  const weakest = fingerData.reduce((max, f) => f.errors > max.errors ? f : max, fingerData[0]);

  return (
    <div className="w-full p-4 rounded-2xl glass">
      <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
        Finger Analysis
      </h3>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs text-type-accent mb-3 uppercase tracking-wider">Left Hand</h4>
          <div className="space-y-2">
            {leftFingers.map((f, index) => (
              <motion.div
                key={f.finger}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-20 text-xs text-type-dim truncate">
                  {getFingerName(f.finger).replace('Left ', '')}
                </div>
                <div className="flex-1 h-2 bg-type-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-type-accent rounded-full"
                  />
                </div>
                <div className="text-xs text-type-dim w-8 text-right">{f.percentage}%</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs text-type-accent mb-3 uppercase tracking-wider">Right Hand</h4>
          <div className="space-y-2">
            {rightFingers.map((f, index) => (
              <motion.div
                key={f.finger}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-20 text-xs text-type-dim truncate">
                  {getFingerName(f.finger).replace('Right ', '')}
                </div>
                <div className="flex-1 h-2 bg-type-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-type-accent rounded-full"
                  />
                </div>
                <div className="text-xs text-type-dim w-8 text-right">{f.percentage}%</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-type-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-type-dim">Left Hand</span>
          <span className="text-xs text-type-dim">Right Hand</span>
        </div>
        <div className="flex h-4 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${leftTotal + rightTotal > 0 ? (leftTotal / (leftTotal + rightTotal)) * 100 : 50}%` }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-blue-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${leftTotal + rightTotal > 0 ? (rightTotal / (leftTotal + rightTotal)) * 100 : 50}%` }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-purple-500"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-type-dim">{leftTotal + rightTotal > 0 ? Math.round((leftTotal / (leftTotal + rightTotal)) * 100) : 50}%</span>
          <span className="text-xs text-type-dim">{leftTotal + rightTotal > 0 ? Math.round((rightTotal / (leftTotal + rightTotal)) * 100) : 50}%</span>
        </div>
      </div>

      {weakest && weakest.errors > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 p-3 rounded-lg bg-type-error/10 border border-type-error/20"
        >
          <p className="text-sm text-type-error">
            Weakest finger: <span className="font-bold">{getFingerName(weakest.finger)}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
});
