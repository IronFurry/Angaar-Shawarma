import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TABS = ['Restaurant', 'Branches', 'Roles & Permissions', 'Taxes & Fees', 'Notifications', 'System & Backup'];

const SettingsPage = ({ toast }) => {
  const [activeTab, setActiveTab] = useState('Restaurant');
  const [settings, setSettings] = useState({
    name: 'Angaar Shawarma',
    tagline: 'Ember-grilled, authentic flavor',
    phone: '+91 98765 43210',
    email: 'hello@angaarshawarma.com',
    taxPercent: 5,
    deliveryFee: 49,
    freeDeliveryThreshold: 399,
    upiId: 'angaar@upi',
    codEnabled: true,
    cardEnabled: true,
    smsNotif: true,
    emailNotif: true,
    autoBackup: true,
  });

  const save = () => {
    toast('Settings saved successfully! ⚙️', 'success');
  };

  return (
    <div className="admin-page">
      <div className="admin-flex-between admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure restaurant details, roles, delivery fees, and system preferences.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save}>Save Settings</button>
      </div>

      {/* Tabs */}
      <div className="admin-settings-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`admin-settings-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="admin-card"
      >
        <div className="admin-card-body">
          {activeTab === 'Restaurant' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Restaurant Details</div>
              <div className="admin-form-group">
                <label className="admin-form-label">Brand Name</label>
                <input className="admin-input" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Tagline</label>
                <input className="admin-input" value={settings.tagline} onChange={e => setSettings({ ...settings, tagline: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Support Phone</label>
                  <input className="admin-input" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Contact Email</label>
                  <input className="admin-input" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Branches' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Active Outlets</div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>Outlet</th><th>Status</th><th>Type</th><th>Preparation Time</th><th>Capacity</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Vasai Gaon Outlet (Main Branch)', status: 'Open', type: 'Dine-in / Delivery', prep: '15 mins', cap: 'High' },
                      { name: 'Vasai West Outlet (Angaar 2.0)', status: 'Open', type: 'Dine-in / Delivery', prep: '18 mins', cap: 'Medium' },
                      { name: 'Nallasopara Outlet', status: 'Open', type: 'Takeaway / Delivery', prep: '20 mins', cap: 'Medium' },
                      { name: 'Virar Outlet', status: 'Open', type: 'Takeaway / Delivery', prep: '18 mins', cap: 'Low' },
                    ].map((b, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{b.name}</td>
                        <td><span className="admin-badge admin-badge-success">{b.status}</span></td>
                        <td className="muted">{b.type}</td>
                        <td className="muted">{b.prep}</td>
                        <td><span className={`admin-badge ${b.cap === 'High' ? 'admin-badge-primary' : 'admin-badge-purple'}`}>{b.cap}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Roles & Permissions' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>User Roles & Access Levels</div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>Role</th><th>Dashboard Access</th><th>Menu Editing</th><th>Orders Management</th><th>Settings Control</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { role: 'Super Admin', dash: 'Full', menu: 'Full', orders: 'Full', settings: 'Full' },
                      { role: 'Branch Manager', dash: 'Branch Only', menu: 'View Only', orders: 'Branch Only', settings: 'None' },
                      { role: 'Head Chef / Chef', dash: 'None', menu: 'None', orders: 'View & Advance', settings: 'None' },
                      { role: 'Delivery Executive', dash: 'None', menu: 'None', orders: 'Delivery Updates', settings: 'None' },
                    ].map((role, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{role.role}</td>
                        <td><span className="admin-badge admin-badge-primary">{role.dash}</span></td>
                        <td><span className={`admin-badge ${role.menu.includes('Full') ? 'admin-badge-success' : 'admin-badge-gray'}`}>{role.menu}</span></td>
                        <td><span className="admin-badge admin-badge-info">{role.orders}</span></td>
                        <td><span className={`admin-badge ${role.settings.includes('Full') ? 'admin-badge-danger' : 'admin-badge-gray'}`}>{role.settings}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Taxes & Fees' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Tax & Delivery Charges Configuration</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">GST / Tax rate (%)</label>
                  <input className="admin-input" type="number" value={settings.taxPercent} onChange={e => setSettings({ ...settings, taxPercent: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Standard Delivery Fee (₹)</label>
                  <input className="admin-input" type="number" value={settings.deliveryFee} onChange={e => setSettings({ ...settings, deliveryFee: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Free Delivery Threshold (₹)</label>
                <input className="admin-input" type="number" value={settings.freeDeliveryThreshold} onChange={e => setSettings({ ...settings, freeDeliveryThreshold: e.target.value })} />
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Notification Preferences</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="admin-flex-between">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>SMS Notifications</div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>Send order status updates to customer via SMS.</div>
                  </div>
                  <button className={`admin-toggle ${settings.smsNotif ? 'on' : ''}`} onClick={() => setSettings({ ...settings, smsNotif: !settings.smsNotif })} />
                </div>
                <div className="admin-divider" style={{ margin: 0 }} />
                <div className="admin-flex-between">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Email Notifications</div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>Send order confirmations and receipt via Email.</div>
                  </div>
                  <button className={`admin-toggle ${settings.emailNotif ? 'on' : ''}`} onClick={() => setSettings({ ...settings, emailNotif: !settings.emailNotif })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'System & Backup' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>System & Backups</div>
              <div className="admin-flex-between">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Automatic Daily Backups</div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>Back up menu items, order history, and CRM data every night.</div>
                </div>
                <button className={`admin-toggle ${settings.autoBackup ? 'on' : ''}`} onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })} />
              </div>
              <div className="admin-divider" />
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => toast('Backup starting...', 'info')}>Backup Database Now</button>
                <button className="admin-btn admin-btn-secondary" onClick={() => toast('Restore file uploaded', 'success')}>Restore from Backup</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
