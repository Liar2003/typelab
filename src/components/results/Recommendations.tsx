import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TestResult } from '../../types';
import { getFingerName } from '../../engine/fingerMapping';
import { Target } from 'lucide-react';

interface RecommendationsProps {
  result: TestResult;
}

export const Recommendations = memo(function Recommendations({ result }: RecommendationsProps) {
  const navigate = useNavigate();
  
  const weakKeys = Object.entries(result.errorsByKey)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => key);

  const weakFinger = Object.entries(result.errorsByFinger)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1)
    .map(([finger]) => finger)[0];

  const weakFingerName = weakFinger ? getFingerName(weakFinger as any) : null;

  const getRecommendation = () => {
    if (weakKeys.length === 0) {
      return "Great job! Your typing is well-balanced. Keep practicing to maintain your skills.";
    }
    
    const keys = weakKeys.join('/').toUpperCase();
    let recommendation = `Focus on practicing ${keys} combinations.`;
    
    if (weakFingerName) {
      recommendation += ` Strengthen your ${weakFingerName} technique.`;
    }
    
    return recommendation;
  };

  const startPractice = () => {
    navigate('/practice', {
      state: {
        weakKeys: weakKeys.map(key => ({ key, errors: result.errorsByKey[key] || 0 })),
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="w-full p-4 rounded-2xl glass"
    >
      <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
        Your Analysis
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-type-border/50">
          <p className="text-type-text leading-relaxed">
            {getRecommendation()}
          </p>
        </div>

        {weakKeys.length > 0 && (
          <div className="p-4 rounded-xl bg-type-border/50">
            <p className="text-sm text-type-dim mb-2">Recommended Practice:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 text-sm text-type-text">
                <Target size={14} className="text-type-accent" />
                3-minute {weakKeys.join('/')} drill
              </li>
              {weakFingerName && (
                <li className="flex items-center gap-2 text-sm text-type-text">
                  <Target size={14} className="text-type-accent" />
                  2-minute {weakFingerName} exercise
                </li>
              )}
            </ul>
          </div>
        )}

        <button
          onClick={startPractice}
          className="w-full py-3 px-4 rounded-xl bg-type-accent hover:bg-type-accent/80 text-white font-medium transition-colors"
        >
          Start Recommended Practice
        </button>
      </div>
    </motion.div>
  );
});
