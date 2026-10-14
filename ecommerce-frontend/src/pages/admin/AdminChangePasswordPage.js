import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { showSuccessToast } from "../../lib/toast";

function PasswordField({ label, value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      {label}
      <div className="input-with-icon input-with-overlay-icon">
        <input type={visible ? "text" : "password"} value={value} onChange={onChange} required />
        <button
          type="button"
          className="icon-button password-toggle-button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
        </button>
      </div>
    </label>
  );
}

function AdminChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const onSubmit = (event) => {
    event.preventDefault();
    showSuccessToast("Change password UI is ready. Backend integration can be added next.");
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <section className="admin-page-stack">
      <div className="card admin-panel-card admin-password-card">
        <div className="admin-panel-header">
          <div>
            <h2>Change Password</h2>
          </div>
        </div>

        <form className="admin-dashboard-form" onSubmit={onSubmit}>
          <PasswordField
            label="Current Password"
            value={form.currentPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
          />
          <PasswordField
            label="New Password"
            value={form.newPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
          />
          <PasswordField
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          />
          <div className="row admin-form-actions admin-form-span-2">
            <button type="submit">Update Password</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AdminChangePasswordPage;
