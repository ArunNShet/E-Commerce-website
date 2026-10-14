import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import EmptyState from "../../components/admin/EmptyState";
import { getAdminCustomers } from "../../api/authApi";

function AdminCustomersPage() {
  const { session } = useOutletContext();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAdminCustomers(session.token)
      .then((data) => active && setCustomers(data || []))
      .catch((requestError) => active && setError(requestError.message || "Unable to load customers."))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [session.token]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? customers.filter((customer) =>
      `${customer.id} ${customer.name} ${customer.phone} ${customer.city} ${customer.role}`.toLowerCase().includes(term)
    ) : customers;
  }, [customers, search]);

  return (
    <section className="admin-page-stack">
      <div className="card admin-panel-card">
        <div className="admin-panel-header admin-panel-header-actions">
          <div><h2>Customer Listing</h2></div>
          <div className="admin-toolbar"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers" /></div>
        </div>

        {loading ? <p className="muted">Loading customers...</p> : null}
        {error ? <EmptyState title="Unable to load customers" message={error} /> : null}
        {!loading && !error && filteredCustomers.length === 0 ? <EmptyState title="No customers found" message="Registered customer records will appear here." /> : null}
        {!loading && !error && filteredCustomers.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>City</th><th>Role</th><th>Total Orders</th><th>Registered</th></tr></thead>
              <tbody>{filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td><td>{customer.name}</td><td>{customer.phone}</td><td>{customer.city || "-"}</td><td>{customer.role}</td><td>{customer.totalOrders}</td>
                  <td>{customer.registeredAt ? new Date(customer.registeredAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default AdminCustomersPage;
