'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  color: 'indigo' | 'green' | 'amber' | 'rose';
}

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-600',
    text: 'text-indigo-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-600',
    text: 'text-green-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-500',
    text: 'text-amber-600',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-500',
    text: 'text-rose-600',
  },
};

export default function StatCard({ title, value, subtitle, trend, icon, color }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-start gap-4">
      <div className={`${colors.icon} p-3 rounded-lg text-white flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trend.positive ? 'text-green-600' : 'text-rose-600'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
