import React from "react";

function AdminTableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="admin-skeleton-table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="admin-skeleton-row">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <span key={`${rowIndex}-${columnIndex}`} className="admin-skeleton-cell" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default AdminTableSkeleton;
