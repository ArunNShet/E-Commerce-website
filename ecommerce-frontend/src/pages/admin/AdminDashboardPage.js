import React, { useEffect, useMemo, useState } from "react";
import { listProducts } from "../../api/productsApi";
import { listCustomers } from "../../api/customersApi";
import AdminTableSkeleton from "../../components/admin/AdminTableSkeleton";
import EmptyState from "../../components/admin/EmptyState";
import { getStoredCategories } from "../../lib/adminData";

function AdminDashboardPage({ session }) {
  const [products, setProducts] = useState([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load products
        const productsData = await listProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);

        // Load categories
        setCategoriesCount(getStoredCategories().length);

        // Load customers from PostgreSQL
        if (session?.token) {
          const customersData = await listCustomers(session.token);

          setCustomersCount(
            Array.isArray(customersData) ? customersData.length : 0
          );
        } else {
          setCustomersCount(0);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setCustomersCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    const syncCategories = () => {
      setCategoriesCount(getStoredCategories().length);
    };

    window.addEventListener("storage", syncCategories);
    window.addEventListener("admin-categories-updated", syncCategories);

    return () => {
      window.removeEventListener("storage", syncCategories);
      window.removeEventListener(
        "admin-categories-updated",
        syncCategories
      );
    };
  }, [session?.token]);

  const stats = useMemo(
    () => [
      {
        label: "Total Products",
        value: products.length
      },
      {
        label: "Total Categories",
        value: categoriesCount
      },
      {
        label: "Total Customers",
        value: customersCount
      }
    ],
    [categoriesCount, customersCount, products.length]
  );

  return (
    <section className="admin-page-stack">
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="admin-stat-card">
            <span>{stat.label}</span>
            <strong>{loading ? "--" : stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <div className="card admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h2>Recent Inventory Snapshot</h2>
            </div>
          </div>

          {loading ? (
            <AdminTableSkeleton rows={4} columns={3} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products yet"
              message="Stored products will appear here once they are created."
            />
          ) : (
            <div className="admin-quick-list">
              {products.slice(0, 4).map((product) => (
                <article
                  key={product.id}
                  className="admin-quick-list-item"
                >
                  <strong>{product.name}</strong>

                  <span>{product.weight}</span>

                  <span>
                    {Number(product.stock) > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;