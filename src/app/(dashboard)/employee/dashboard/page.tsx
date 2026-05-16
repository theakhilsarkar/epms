'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/reportService';
import { roleService } from '@/services/roleService';
import StatCard from '@/components/ui/StatCard';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [roleConfig, setRoleConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rptRes, roleRes] = await Promise.all([
          reportService.getMyReports(),
          user?.role ? roleService.getRoleConfigByName(user.role) : null,
        ]);
        if (rptRes?.success) setReports(rptRes.data);
        if (roleRes?.success) setRoleConfig(roleRes.data);
      } catch (_e) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role]);

  // Current week in ISO format
  const getCurrentWeek = () => {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const weekNo = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    return `${year}-W${String(weekNo).padStart(2, '0')}`;
  };

  const currentWeek = getCurrentWeek();
  const submittedThisWeek = reports.some((r) => r.week === currentWeek);

  // Compute avg score from reports (if role has targets)
  const avgScore = (() => {
    if (!roleConfig || reports.length === 0) return null;
    const fieldsWithTarget = roleConfig.fields.filter((f: any) => f.target);
    if (fieldsWithTarget.length === 0) return null;

    const scores = reports.map((report) => {
      const pcts = fieldsWithTarget.map((f: any) => {
        const val = Number(report.data?.[f.label] || 0);
        return (val / f.target) * 100;
      });
      return pcts.reduce((a: number, b: number) => a + b, 0) / pcts.length;
    });
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  })();

  const latestReport = reports[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s your performance summary for this week.
          </p>
        </div>
        <Link
          href="/employee/reports"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
            submittedThisWeek
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {submittedThisWeek ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              This week submitted
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Weekly Report
            </>
          )}
        </Link>
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
            title="My Role"
            value={user?.role?.replace(/_/g, ' ') || '—'}
            subtitle="Current designation"
            color="indigo"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <StatCard
            title="Reports Submitted"
            value={reports.length}
            subtitle="Total all-time"
            color="green"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatCard
            title="This Week"
            value={submittedThisWeek ? 'Submitted ✓' : 'Pending'}
            subtitle={currentWeek}
            color={submittedThisWeek ? 'green' : 'amber'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Avg Performance"
            value={avgScore ? `${avgScore}%` : 'N/A'}
            subtitle="Based on targets"
            color="rose"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
      )}

      {/* Role Config Fields Preview */}
      {roleConfig && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Your KPIs — <span className="capitalize text-indigo-600">{roleConfig.roleName}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {roleConfig.fields.map((f: any, i: number) => {
              const latestVal = latestReport?.data?.[f.label];
              const pct = f.target && latestVal ? Math.min((Number(latestVal) / f.target) * 100, 100).toFixed(0) : null;
              return (
                <div key={i} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-500 truncate">{f.label}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {latestVal ?? '—'}
                  </p>
                  {f.target && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Target: {f.target}</span>
                        <span>{pct ?? 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${pct ?? 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Recent Reports</h3>
          <Link href="/employee/reports" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">No reports submitted yet.</p>
            <Link href="/employee/reports" className="mt-2 inline-block text-sm text-indigo-600 font-medium hover:underline">
              Submit your first report →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.slice(0, 5).map((r: any) => (
              <div key={r._id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{r.week}</p>
                  <p className="text-xs text-slate-400">{Object.keys(r.data || {}).length} data points</p>
                </div>
                <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                  Submitted
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
