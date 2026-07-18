import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData } from '../../utils/menuData';
import { USE_LIVE_DATA } from '../mockData';

// Flatten frontend menuData into a unified admin item list
const buildMenuItems = () => {
  const categoryMap = { shawarma: 'Shawarma', platter: 'Platters', salad: 'Salads', mocktail: 'Mocktails' };
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('angaar_menu_overrides') || '{}'); } catch { return {}; }
  })();
  return Object.entries(menuData).flatMap(([cat, items]) =>
    items.map(item => {
      const override = saved[item.id] || {};
      return {
        id: item.id,
        name: item.name,
        emoji: item.emoji || '🌯',
        category: categoryMap[cat] || cat,
        price: parseInt(String(item.price).replace(/[^\d]/g, '')) || 0,
        description: item.desc || '',
        image: item.img || '',
        available: override.available !== undefined ? override.available : true,
        bestSeller: override.bestSeller !== undefined ? override.bestSeller : (item.isBestseller || false),
        isNew: override.isNew !== undefined ? override.isNew : false,
        spicy: item.spicy || false,
        protein: item.protein || '',
        calories: item.calories || '',
      };
    })
  );
};

const CATEGORIES = ['All', 'Shawarma', 'Platters', 'Salads', 'Mocktails'];

const MenuPage = ({ toast }) => {
  const [items, setItems] = useState(buildMenuItems);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const persist = (updatedItems) => {
    const overrides = {};
    updatedItems.forEach(it => {
      overrides[it.id] = { available: it.available, bestSeller: it.bestSeller, isNew: it.isNew };
    });
    localStorage.setItem('angaar_menu_overrides', JSON.stringify(overrides));
  };

  const filtered = items.filter(item => {
    const matchCat = category === 'All' || item.category === category;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAvailable = (id) => {
    setItems(prev => {
      const updated = prev.map(it => it.id === id ? { ...it, available: !it.available } : it);
      persist(updated);
      return updated;
    });
    toast('Availability updated', 'success');
  };

  const toggleBestSeller = (id) => {
    setItems(prev => {
      const updated = prev.map(it => it.id === id ? { ...it, bestSeller: !it.bestSeller } : it);
      persist(updated);
      return updated;
    });
  };

  const openEdit = (item) => { setEditingItem({ ...item }); setShowModal(true); };
  const openAdd = () => {
    setEditingItem({ id: `m_${Date.now()}`, name: '', emoji: '🌯', category: 'Shawarma', price: '', description: '', available: true, bestSeller: false, isNew: true, spicy: false });
    setShowModal(true);
  };

  const saveItem = () => {
    if (!editingItem?.name || !editingItem?.price) { toast('Name and price required', 'error'); return; }
    setItems(prev => {
      const exists = prev.find(it => it.id === editingItem.id);
      const updated = exists
        ? prev.map(it => it.id === editingItem.id ? { ...editingItem, price: Number(editingItem.price) } : it)
        : [...prev, { ...editingItem, price: Number(editingItem.price) }];
      persist(updated);
      return updated;
    });
    toast(editingItem.id && items.find(i => i.id === editingItem.id) ? 'Item updated' : 'Item added', 'success');
    setShowModal(false);
  };

  const deleteItem = (id) => {
    setItems(prev => {
      const updated = prev.filter(it => it.id !== id);
      persist(updated);
      return updated;
    });
    toast('Menu item removed', 'success');
  };

  const catCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <div className="admin-flex-between admin-page-header">
        <div>
          <h1 className="admin-page-title">Menu Management</h1>
          <p className="admin-page-subtitle">
            {USE_LIVE_DATA
              ? `${items.length} items from the live frontend menu · Availability saved locally`
              : 'Viewing static menu items'}
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>+ Add Item</button>
      </div>

      {/* Category Tabs */}
      <div className="admin-filter-tabs admin-mb-16">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`admin-filter-tab ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat} <span style={{ opacity: 0.6, fontSize: 11, marginLeft: 4 }}>({catCounts[cat]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="admin-mb-16">
        <input
          className="admin-input"
          placeholder="🔍 Search menu items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 340 }}
        />
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Items', value: items.length, color: 'var(--admin-primary)' },
          { label: 'Available', value: items.filter(i => i.available).length, color: '#10b981' },
          { label: 'Unavailable', value: items.filter(i => !i.available).length, color: '#ef4444' },
          { label: 'Best Sellers', value: items.filter(i => i.bestSeller).length, color: '#f59e0b' },
          { label: 'Spicy 🌶️', value: items.filter(i => i.spicy).length, color: '#ff4500' },
        ].map(stat => (
          <div key={stat.label} className="admin-card" style={{ padding: '10px 20px', textAlign: 'center', minWidth: 110 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Menu Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              className="admin-card"
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              style={{ overflow: 'hidden' }}
            >
              {/* Image / Emoji header */}
              <div style={{
                height: 120,
                background: item.image
                  ? `url(${item.image}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #1f1a16, #2d2520)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                position: 'relative',
              }}>
                {!item.image && item.emoji}
                {/* Badges */}
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                  {item.bestSeller && <span style={{ background: '#ff6b35', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>⭐ BEST</span>}
                  {item.isNew && <span style={{ background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>NEW</span>}
                  {item.spicy && <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '2px 6px' }}>🌶️ HOT</span>}
                </div>
                {/* Available toggle */}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <button
                    onClick={() => toggleAvailable(item.id)}
                    style={{
                      background: item.available ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {item.available ? '✓ On' : '✗ Off'}
                  </button>
                </div>
              </div>

              <div className="admin-card-body" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>{item.category}</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--admin-primary)', whiteSpace: 'nowrap' }}>₹{item.price}</div>
                </div>

                {item.description && (
                  <p style={{ fontSize: 12, color: 'var(--admin-text-secondary)', margin: '6px 0 10px', lineHeight: 1.45 }}>
                    {item.description.slice(0, 72)}{item.description.length > 72 ? '…' : ''}
                  </p>
                )}

                {(item.calories || item.protein) && (
                  <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--admin-text-muted)', marginBottom: 10 }}>
                    {item.calories && <span>🔥 {item.calories}</span>}
                    {item.protein && <span>💪 {item.protein}</span>}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ flex: 1 }} onClick={() => openEdit(item)}>✏️ Edit</button>
                  <button
                    className="admin-btn admin-btn-sm"
                    onClick={() => toggleBestSeller(item.id)}
                    style={{ background: item.bestSeller ? 'rgba(245,158,11,0.2)' : 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', color: item.bestSeller ? '#f59e0b' : 'var(--admin-text-secondary)' }}
                  >⭐</button>
                  <button
                    className="admin-btn admin-btn-sm"
                    onClick={() => deleteItem(item.id)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
                  >🗑️</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="admin-card" style={{ padding: 48, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          No items found for "{search || category}"
        </div>
      )}

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {showModal && editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="admin-card"
              style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', margin: 16 }}
            >
              <div className="admin-card-header">
                <h3 className="admin-card-title">{items.find(i => i.id === editingItem.id) ? 'Edit Item' : 'Add New Item'}</h3>
              </div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Name', key: 'name', type: 'text', placeholder: 'e.g. Angaar Special Shawarma' },
                  { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '149' },
                  { label: 'Description', key: 'description', type: 'textarea', placeholder: 'Short description…' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 6 }}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="admin-input"
                        rows={2}
                        placeholder={field.placeholder}
                        value={editingItem[field.key] || ''}
                        onChange={e => setEditingItem(prev => ({ ...prev, [field.key]: e.target.value }))}
                        style={{ resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        className="admin-input"
                        type={field.type}
                        placeholder={field.placeholder}
                        value={editingItem[field.key] || ''}
                        onChange={e => setEditingItem(prev => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: 6 }}>Category</label>
                  <select
                    className="admin-input"
                    value={editingItem.category || 'Shawarma'}
                    onChange={e => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {['Shawarma', 'Platters', 'Salads', 'Mocktails'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { key: 'available', label: 'Available' },
                    { key: 'bestSeller', label: 'Best Seller' },
                    { key: 'isNew', label: 'New Item' },
                    { key: 'spicy', label: '🌶️ Spicy' },
                  ].map(toggle => (
                    <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!editingItem[toggle.key]}
                        onChange={e => setEditingItem(prev => ({ ...prev, [toggle.key]: e.target.checked }))}
                      />
                      {toggle.label}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="admin-btn admin-btn-primary" style={{ flex: 1 }} onClick={saveItem}>Save</button>
                  <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
