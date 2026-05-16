'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface PerformanceChartProps {
  data: any[];
  title: string;
  type?: 'bar' | 'line';
  dataKey?: string;
  color?: string;
}

export function PerformanceChart({
  data,
  title,
  type = 'bar',
  dataKey = 'score',
  color = '#4f46e5',
}: PerformanceChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
            />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

interface TargetChartProps {
  data: { metric: string; target: number; achievement: number; percentage: number | null }[];
  title: string;
}

export function TargetVsAchievementChart({ data, title }: TargetChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
          />
          <Legend />
          <Bar dataKey="target" fill="#c7d2fe" radius={[4, 4, 0, 0]} name="Target" />
          <Bar dataKey="achievement" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Achievement" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
