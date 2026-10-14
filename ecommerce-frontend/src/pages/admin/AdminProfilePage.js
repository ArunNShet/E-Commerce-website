import React from "react";
import { useOutletContext } from "react-router-dom";

function AdminProfilePage() {
  const { session } = useOutletContext();

  return (
    <section className="admin-page-stack">
      <div className="card admin-panel-card admin-profile-card">
        <div className="admin-panel-header">
          <div>
            <h2>Admin Account</h2>
          </div>
        </div>

        <div className="admin-profile-grid">
          <article className="admin-profile-field">
            <span>Name</span>
            <strong>{session.name || "-"}</strong>
          </article>
          <article className="admin-profile-field">
            <span>phone</span>
            <strong>{session.phone || "-"}</strong>
          </article>
          <article className="admin-profile-field">
            <span>Role</span>
            <strong>{session.role || "-"}</strong>
          </article>
          <article className="admin-profile-field">
            <span>Status</span>
            <strong>Active</strong>
          </article>
        </div>
      </div>
    </section>
  );
}

export default AdminProfilePage;
