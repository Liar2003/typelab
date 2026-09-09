import { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimelineEntry } from '../../types';

interface AccuracyChartProps {
  timeline: TimelineEntry[];
}

export const AccuracyChart = memo(function AccuracyChart({ timeline }: AccuracyChartProps) {
  if (timeline.length === 0) return null;

  const data = timeline.map((entry) => ({
    time: entry.second,
    accuracy: entry.accuracy,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg">
          <p className="text-type-dim text-sm">{`${label}s`}</p>
          <p className="text-type-success font-bold">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 p-4 rounded-2xl glass">
      <h3 className="text-sm font-medium text-type-dim mb-4 uppercase tracking-wider">
        Accuracy Over Time
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="time"
            stroke="#4a4a5a"
            tick={{ fill: '#4a4a5a', fontSize: 12 }}
            tickFormatter={(value) => `${value}s`}
          />
          <YAxis
            stroke="#4a4a5a"
            tick={{ fill: '#4a4a5a', fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#22c55e' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
