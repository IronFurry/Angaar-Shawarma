import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { USE_LIVE_DATA, REVIEWS as MOCK_REVIEWS } from '../mockData';
import {
  getAdminReviews as fetchReviewsAPI,
  pinReview as pinReviewAPI,
  hideReview as hideReviewAPI,
  replyToReview as replyToReviewAPI,
  deleteReview as deleteReviewAPI,
} from '../../api/reviewsApi';

const NOTE_COLORS = ['#fff4b8', '#ffd4b8', '#fec4d2', '#cbf1c4', '#d9e2ff', '#ffd6e8', '#ffe4e6', '#e0f2fe'];

const adaptFromDB = (r, i) => ({
  id: r._id || r.id,
  customer: r.name || r.customer,
  rating: r.rating,
  text: r.text,
  color: r.color || NOTE_COLORS[i % NOTE_COLORS.length],
  pinned: r.pinned || false,
  hidden: r.hidden || false,
  reply: r.reply || '',
  date: r.createdAt ? r.createdAt.slice(0, 10) : (r.date || ''),
  branch: r.branch || '—',
  fromDB: !!r._id,
});

const ReviewsPage = ({ toast }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (USE_LIVE_DATA) {
        try {
          const res = await fetchReviewsAPI();
          if (res.success && res.data) {
            setReviews(res.data.map((r, i) => adaptFromDB(r, i)));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Reviews API unavailable, using mock data', e);
        }
      }
      setReviews(MOCK_REVIEWS.map((r, i) => adaptFromDB(r, i)));
      setLoading(false);
    };
    load();
  }, []);

  const togglePin = async (id) => {
    const r = reviews.find(r => r.id === id);
    if (USE_LIVE_DATA && r?.fromDB) {
      try { await pinReviewAPI(id); } catch (_) { }
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, pinned: !r.pinned } : r));
    toast?.('Review pin updated', 'success');
  };

  const toggleHide = async (id) => {
    const r = reviews.find(r => r.id === id);
    if (USE_LIVE_DATA && r?.fromDB) {
      try { await hideReviewAPI(id); } catch (_) { }
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r));
    toast?.('Review visibility updated', 'info');
  };

  const handleDelete = async (id) => {
    const r = reviews.find(r => r.id === id);
    if (USE_LIVE_DATA && r?.fromDB) {
      try { await deleteReviewAPI(id); } catch (_) { }
    }
    setReviews(prev => prev.filter(r => r.id !== id));
    toast?.('Review deleted', 'info');
  };

  const visible = reviews.filter(r => !r.hidden);
  const hidden = reviews.filter(r => r.hidden);
  const pinned = visible.filter(r => r.pinned);
  const regular = visible.filter(r => !r.pinned);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const renderReview = (r, i) => (
    <motion.div
      key={r.id}
      className="admin-sticky-note"
      style={{ background: r.color || NOTE_COLORS[i % NOTE_COLORS.length], position: 'relative' }}
      initial={{ opacity: 0, y: 20, rotate: (i % 2 === 0 ? -1 : 1) }}
      animate={{ opacity: 1, y: 0, rotate: (i % 2 === 0 ? -0.5 : 0.5) }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      whileHover={{ rotate: 0, scale: 1.02, zIndex: 10 }}
    >
      {r.pinned && (
        <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 20 }}>📌</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e' }}>{r.customer}</span>
        <span style={{ fontSize: 12, whiteSpace: 'nowrap', display: 'inline-block' }}>{'🔥'.repeat(Math.round(r.rating))}</span>
      </div>

      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.55, margin: '0 0 8px' }}>{r.text}</p>

      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>
        {r.branch !== '—' && <>📍 {r.branch} · </>}📅 {r.date}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button
          className="admin-btn admin-btn-sm"
          style={{ background: 'rgba(255,255,255,0.6)', color: r.pinned ? '#ff6b35' : '#374151', border: '1px solid rgba(0,0,0,0.1)', fontSize: 11 }}
          onClick={() => togglePin(r.id)}
        >{r.pinned ? '📌 Unpin' : '📌 Pin'}</button>
        <button
          className="admin-btn admin-btn-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontSize: 11 }}
          onClick={() => toggleHide(r.id)}
        >🚫 Hide</button>
        <button
          className="admin-btn admin-btn-sm"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', fontSize: 11 }}
          onClick={() => handleDelete(r.id)}
        >🗑️ Delete</button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="admin-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ fontSize: 32, animation: 'spin 1s linear infinite' }}>🔥</div>
        <span style={{ marginLeft: 12, color: 'var(--admin-text-secondary)' }}>Loading reviews…</span>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-flex-between admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Reviews</h1>
          <p className="admin-page-subtitle">
            {USE_LIVE_DATA ? '🟢 Live data from database' : '🟡 Mock data — toggle USE_LIVE_DATA in mockData.js'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--admin-text-muted)' }}>
          <span>📌 {pinned.length} pinned</span>
          <span>👀 {visible.length} visible</span>
          <span>🚫 {hidden.length} hidden</span>
        </div>
      </div>

      {/* Average Rating Card */}
      <div className="admin-card admin-mb-24">
        <div className="admin-card-body" style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: 'var(--admin-primary)', lineHeight: 1 }}>{avgRating}</div>
            <div style={{ fontSize: 20 }}>🔥🔥🔥🔥🔥</div>
            <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>{reviews.length} reviews</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => Math.round(r.rating) === star).length;
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, width: 32, textAlign: 'right', minWidth: 100 }}>{'🔥'.repeat(star)}</span>
                  <div className="admin-progress-bar" style={{ flex: 1 }}>
                    <div className="admin-progress-fill" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', width: 20 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'var(--admin-text-secondary)' }}>📌 Featured Reviews</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
            {pinned.map((r, i) => renderReview(r, i))}
          </div>
        </>
      )}

      {/* All Reviews */}
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'var(--admin-text-secondary)' }}>
        All Reviews ({regular.length})
      </div>
      {regular.length === 0 && !loading && (
        <div className="admin-card" style={{ padding: 40, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          No reviews yet. Reviews posted on the frontend will appear here.
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {regular.map((r, i) => renderReview(r, i + pinned.length))}
      </div>

      {/* Hidden */}
      {hidden.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: 'var(--admin-text-muted)' }}>🚫 Hidden Reviews ({hidden.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {hidden.map(r => (
              <div key={r.id} style={{ background: 'var(--admin-input-bg)', border: '1px dashed var(--admin-border)', borderRadius: 12, padding: 16, opacity: 0.6 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.customer} · {r.rating}🔥</div>
                <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '6px 0' }}>{r.text.slice(0, 80)}…</div>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => toggleHide(r.id)}>Restore</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
