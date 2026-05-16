'use client';

import { useEffect, useState } from 'react';
import { roleService } from '@/services/roleService';

interface Field {
  label: string;
  type: 'text' | 'number' | 'date';
  target?: number | string;
}

interface RoleConfig {
  _id?: string;
  roleName: string;
  fields: Field[];
}

const emptyField = (): Field => ({ label: '', type: 'number', target: '' });

export default function AdminRolesPage() {
  const [configs, setConfigs] = useState<RoleConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [editingRole, setEditingRole] = useState<string | null>(null); // roleName being edited
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState<RoleConfig>({ roleName: '', fields: [emptyField()] });

  const fetchConfigs = async () => {
    try {
      const res = await roleService.getRoleConfigs();
      if (res.success) setConfigs(res.data);
    } catch (e: any) {
      setError(e.message || 'Failed to load role configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const resetForm = () => {
    setForm({ roleName: '', fields: [emptyField()] });
    setEditingRole(null);
    setShowCreateForm(false);
    setError('');
    setSuccess('');
  };

  const startEdit = (config: RoleConfig) => {
    setForm({
      roleName: config.roleName,
      fields: config.fields.map((f) => ({ ...f, target: f.target ?? '' })),
    });
    setEditingRole(config.roleName);
    setShowCreateForm(false);
  };

  // Field management
  const addField = () => setForm((f) => ({ ...f, fields: [...f.fields, emptyField()] }));

  const removeField = (idx: number) =>
    setForm((f) => ({ ...f, fields: f.fields.filter((_, i) => i !== idx) }));

  const updateField = (idx: number, key: keyof Field, value: string) =>
    setForm((f) => {
      const fields = [...f.fields];
      fields[idx] = { ...fields[idx], [key]: value } as Field;
      return { ...f, fields };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      roleName: form.roleName,
      fields: form.fields.map((f) => ({
        ...f,
        target: f.target !== '' ? Number(f.target) : undefined,
      })),
    };

    try {
      if (editingRole) {
        await roleService.updateRoleConfig(editingRole, payload);
        setSuccess(`Role "${editingRole}" updated successfully.`);
      } else {
        await roleService.createRoleConfig(payload);
        setSuccess(`Role "${payload.roleName}" created successfully.`);
      }
      resetForm();
      fetchConfigs();
    } catch (e: any) {
      setError(e.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roleName: string) => {
    if (!confirm(`Delete role config "${roleName}"? This cannot be undone.`)) return;
    try {
      await roleService.deleteRoleConfig(roleName);
      setConfigs((c) => c.filter((r) => r.roleName !== roleName));
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    }
  };

  const isFormVisible = showCreateForm || editingRole !== null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Role Configurations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Define dynamic fields and targets for each employee role.
          </p>
        </div>
        {!isFormVisible && (
          <button
            onClick={() => { setShowCreateForm(true); setEditingRole(null); setForm({ roleName: '', fields: [emptyField()] }); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Role
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600">✕</button>
        </div>
      )}

      {/* Create / Edit Form */}
      {isFormVisible && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5">
            {editingRole ? `Editing: ${editingRole}` : 'Create New Role'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Role Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                required
                disabled={!!editingRole}
                value={form.roleName}
                onChange={(e) => setForm({ ...form, roleName: e.target.value })}
                placeholder="e.g. tele_counselor"
                className="w-full sm:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            {/* Dynamic Fields */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-700">Fields</label>
                <button
                  type="button"
                  onClick={addField}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Field
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-3 px-1">
                  <span className="col-span-5 text-xs font-medium text-slate-500 uppercase tracking-wide">Label</span>
                  <span className="col-span-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Type</span>
                  <span className="col-span-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Target</span>
                </div>

                {form.fields.map((field, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-center bg-slate-50 rounded-lg px-3 py-2.5">
                    <input
                      type="text"
                      required
                      value={field.label}
                      onChange={(e) => updateField(idx, 'label', e.target.value)}
                      placeholder="e.g. Calls Made"
                      className="col-span-5 px-3 py-1.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => updateField(idx, 'type', e.target.value)}
                      className="col-span-3 px-3 py-1.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                    </select>
                    <input
                      type="number"
                      value={field.target}
                      onChange={(e) => updateField(idx, 'target', e.target.value)}
                      placeholder="—"
                      className="col-span-3 px-3 py-1.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      disabled={form.fields.length === 1}
                      className="col-span-1 flex justify-center text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
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
                {saving ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Configs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 h-40 animate-pulse" />
          ))}
        </div>
      ) : configs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-slate-300 mx-auto mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">No role configurations yet. Create one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs.map((config) => (
            <div
              key={config.roleName}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize">
                    {config.roleName}
                  </span>
                  <p className="text-xs text-slate-400 mt-1.5">
                    {config.fields.length} field{config.fields.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(config)}
                    className="text-xs text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(config.roleName)}
                    className="text-xs text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-300 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Fields Table */}
              <div className="overflow-hidden rounded-lg border border-slate-100">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-slate-500">Label</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-500">Type</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-500">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {config.fields.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-medium text-slate-800">{f.label}</td>
                        <td className="px-3 py-2 text-slate-500 capitalize">{f.type}</td>
                        <td className="px-3 py-2 text-slate-500">
                          {f.target != null && f.target !== '' ? (
                            <span className="font-semibold text-indigo-600">{f.target}</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
