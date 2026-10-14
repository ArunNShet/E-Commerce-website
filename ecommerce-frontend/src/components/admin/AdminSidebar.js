import React from "react";
import { NavLink } from "react-router-dom";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdPeopleAlt,
  MdPerson,
  MdLockReset,
  MdLogout,
  MdRateReview
} from "react-icons/md";

const MENU_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { to: "/admin/products", label: "Products", icon: <MdInventory2 /> },
  { to: "/admin/categories", label: "Categories", icon: <MdCategory /> },
  { to: "/admin/customers", label: "Customers", icon: <MdPeopleAlt /> },
  { to: "/admin/reviews", label: "Reviews", icon: <MdRateReview /> },
  { to: "/admin/profile", label: "Profile", icon: <MdPerson /> },
  { to: "/admin/change-password", label: "Change Password", icon: <MdLockReset /> }
];

function AdminSidebar({ collapsed, mobileOpen, onClose, onToggle, onLogout }) {
  return (
    <>
      <div className={`admin-sidebar-backdrop ${mobileOpen ? "is-visible" : ""}`} onClick={onClose} />
      <aside className={`admin-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-copy">
            <div className="admin-sidebar-brand-text">
              {!collapsed && <strong>DRC Admin</strong>}
              {!collapsed && <span>Management Console</span>}
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-collapse"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <GoSidebarExpand /> : <GoSidebarCollapse />}
          </button>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin menu">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-sidebar-link ${isActive ? "is-active" : ""}`}
              onClick={onClose}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="admin-sidebar-link admin-sidebar-logout" onClick={onLogout}>
          <span className="admin-sidebar-icon"><MdLogout /></span>
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;
