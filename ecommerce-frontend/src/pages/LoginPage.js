import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { setAuthSession } from "../lib/auth";
import { showErrorToast, showSuccessToast } from "../lib/toast";

function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ phone, password });
      const session = setAuthSession(data.accessToken, data.role, { phone });
      onLogin(session);
      showSuccessToast("Login successful.");
      navigate(data.role === "ADMIN" ? "/admin/dashboard" : "/");
    } catch (err) {
      showErrorToast(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={onSubmit} autoComplete="off">
        <label>
          Phone Number
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            title="Enter a phone number with 10 digits"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            autoComplete="tel"
            required
          />
        </label>
        <label>
          Password
          <div className="input-with-icon input-with-overlay-icon">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="icon-button password-toggle-button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
        </label>
        <p className="muted auth-switch-text">
          <Link to="/forgot-password" className="auth-switch-link">
            Forgot password?
          </Link>
        </p>
        <button type="submit" className="auth-submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="muted">
        New user? <a href="/register" style={{ color: "blue" }}>Register here</a>
      </p>
    </section>
  );
}

export default LoginPage;
