/**
 * Reviews API helpers
 *
 * Public functions (no auth): getReviews, postReview
 * Protected admin functions (auto-attach JWT via axiosInstance):
 *   getAdminReviews — GET /api/reviews/admin  (all reviews including hidden)
 *   pinReview       — PATCH /:id/pin
 *   hideReview      — PATCH /:id/hide
 *   replyToReview   — PATCH /:id/reply
 *   deleteReview    — DELETE /:id
 */
import api from './axiosInstance';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/reviews`;

// ── Public ────────────────────────────────────────────────────────────────────
export const getReviews = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const postReview = async (review) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  return await response.json();
};

// ── Protected (admin — uses axiosInstance which auto-attaches JWT) ─────────────
export const getAdminReviews = async () => {
  const res = await api.get('/api/reviews/admin');
  return res.data;
};

export const pinReview = async (id) => {
  const res = await api.patch(`/api/reviews/${id}/pin`);
  return res.data;
};

export const hideReview = async (id) => {
  const res = await api.patch(`/api/reviews/${id}/hide`);
  return res.data;
};

export const replyToReview = async (id, reply) => {
  const res = await api.patch(`/api/reviews/${id}/reply`, { reply });
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/api/reviews/${id}`);
  return res.data;
};
