/**
 * AuthContext — React context that manages admin authentication state.
 *
 * Provides:
 *   user    — { id, username, displayName, role } or null
 *   token   — JWT string or null
 *   login(username, password) — calls POST /api/auth/login, stores token
 *   logout()                  — clears token and user from state + localStorage
 *   isAuthenticated           — boolean shorthand
 *
 * On mount, reads token from localStorage and verifies it hasn't expired
 * (client-side decode — no network call needed).
 *
 * Listens to the 'angaar_auth_expired' event dispatched by axiosInstance
 * to react to 401 responses automatically.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../api/axiosInstance";

const AuthContext = createContext(null);

// ── Helpers ───────────────────────────────────────────────────────────────────
const decodeJWT = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  const payload = decodeJWT(token);
  if (!payload) return false;
  // exp is in seconds; Date.now() is in ms
  return payload.exp * 1000 > Date.now();
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // checking localStorage on mount

  // On mount — restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("angaar_admin_token");
    const storedUser  = localStorage.getItem("angaar_admin_user");

    if (storedToken && isTokenValid(storedToken) && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Listen for 401 auto-logout from axiosInstance
  useEffect(() => {
    const handleExpired = () => logout();
    window.addEventListener("angaar_auth_expired", handleExpired);
    return () => window.removeEventListener("angaar_auth_expired", handleExpired);
  }, []);

  const login = useCallback(async (username, password) => {
    const response = await api.post("/api/auth/login", { username, password });
    const { token: newToken, user: newUser } = response.data.data;

    // Persist to localStorage
    localStorage.setItem("angaar_admin_token", newToken);
    localStorage.setItem("angaar_admin_user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    return newUser; // Caller can use the returned user if needed
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("angaar_admin_token");
    localStorage.removeItem("angaar_admin_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
