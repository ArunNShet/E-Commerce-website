import React, { useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearAuthSession } from "../../lib/auth";
import { showSuccessToast } from "../../lib/toast";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminMobileNav from "./AdminMobileNav";
import AdminBreadcrumbs from "./AdminBreadcrumbs";

const PAGE_TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products Management",
  "/admin/categories": "Categories Management",
  "/admin/customers": "Customers",
  "/admin/reviews": "Reviews",
  "/admin/profile": "Profile",
  "/admin/change-password": "Change Password"
};

function AdminLayout({ session, onSessionChange }) {
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isAdmin = session.role === "ADMIN";

  const title = useMemo(
    () => PAGE_TITLES[location.pathname] || "Admin",
    [location.pathname]
  );

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    setMobileSidebarOpen(false);

    clearAuthSession();

    onSessionChange({
      token: "",
      role: "",
      phone: "",
      name: ""
    });

    showSuccessToast("Logged out successfully.");
  };

  const handleOpenMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="admin-shell">
      {/* Desktop Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={false}
        onClose={() => {}}
        onToggle={() =>
          setSidebarCollapsed((current) => !current)
        }
        onLogout={handleLogout}
      />

      <div
        className={`admin-shell-main ${
          sidebarCollapsed ? "is-expanded" : ""
        }`}
      >
        {/* Topbar */}
        <AdminTopbar
  title={title}
  session={session}
  onOpenSidebar={() => setMobileSidebarOpen(true)}
/>

<AdminMobileNav
  isOpen={mobileSidebarOpen}
  onClose={() => setMobileSidebarOpen(false)}
  onLogout={handleLogout}
/>

        {/* Page Content */}
        <div className="admin-shell-content">
          <AdminBreadcrumbs />

          <Outlet
            context={{
              session,
              onLogout: handleLogout
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
