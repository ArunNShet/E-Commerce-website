import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { showErrorToast, showSuccessToast } from "../lib/toast";

function ForgotPasswordPage() {
  const [form, setForm] = useState({ phone: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showErrorToast("New password and confirm password must match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ phone: form.phone, newPassword: form.newPassword });
      showSuccessToast("Password changed successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h2>Forgot Password</h2>
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Phone Number
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            title="Enter a phone number with 7 to 15 digits"
            value={form.phone}
            onChange={(event) => onChange("phone", event.target.value.replace(/\D/g, ""))}
            autoComplete="tel"
            required
          />
        </label>
        <label>
          New Password
          <div className="input-with-icon input-with-overlay-icon">
            <input
              type={showPassword ? "text" : "password"}
              value={form.newPassword}
              onChange={(event) => onChange("newPassword", event.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
            />
            <button type="button" className="icon-button password-toggle-button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
        </label>
        <label>
          Confirm New Password
          <div className="input-with-icon input-with-overlay-icon">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(event) => onChange("confirmPassword", event.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
            />
            <button type="button" className="icon-button password-toggle-button" onClick={() => setShowConfirmPassword((current) => !current)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
              {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
        </label>
        <button type="submit" className="auth-submit-button" disabled={loading}>
          {loading ? "Changing password..." : "Change Password"}
        </button>
      </form>
      <p className="muted auth-switch-text">
        <Link to="/login" className="auth-switch-link">Back to login</Link>
      </p>
    </section>
  );
}

export default ForgotPasswordPage;
