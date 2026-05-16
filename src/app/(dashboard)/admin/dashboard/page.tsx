'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { branchService } from '@/services/branchService';
import { roleService } from '@/services/roleService';
import StatCard from '@/components/ui/StatCard';
import { PerformanceChart, TargetVsAchievementChart } from '@/components/ui/Charts';

export default function AdminDashboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any[]>([]);
  const [targets, setTargets] = useState<any[]>([]);

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedBy, setSelectedBy] = useState<'branch' | 'role'>('role');
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      try {
        const [branchRes, roleRes, lbRes] = await Promise.all([
          branchService.getBranches(),
          roleService.getRoleConfigs(),
          adminService.getLeaderboard(),
        ]);
        if (branchRes.success) setBranches(branchRes.data);
        if (roleRes.success) setRoles(roleRes.data);
        if (lbRes.success) setLeaderboard(lbRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch grouped + targets based on filters
  const fetchFiltered = useCallback(async () => {
    try {
      const groupedRes = await adminService.getGroupedPerformance(selectedBy);
      if (groupedRes.success) setGrouped(groupedRes.data);

      if (selectedRole) {
        const targetsRes = await adminService.getTargetVsAchievement(selectedRole);
        if (targetsRes.success) setTargets(targetsRes.data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedBy, selectedRole]);

  useEffect(() => {
    fetchFiltered();
  }, [fetchFiltered]);

  // Build chart-ready data
  const leaderboardChartData = leaderboard.slice(0, 8).map((u) => ({
    name: u.name?.split(' ')[0] || 'N/A',
    score: u.score,
  }));

  const groupedChartData = grouped.map((g) => {
    const dataValues = Object.values(g.data || {}).reduce(
      (sum: number, v) => sum + Number(v),
      0
    );
    return { name: g.name || 'Unknown', total: dataValues };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time employee performance overview.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedBy}
            onChange={(e) => setSelectedBy(e.target.value as 'branch' | 'role')}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="role">Group by Role</option>
            <option value="branch">Group by Branch</option>
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Role for Targets</option>
            {roles.map((r: any) => (
              <option key={r.roleName} value={r.roleName}>
                {r.roleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Employees"
            value={leaderboard.length}
            subtitle="Across all branches"
            color="indigo"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            title="Branches"
            value={branches.length}
            subtitle="Active locations"
            color="green"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <StatCard
            title="Avg. Performance"
            value={
              leaderboard.length > 0
                ? `${(leaderboard.reduce((s, u) => s + u.score, 0) / leaderboard.length).toFixed(1)}%`
                : 'N/A'
            }
            subtitle="Based on targets"
            color="amber"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <StatCard
            title="Top Performer"
            value={leaderboard[0]?.name?.split(' ')[0] || '—'}
            subtitle={leaderboard[0] ? `Score: ${leaderboard[0].score}%` : 'No data yet'}
            color="rose"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={leaderboardChartData}
          title="Top Employee Scores"
          dataKey="score"
          color="#4f46e5"
          type="bar"
        />
        <PerformanceChart
          data={groupedChartData}
          title={`Total Activity by ${selectedBy === 'branch' ? 'Branch' : 'Role'}`}
          dataKey="total"
          color="#10b981"
          type="bar"
        />
      </div>

      {/* Target vs Achievement */}
      {targets.length > 0 && (
        <TargetVsAchievementChart
          data={targets}
          title={`Target vs Achievement — ${selectedRole}`}
        />
      )}

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Employee Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reports</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                    No performance data yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((user, index) => (
                  <tr key={user.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-slate-100 text-slate-600' :
                        index === 2 ? 'bg-orange-100 text-orange-600' :
                        'bg-slate-50 text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                          {user.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.reportCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${Math.min(user.score, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{user.score}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
