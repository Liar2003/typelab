import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useHistoryStore } from '../store/historyStore';
import { Navigation } from '../components/layout/Navigation';
import { ArrowLeft } from 'lucide-react';
import { format, subDays, startOfDay, isAfter } from 'date-fns';

type TimeRange = '7d' | '30d' | '90d' | 'all';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg">
        <p className="text-type-dim text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-bold" style={{ color: entry.color }}>
            {entry.value} {entry.dataKey === 'wpm' ? 'WPM' : entry.dataKey === 'accuracy' ? '%' : 'tests'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Statistics() {
  const navigate = useNavigate();
  const results = useHistoryStore((s) => s.results);
  const personalBest = useHistoryStore((s) => s.personalBest);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const filteredResults = useMemo(() => {
    if (timeRange === 'all') return results;
    
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = startOfDay(subDays(new Date(), days));
    return results.filter((r) => isAfter(new Date(r.timestamp), cutoff));
  }, [results, timeRange]);

  const wpmOverTime = useMemo(() => {
    return filteredResults.map((r) => ({
      date: format(new Date(r.timestamp), 'MMM d'),
      wpm: r.wpm,
    }));
  }, [filteredResults]);

  const accuracyOverTime = useMemo(() => {
    return filteredResults.map((r) => ({
      date: format(new Date(r.timestamp), 'MMM d'),
      accuracy: r.accuracy,
    }));
  }, [filteredResults]);

  const testsPerDay = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredResults.forEach((r) => {
      const day = format(new Date(r.timestamp), 'MMM d');
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [filteredResults]);

  const averageWpm = useMemo(() => {
    if (filteredResults.length === 0) return 0;
    return Math.round(filteredResults.reduce((a, r) => a + r.wpm, 0) / filteredResults.length);
  }, [filteredResults]);

  const averageAccuracy = useMemo(() => {
    if (filteredResults.length === 0) return 100;
    return Math.round(filteredResults.reduce((a, r) => a + r.accuracy, 0) / filteredResults.length * 10) / 10;
  }, [filteredResults]);

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
              <h1 className="text-lg font-semibold text-type-text">Statistics</h1>
              <div className="w-16" />
            </div>

            <div className="flex gap-2 mb-6">
              {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    timeRange === range
                      ? 'bg-type-accent text-white'
                      : 'bg-type-border text-type-dim hover:text-type-text'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl glass">
                <div className="text-2xl font-bold text-white">{personalBest.highestWpm}</div>
                <div className="text-xs text-type-dim uppercase tracking-wider">Best WPM</div>
              </div>
              <div className="p-4 rounded-xl glass">
                <div className="text-2xl font-bold text-type-accent">{averageWpm}</div>
                <div className="text-xs text-type-dim uppercase tracking-wider">Average WPM</div>
              </div>
              <div className="p-4 rounded-xl glass">
                <div className="text-2xl font-bold text-type-success">{averageAccuracy}%</div>
                <div className="text-xs text-type-dim uppercase tracking-wider">Average Accuracy</div>
              </div>
              <div className="p-4 rounded-xl glass">
                <div className="text-2xl font-bold text-type-warning">{filteredResults.length}</div>
                <div className="text-xs text-type-dim uppercase tracking-wider">Tests Completed</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-2xl glass">
                <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
                  WPM Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wpmOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                      <XAxis dataKey="date" stroke="#4a4a5a" tick={{ fill: '#4a4a5a', fontSize: 12 }} />
                      <YAxis stroke="#4a4a5a" tick={{ fill: '#4a4a5a', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="wpm" stroke="#7c3aed" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass">
                <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
                  Accuracy Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                      <XAxis dataKey="date" stroke="#4a4a5a" tick={{ fill: '#4a4a5a', fontSize: 12 }} />
                      <YAxis stroke="#4a4a5a" tick={{ fill: '#4a4a5a', fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass">
              <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
                Tests Per Day
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={testsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis dataKey="date" stroke="#4a4a5a" tick={{ fill: '#4a4a5a', fontSize: 12 }} />
                    <YAxis stroke="#4a4a5a" tick={{ fill: '#4a4a5a', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
