/**
 * Order API helpers
 *
 * Public functions (no auth): createOrder, getOrderById, getActiveOrders
 * Protected functions (require JWT in Authorization header):
 *   getOrders, updateOrderStatus, deleteOrder
 *
 * Admin calls use the shared axiosInstance (auto-attaches JWT from localStorage).
 * Staff calls pass a token explicitly from sessionStorage.
 */

import api from './axiosInstance';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/orders`;

// ── Helpers ───────────────────────────────────────────────────────────────────
// Build auth header from sessionStorage staff token OR localStorage admin token
const authHeaders = (staffToken) => {
  const token = staffToken || localStorage.getItem("angaar_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Public (customer-facing) ──────────────────────────────────────────────────
export const createOrder = async (order) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return await response.json();
};

export const getOrderById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
};

export const getActiveOrders = async () => {
  const response = await fetch(`${API_URL}/active`);
  return await response.json();
};

export const getBestsellers = async () => {
  const response = await fetch(`${API_URL}/bestsellers`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// ── Protected — admin panel (uses axiosInstance with auto-attached JWT) ────────
export const getOrdersAdmin = async () => {
  const res = await api.get(API_URL);
  return res.data;
};

export const updateOrderStatusAdmin = async (id, status) => {
  const res = await api.patch(`${API_URL}/${id}/status`, { status });
  return res.data;
};

export const deleteOrderAdmin = async (id) => {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
};

// ── Protected — staff panel (passes staff JWT from sessionStorage) ─────────────
export const getOrders = async (staffToken) => {
  const response = await fetch(API_URL, {
    headers: authHeaders(staffToken),
  });
  return await response.json();
};

export const updateOrderStatus = async (id, status, staffToken) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(staffToken) },
    body: JSON.stringify({ status }),
  });
  return await response.json();
};

export const deleteOrder = async (id, staffToken) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(staffToken),
  });
  return await response.json();
};