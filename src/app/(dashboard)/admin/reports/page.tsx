'use client';

import { useEffect, useState } from 'react';
import { reportService } from '@/services/reportService';
import { roleService } from '@/services/roleService';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [filterWeek, setFilterWeek] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const [rptRes, roleRes] = await Promise.all([
          reportService.getAllReports(),
          roleService.getRoleConfigs(),
        ]);
        if (rptRes.success) setReports(rptRes.data);
        if (roleRes.success) setRoles(roleRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    init();
  }, []);

  const filtered = reports.filter((r) => {
    if (filterRole && r.role !== filterRole) return false;
    if (filterWeek && !r.week?.includes(filterWeek)) return false;
    return true;
  });

  const weeks = [...new Set(reports.map((r) => r.week))].sort().reverse();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Reports</h1>
          <p className="text-sm text-slate-500 mt-1">View and filter all employee submissions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            {roles.map((r) => <option key={r.roleName} value={r.roleName}>{r.roleName}</option>)}
          </select>
          <select
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Weeks</option>
            {weeks.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">
            Showing {filtered.length} of {reports.length} reports
          </h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No reports found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Week</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r: any) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {(r.userId?.name || '?').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{r.userId?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{r.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                        {r.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{r.week}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {Object.keys(r.data || {}).length} fields
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                        Submitted
                      </span>
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
