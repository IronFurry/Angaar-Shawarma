/**
 * LoginPage — Branded admin login screen.
 *
 * - Uses AuthContext.login() to authenticate.
 * - Shows a clear error message on bad credentials.
 * - On success, calls onSuccess() which renders the AdminDashboard.
 * - Styled to match the existing dark admin theme.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const ROLE_BADGE_COLORS = {
  owner: "#ff4500",
  manager: "#0891b2",
  staff: "#10b981",
};

const LoginPage = ({ onSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const user = await login(username.trim(), password);
      onSuccess(user);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Unable to connect to server. Is it running?";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-admin-theme="dark"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--admin-bg, #0f0f11)",
        padding: "24px",
        fontFamily: "'Inter', 'Outfit', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "48px",
              marginBottom: "10px",
              filter: "drop-shadow(0 0 20px rgba(255,69,0,0.5))",
            }}
          >
            🔥
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            Angaar Shawarma
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#71717a",
              marginTop: "4px",
            }}
          >
            Admin Panel — Secure Login
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--admin-card-bg, #18181b)",
            border: "1px solid var(--admin-border, #27272a)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a1a1aa",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Username
              </label>
              <input
                id="admin-login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "var(--admin-input-bg, #27272a)",
                  border: "1px solid var(--admin-border, #3f3f46)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ff4500")}
                onBlur={(e) => (e.target.style.borderColor = "var(--admin-border, #3f3f46)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a1a1aa",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="admin-login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 14px",
                    background: "var(--admin-input-bg, #27272a)",
                    border: "1px solid var(--admin-border, #3f3f46)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ff4500")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--admin-border, #3f3f46)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#71717a",
                    fontSize: "16px",
                    padding: "4px",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "#f87171",
                  fontSize: "13px",
                  marginBottom: "18px",
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading
                  ? "#3f3f46"
                  : "linear-gradient(135deg, #ff4500, #ff7a1a)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s, transform 0.1s",
                transform: loading ? "none" : undefined,
              }}
              onMouseEnter={(e) => !loading && (e.target.style.opacity = "0.9")}
              onMouseLeave={(e) => !loading && (e.target.style.opacity = "1")}
            >
              {loading ? "Signing in..." : "Sign In to Admin Panel"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: "12px", color: "#52525b", marginTop: "20px" }}>
          🔒 Access restricted to authorised personnel only
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
