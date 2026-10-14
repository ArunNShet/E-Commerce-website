import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdInventory2,
  MdCategory,
  MdPeopleAlt,
  MdRateReview,
  MdPerson,
  MdLockReset,
  MdLogout,
  MdClose,
} from "react-icons/md";

const MOBILE_MENU_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { to: "/admin/products", label: "Products", icon: <MdInventory2 /> },
  { to: "/admin/categories", label: "Categories", icon: <MdCategory /> },
  { to: "/admin/customers", label: "Customers", icon: <MdPeopleAlt /> },
  { to: "/admin/reviews", label: "Reviews", icon: <MdRateReview /> },
  { to: "/admin/profile", label: "Profile", icon: <MdPerson /> },
  { to: "/admin/change-password", label: "Password", icon: <MdLockReset /> },
];

function AdminMobileNav({ isOpen, onClose, onLogout }) {
  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <>
      {isOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-mobile-sidebar ${
          isOpen ? "is-open" : ""
        }`}
        aria-label="Admin mobile navigation"
      >
        <div className="admin-mobile-sidebar-header">
          <strong>Admin Menu</strong>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <MdClose />
          </button>
        </div>

        <nav className="admin-mobile-sidebar-menu">
          {MOBILE_MENU_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `admin-mobile-sidebar-link ${
                  isActive ? "is-active" : ""
                }`
              }
            >
              <span className="admin-mobile-sidebar-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}

          <button
            type="button"
            className="admin-mobile-sidebar-link admin-mobile-logout"
            onClick={handleLogout}
          >
            <span className="admin-mobile-sidebar-icon">
              <MdLogout />
            </span>

            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

export default AdminMobileNav;