'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';

type SortKey = 'score' | 'name' | 'reportCount';

interface SortIconProps {
  k: SortKey;
  sortKey: SortKey;
  sortAsc: boolean;
}

const SortIcon = ({ k, sortKey, sortAsc }: SortIconProps) => (
  <span className="ml-1 text-slate-400">
    {sortKey === k ? (sortAsc ? '↑' : '↓') : '↕'}
  </span>
);

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    adminService.getLeaderboard()
      .then((res) => { if (res.success) setLeaderboard(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const sorted = [...leaderboard].sort((a, b) => {
    const va = a[sortKey] ?? 0;
    const vb = b[sortKey] ?? 0;
    if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortAsc ? va - vb : vb - va;
  });

  const medalColor = (i: number) =>
    i === 0 ? 'bg-amber-100 text-amber-700 ring-amber-200'
    : i === 1 ? 'bg-slate-100 text-slate-600 ring-slate-200'
    : i === 2 ? 'bg-orange-100 text-orange-600 ring-orange-200'
    : 'bg-slate-50 text-slate-400 ring-slate-100';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leaderboard</h1>
        <p className="text-sm text-slate-500 mt-1">Employee performance rankings based on target achievement.</p>
      </div>

      {/* Top 3 podium */}
      {!loading && sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[sorted[1], sorted[0], sorted[2]].map((u, i) => {
            const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
            return (
              <div
                key={u.userId}
                className={`bg-white rounded-xl border shadow-sm p-4 text-center flex flex-col items-center gap-2 ${rank === 1 ? 'border-amber-200 shadow-amber-100' : 'border-slate-200'}`}
              >
                <div className={`h-12 w-12 rounded-full ring-2 flex items-center justify-center font-bold text-lg ${medalColor(rank - 1)}`}>
                  {u.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{u.role}</p>
                </div>
                <div className={`text-2xl font-black ${rank === 1 ? 'text-amber-500' : 'text-slate-600'}`}>
                  #{rank}
                </div>
                <span className="text-sm font-bold text-indigo-600">{u.score}%</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Full Rankings</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">No performance data yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rank</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer select-none hover:text-slate-800"
                    onClick={() => handleSort('name')}
                  >
                    Employee <SortIcon k="name" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer select-none hover:text-slate-800"
                    onClick={() => handleSort('reportCount')}
                  >
                    Reports <SortIcon k="reportCount" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase cursor-pointer select-none hover:text-slate-800"
                    onClick={() => handleSort('score')}
                  >
                    Score <SortIcon k="score" sortKey={sortKey} sortAsc={sortAsc} />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((user, index) => (
                  <tr key={user.userId} className={`hover:bg-slate-50 transition-colors ${index < 3 ? 'font-medium' : ''}`}>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ring-1 ${medalColor(index)}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {user.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.reportCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${index === 0 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                            style={{ width: `${Math.min(user.score, 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${index === 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                          {user.score}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
