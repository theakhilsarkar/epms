'use client';

import { useEffect, useState } from 'react';
import { employeeService } from '@/services/employeeService';
import { branchService } from '@/services/branchService';
import { roleService } from '@/services/roleService';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    branchId: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getEmployees();
      if (res.success) setEmployees(res.data);
    } catch (e: any) {
      setError(e.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await branchService.getBranches();
      if (res.success) setBranches(res.data);
    } catch (e: any) {
      setError(e.message || 'Failed to load branches');
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await roleService.getRoleConfigs();
      if (res.success) setRoles(res.data);
    } catch (e: any) {
      setError(e.message || 'Failed to load roles');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees();
    fetchBranches();
    fetchRoles();
  }, []);

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: '', branchId: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const startEdit = (employee: any) => {
    setForm({
      name: employee.name,
      email: employee.email,
      password: '',
      role: employee.role,
      branchId: employee.branchId
    });
    setEditingId(employee._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await employeeService.updateEmployee(editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
          branchId: form.branchId
        });
        setSuccess('Employee updated successfully.');
      } else {
        await employeeService.createEmployee(form);
        setSuccess('Employee created successfully.');
      }
      resetForm();
      fetchEmployees();
    } catch (e: any) {
      setError(e.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete employee "${name}"?`)) return;
    try {
      await employeeService.deleteEmployee(id);
      setEmployees((e) => e.filter((emp) => emp._id !== id));
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your company&apos;s employees.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', email: '', password: '', role: '', branchId: '' }); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}>✕</button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5">
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select a role</option>
                  {roles.map((r) => (
                    <option key={r.roleName} value={r.roleName}>
                      {r.roleName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                <select
                  required
                  value={form.branchId}
                  onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select a branch</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} - {b.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {saving ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-slate-600 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employees Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />)}
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-slate-500">No employees yet. Add your first employee above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <div key={employee._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{employee.name}</p>
                    <p className="text-xs text-slate-500">{employee.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-medium text-slate-700 capitalize">{employee.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch:</span>
                  <span className="font-medium text-slate-700">
                    {branches.find((b) => b._id === employee.branchId)?.name || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => startEdit(employee)}
                  className="flex-1 text-xs text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 py-1.5 rounded-md transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee._id, employee.name)}
                  className="flex-1 text-xs text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-300 py-1.5 rounded-md transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
