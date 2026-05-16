'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { roleService } from '@/services/roleService';
import { PerformanceChart, TargetVsAchievementChart } from '@/components/ui/Charts';

export default function AdminAnalyticsPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [targets, setTargets] = useState<any[]>([]);
  const [branchData, setBranchData] = useState<any[]>([]);
  const [roleData, setRoleData] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [roleRes, branchRes, roleGrpRes, lbRes] = await Promise.all([
          roleService.getRoleConfigs(),
          adminService.getGroupedPerformance('branch'),
          adminService.getGroupedPerformance('role'),
          adminService.getLeaderboard(),
        ]);
        if (roleRes.success) {
          setRoles(roleRes.data);
          if (roleRes.data.length > 0) setSelectedRole(roleRes.data[0].roleName);
        }
        if (branchRes.success) setBranchData(branchRes.data);
        if (roleGrpRes.success) setRoleData(roleGrpRes.data);
        if (lbRes.success) setLeaderboard(lbRes.data);
      } catch (_e) { }
      finally { setLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchTargets = async () => {
      if (!selectedRole) return;
      try {
        const res = await adminService.getTargetVsAchievement(selectedRole);
        if (res.success) setTargets(res.data);
      } catch (_e) { }
    };
    fetchTargets();
  }, [selectedRole]);

  const branchChartData = branchData.map((b) => ({
    name: b.name || 'Unknown',
    total: Object.values(b.data || {}).reduce((s: number, v) => s + Number(v), 0),
  }));
  const roleChartData = roleData.map((r) => ({
    name: r.name || 'Unknown',
    total: Object.values(r.data || {}).reduce((s: number, v) => s + Number(v), 0),
  }));
  const leaderboardChartData = leaderboard.slice(0, 10).map((u) => ({
    name: u.name?.split(' ')[0] || 'N/A',
    score: u.score,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Performance insights across branches and roles.</p>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select role for targets</option>
          {roles.map((r) => <option key={r.roleName} value={r.roleName}>{r.roleName}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-72 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart data={branchChartData} title="Total Activity by Branch" dataKey="total" color="#4f46e5" type="bar" />
            <PerformanceChart data={roleChartData} title="Total Activity by Role" dataKey="total" color="#10b981" type="bar" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart data={leaderboardChartData} title="Top Employee Scores" dataKey="score" color="#f59e0b" type="bar" />
            {targets.length > 0 ? (
              <TargetVsAchievementChart data={targets} title={`Target vs Achievement — ${selectedRole}`} />
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-center">
                <p className="text-sm text-slate-400">{selectedRole ? 'No data yet.' : 'Select a role to view targets.'}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
