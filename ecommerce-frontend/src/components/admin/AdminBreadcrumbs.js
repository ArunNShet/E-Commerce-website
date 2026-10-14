import React from "react";
import { Link, useLocation } from "react-router-dom";

const LABELS = {
  admin: "Admin",
  dashboard: "Dashboard",
  products: "Products",
  categories: "Categories",
  customers: "Customers",
  reviews: "Reviews",
  profile: "Profile",
  "change-password": "Change Password"
};

function AdminBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = LABELS[segment] || segment;

        return isLast ? (
          <span key={path}>{label}</span>
        ) : (
          <React.Fragment key={path}>
            <Link to={path}>{label}</Link>
            <span>/</span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default AdminBreadcrumbs;
