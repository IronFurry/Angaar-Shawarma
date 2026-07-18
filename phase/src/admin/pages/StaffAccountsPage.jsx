/**
 * Staff Accounts Page — Admin panel section.
 *
 * Lets owners/managers:
 * - View all staff accounts (one per branch)
 * - Change a staff account's password
 * - Delete a staff account
 * - Create a new staff account for a branch
 *
 * Uses the shared axiosInstance so the JWT is attached automatically.
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosInstance';

const BRANCHES = [
  'Vasai Gaon Outlet (Main Branch)',
  'Vasai West Outlet (Angaar Shawarma 2.0)',
  'Nallasopara Outlet',
  'Virar Outlet',
];

const BRANCH_SHORT = {
  'Vasai Gaon Outlet (Main Branch)':           'Vasai Gaon',
  'Vasai West Outlet (Angaar Shawarma 2.0)':   'Vasai West',
  'Nallasopara Outlet':                        'Nallasopara',
  'Virar Outlet':                              'Virar',
};

// ── Sub-components ────────────────────────────────────────────────────────────

const PasswordModal = ({ user, onClose, onSave, toast }) => {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pw.length < 4) { setErr('Min 4 characters.'); return; }
    if (pw !== confirm) { setErr('Passwords do not match.'); return; }
    setSaving(true);
    try {
      await api.patch(`/api/users/${user._id}/password`, { newPassword: pw });
      toast?.('Password updated ✓', 'success');
      onClose();
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={OVERLAY_STYLE} onClick={onClose}>
      <div style={MODAL_STYLE} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Change Password
        </div>
        <div style={{ fontSize: 13, color: '#71717a', marginBottom: 20 }}>
          {BRANCH_SHORT[user.branch] || user.branch}
        </div>

        <form onSubmit={handleSubmit}>
          <InputField label="New Password" type="password" value={pw} onChange={setPw} placeholder="Min 4 characters" />
          <InputField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" />

          {err && <p style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>⚠️ {err}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={BTN_SECONDARY}>Cancel</button>
            <button type="submit" disabled={saving} style={BTN_PRIMARY}>
              {saving ? 'Saving…' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateModal = ({ existingBranches, onClose, onCreated, toast }) => {
  const [branch, setBranch] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const available = BRANCHES.filter(b => !existingBranches.includes(b));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branch) { setErr('Select a branch.'); return; }
    if (pw.length < 4) { setErr('Min 4 characters.'); return; }
    if (pw !== confirm) { setErr('Passwords do not match.'); return; }
    setSaving(true);
    try {
      await api.post('/api/users/staff', { branch, password: pw });
      toast?.('Staff account created ✓', 'success');
      onCreated();
      onClose();
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={OVERLAY_STYLE} onClick={onClose}>
      <div style={MODAL_STYLE} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
          Add Staff Account
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL_STYLE}>Branch</label>
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
              style={INPUT_STYLE}
            >
              <option value="">— Select branch —</option>
              {available.map(b => (
                <option key={b} value={b}>{BRANCH_SHORT[b] || b}</option>
              ))}
            </select>
            {available.length === 0 && (
              <p style={{ color: '#71717a', fontSize: 12, marginTop: 6 }}>All branches already have staff accounts.</p>
            )}
          </div>
          <InputField label="Password" type="password" value={pw} onChange={setPw} placeholder="Min 4 characters" />
          <InputField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" />

          {err && <p style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>⚠️ {err}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={BTN_SECONDARY}>Cancel</button>
            <button type="submit" disabled={saving || available.length === 0} style={BTN_PRIMARY}>
              {saving ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Shared styled helpers ─────────────────────────────────────────────────────

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={LABEL_STYLE}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={INPUT_STYLE}
    />
  </div>
);

const OVERLAY_STYLE = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, backdropFilter: 'blur(4px)',
};
const MODAL_STYLE = {
  background: 'var(--admin-card-bg, #18181b)',
  border: '1px solid var(--admin-border, #27272a)',
  borderRadius: 14, padding: '28px 28px 24px',
  width: '100%', maxWidth: 400,
  boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
};
const LABEL_STYLE = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: '#a1a1aa', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const INPUT_STYLE = {
  width: '100%', padding: '10px 12px',
  background: 'var(--admin-input-bg, #27272a)',
  border: '1px solid var(--admin-border, #3f3f46)',
  borderRadius: 8, color: '#fff', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};
const BTN_PRIMARY = {
  flex: 1, padding: '10px 0',
  background: 'linear-gradient(135deg, #ff4500, #ff7a1a)',
  border: 'none', borderRadius: 8,
  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
};
const BTN_SECONDARY = {
  flex: 1, padding: '10px 0',
  background: 'var(--admin-input-bg, #27272a)',
  border: '1px solid var(--admin-border, #3f3f46)',
  borderRadius: 8, color: '#a1a1aa', fontSize: 13, cursor: 'pointer',
};
const BTN_DANGER = {
  padding: '7px 12px',
  background: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.2)',
  borderRadius: 7, color: '#f87171', fontSize: 12, cursor: 'pointer',
};
const BTN_EDIT = {
  padding: '7px 12px',
  background: 'rgba(255,69,0,0.1)',
  border: '1px solid rgba(255,69,0,0.2)',
  borderRadius: 7, color: '#ff7a1a', fontSize: 12, cursor: 'pointer',
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const StaffAccountsPage = ({ toast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/users/staff');
      setUsers(res.data.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load staff accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete staff account for "${BRANCH_SHORT[user.branch] || user.branch}"?`)) return;
    try {
      await api.delete(`/api/users/${user._id}`);
      toast?.('Account deleted', 'info');
      setUsers(prev => prev.filter(u => u._id !== user._id));
    } catch (e) {
      toast?.(e.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const existingBranches = users.map(u => u.branch);

  // Branches that still need a staff account
  const missingBranches = BRANCHES.filter(b => !existingBranches.includes(b));

  return (
    <div className="admin-page-container" style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Authentication
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--admin-text)', margin: 0 }}>
            Staff Accounts
          </h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 6, marginBottom: 0 }}>
            Each branch has one staff account. Staff use the branch name + password to access the kitchen dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{ ...BTN_PRIMARY, flex: 'none', padding: '10px 18px', whiteSpace: 'nowrap' }}
        >
          + Add Account
        </button>
      </div>

      {/* Missing branch notice */}
      {missingBranches.length > 0 && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 13, color: '#fbbf24' }}>
            No staff account for: {missingBranches.map(b => BRANCH_SHORT[b]).join(', ')}. Staff at these branches cannot log in.
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 72, borderRadius: 10, background: 'var(--admin-card-bg)', border: '1px solid var(--admin-border)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 16, color: '#f87171', fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Staff account cards */}
      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--admin-text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
              <p>No staff accounts yet. Click <strong>+ Add Account</strong> to create one.</p>
            </div>
          ) : (
            users.map(user => (
              <div
                key={user._id}
                className="staff-account-card"
                style={{
                  background: 'var(--admin-card-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}
              >
                {/* Branch icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(255,69,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  🏪
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--admin-text)', fontSize: 14 }}>
                    {BRANCH_SHORT[user.branch] || user.branch}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                    {user.branch}
                  </div>
                </div>

                {/* Status badge */}
                <span style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(16,185,129,0.12)', color: '#10b981',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  Active
                </span>

                {/* Actions */}
                <div className="staff-card-actions" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    style={BTN_EDIT}
                    onClick={() => setEditTarget(user)}
                    title="Change password"
                  >
                    🔑 <span className="staff-pwd-label">Change Password</span>
                  </button>
                  <button
                    style={BTN_DANGER}
                    onClick={() => handleDelete(user)}
                    title="Delete account"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* How to access info box */}
      <div style={{
        marginTop: 28,
        background: 'rgba(8,145,178,0.06)',
        border: '1px solid rgba(8,145,178,0.15)',
        borderRadius: 10, padding: '14px 18px',
      }}>
        <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: 13, marginBottom: 8 }}>
          ℹ️ How staff log in
        </div>
        <ol style={{ color: 'var(--admin-text-muted)', fontSize: 12, margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Staff go to the customer site and press <code style={{ background: '#27272a', padding: '1px 5px', borderRadius: 4 }}>Ctrl+Shift+Alt+S</code></li>
          <li>They select their branch from the dropdown</li>
          <li>They enter the branch password set here</li>
          <li>The kitchen dashboard opens — orders auto-refresh every minute</li>
        </ol>
      </div>

      {/* Modals */}
      {editTarget && (
        <PasswordModal
          user={editTarget}
          onClose={() => setEditTarget(null)}
          toast={toast}
        />
      )}
      {showCreate && (
        <CreateModal
          existingBranches={existingBranches}
          onClose={() => setShowCreate(false)}
          onCreated={fetchUsers}
          toast={toast}
        />
      )}
    </div>
  );
};

export default StaffAccountsPage;
