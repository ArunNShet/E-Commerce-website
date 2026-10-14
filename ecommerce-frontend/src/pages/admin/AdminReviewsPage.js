import React from "react";
import EmptyState from "../../components/admin/EmptyState";
import { INITIAL_REVIEWS } from "../../lib/adminData";

function AdminReviewsPage() {
  if (INITIAL_REVIEWS.length === 0) {
    return (
      <section className="admin-page-stack">
        <div className="card admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h2>Review Moderation</h2>
            </div>
          </div>
          <EmptyState title="No reviews found" message="Only stored reviews will appear here." />
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page-stack">
      <div className="card admin-panel-card">
        <div className="admin-panel-header">
          <div>
            <h2>Review Moderation</h2>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_REVIEWS.map((review) => (
                <tr key={review.id}>
                  <td>{review.product}</td>
                  <td>{review.customer}</td>
                  <td>{review.rating}/5</td>
                  <td>
                    <span className={`admin-status-pill ${review.status === "Published" ? "is-success" : review.status === "Flagged" ? "is-danger" : "is-muted"}`}>
                      {review.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminReviewsPage;
