import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHistoryStore } from '../store/historyStore';
import { Navigation } from '../components/layout/Navigation';
import { ArrowLeft, Trash2, Filter, SortAsc } from 'lucide-react';
import { format } from 'date-fns';

export function History() {
  const navigate = useNavigate();
  const results = useHistoryStore((s) => s.results);
  const deleteResult = useHistoryStore((s) => s.deleteResult);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  
  const [sortBy, setSortBy] = useState<'date' | 'wpm' | 'accuracy'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterMode, setFilterMode] = useState<string>('all');

  const filteredResults = useMemo(() => {
    let filtered = [...results];
    
    if (filterMode !== 'all') {
      filtered = filtered.filter((r) => r.mode === filterMode);
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'wpm':
          comparison = a.wpm - b.wpm;
          break;
        case 'accuracy':
          comparison = a.accuracy - b.accuracy;
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return filtered;
  }, [results, sortBy, sortOrder, filterMode]);

  const modes = ['all', 'time', 'words', 'quote', 'practice', 'programming'];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-type-dim hover:text-type-text transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Back</span>
              </button>
              <h1 className="text-lg font-semibold text-type-text">Test History</h1>
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 text-type-error hover:text-type-error/80 transition-colors"
              >
                <Trash2 size={18} />
                <span className="text-sm">Clear</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-type-dim" />
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="bg-type-border text-type-text px-3 py-1.5 rounded-lg text-sm"
                >
                  {modes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode === 'all' ? 'All Modes' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc size={16} className="text-type-dim" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-type-border text-type-text px-3 py-1.5 rounded-lg text-sm"
                >
                  <option value="date">Date</option>
                  <option value="wpm">WPM</option>
                  <option value="accuracy">Accuracy</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2 py-1.5 rounded-lg bg-type-border text-type-text text-sm"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-type-dim">No test results yet</p>
                <p className="text-type-dim text-sm mt-2">
                  Complete a typing test to see your history
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl glass hover:bg-type-border/50 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-type-dim w-32">
                        {format(new Date(result.timestamp), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-type-dim w-20">
                        {format(new Date(result.timestamp), 'h:mm a')}
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{result.wpm}</div>
                        <div className="text-xs text-type-dim">WPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-type-success">{result.accuracy}%</div>
                        <div className="text-xs text-type-dim">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-type-accent">{result.consistency}%</div>
                        <div className="text-xs text-type-dim">Consistency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-type-dim capitalize">{result.mode}</div>
                        <div className="text-xs text-type-dim">{result.duration}s</div>
                      </div>
                      <button
                        onClick={() => deleteResult(result.id)}
                        className="p-2 rounded-lg hover:bg-type-error/20 text-type-dim hover:text-type-error transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
