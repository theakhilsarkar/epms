'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { roleService } from '@/services/roleService';
import { reportService } from '@/services/reportService';

interface Field {
  label: string;
  type: 'text' | 'number' | 'date';
  target?: number;
}

export default function EmployeeReportsPage() {
  const { user } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Current ISO week
  const getCurrentWeek = () => {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const weekNo = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    return `${year}-W${String(weekNo).padStart(2, '0')}`;
  };

  const currentWeek = getCurrentWeek();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.role) return;
      try {
        const [rptRes, roleRes] = await Promise.all([
          reportService.getMyReports(),
          roleService.getRoleConfigByName(user.role),
        ]);
        if (rptRes?.success) setReports(rptRes.data);
        if (roleRes?.success) {
          setFields(roleRes.data.fields);
          const initial: Record<string, string> = {};
          roleRes.data.fields.forEach((f: Field) => { initial[f.label] = ''; });
          setFormData(initial);
        }
      } catch (_e) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role]);

  const alreadySubmittedThisWeek = reports.some((r) => r.week === currentWeek);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validate required fields
    for (const f of fields) {
      if (f.type !== 'text' && !formData[f.label]) {
        setError(`"${f.label}" is required.`);
        setSubmitting(false);
        return;
      }
    }

    const data: Record<string, string | number> = {};
    fields.forEach((f) => {
      data[f.label] = f.type === 'number' ? Number(formData[f.label]) : formData[f.label];
    });

    try {
      await reportService.submitReport({ week: currentWeek, data });
      setSuccess(`Report for ${currentWeek} submitted successfully!`);
      setShowForm(false);
      const rptRes = await reportService.getMyReports();
      if (rptRes?.success) setReports(rptRes.data);
    } catch (e: any) {
      setError(e.message || 'Submission failed. Reports can only be submitted on Fridays before 7 PM.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Weekly performance submissions.</p>
        </div>
        {!showForm && !alreadySubmittedThisWeek && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit This Week
          </button>
        )}
        {alreadySubmittedThisWeek && (
          <span className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {currentWeek} submitted
          </span>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex justify-between items-start">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex justify-between items-start">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="ml-4 text-green-400 hover:text-green-600">✕</button>
        </div>
      )}

      {/* Dynamic Report Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Weekly Report</h2>
              <p className="text-xs text-slate-400 mt-0.5">Week: {currentWeek}</p>
            </div>
            <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />)}
            </div>
          ) : fields.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              No fields configured for your role yet. Contact your admin.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {f.label}
                      {f.target && (
                        <span className="ml-2 text-xs text-slate-400 font-normal">Target: {f.target}</span>
                      )}
                    </label>
                    <input
                      type={f.type}
                      required={f.type !== 'text'}
                      value={formData[f.label] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.label]: e.target.value })}
                      placeholder={f.type === 'number' ? '0' : f.type === 'date' ? 'Select date' : 'Enter value'}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {/* Progress preview for number fields with target */}
                    {f.type === 'number' && f.target && formData[f.label] && (
                      <div className="mt-1.5">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>{((Number(formData[f.label]) / f.target) * 100).toFixed(0)}% of target</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min((Number(formData[f.label]) / f.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  {submitting ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(''); }}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Report History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Submission History</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">No reports yet. Submit your first report above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Week</th>
                  {fields.map((f) => (
                    <th key={f.label} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r: any) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-slate-800">{r.week}</td>
                    {fields.map((f) => (
                      <td key={f.label} className="px-6 py-3 text-sm text-slate-600">
                        {r.data?.[f.label] ?? '—'}
                      </td>
                    ))}
                    <td className="px-6 py-3">
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
