import React from "react";
import { MdMenu } from "react-icons/md";

function AdminTopbar({ session, onOpenSidebar }) {
  const displayName = session.name || session.email || "";
  const subtitle = session.email || "";

  const avatarLabel = displayName
    ? displayName.slice(0, 1).toUpperCase()
    : "A";

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-topbar-menu"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <MdMenu />
        </button>

        <div>
          <p className="admin-topbar-kicker">
            Daivajna Revankar Condiments
          </p>
        </div>
      </div>

      <div className="admin-topbar-profile">
        <div className="admin-topbar-avatar">
          {avatarLabel}
        </div>

        <div className="admin-topbar-profile-info">
          <strong>{displayName || "Admin"}</strong>
          <span>{subtitle}</span>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
