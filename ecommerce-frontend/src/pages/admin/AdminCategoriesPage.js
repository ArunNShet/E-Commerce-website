import React, { useEffect, useMemo, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../../components/admin/ConfirmModal";
import EmptyState from "../../components/admin/EmptyState";
import {
  getStoredCategories,
  saveStoredCategories
} from "../../lib/adminData";
import { showSuccessToast, showWarningToast } from "../../lib/toast";

const initialForm = { name: "", description: "", status: "Active" };

function AdminCategoriesPage() {
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    saveStoredCategories(categories);
    window.dispatchEvent(new Event("admin-categories-updated"));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = [];
    const others = [];

    categories.forEach((category) => {
      const name = String(category.name || "").toLowerCase();
      if (term && name.includes(term)) {
        matches.push(category);
      } else {
        others.push(category);
      }
    });

    return term ? [...matches, ...others] : [...others];
  }, [categories, search]);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (editingId) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingId ? { ...category, ...form } : category
        )
      );
      showSuccessToast("Category updated.");
    } else {
      setCategories((prev) => [{ id: Date.now(), ...form }, ...prev]);
      showSuccessToast("Category created.");
    }

    resetForm();
  };

  const onEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description,
      status: category.status
    });
    setModalOpen(true);
  };

  const onDelete = () => {
    if (!pendingDelete) {
      return;
    }
    setCategories((prev) => prev.filter((category) => category.id !== pendingDelete.id));
    setPendingDelete(null);
    showWarningToast("Category deleted.");
  };

  return (
    <section className="admin-page-stack">
      <div className="card admin-panel-card">
        <div className="admin-panel-header admin-panel-header-actions">
          <div>
            <h2>Category</h2>
          </div>
          <div className="admin-toolbar">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search categories"
            />
            <button type="button" className="admin-add-button" onClick={openAddModal}>
              <FiPlus />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <EmptyState title="No categories found" message="Create a category or try a different search." />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <span className={`admin-status-pill ${category.status === "Active" ? "is-success" : "is-muted"}`}>
                          {category.status}
                        </span>
                      </td>
                      <td>
                        <div className="row admin-table-actions">
                          <button
                            type="button"
                            className="secondary admin-icon-button"
                            onClick={() => onEdit(category)}
                            title="Edit category"
                            aria-label="Edit category"
                          >
                            <FiEdit />
                          </button>
                          <button
                            type="button"
                            className="danger admin-icon-button"
                            onClick={() => setPendingDelete(category)}
                            title="Delete category"
                            aria-label="Delete category"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" role="presentation" onClick={resetForm}>
          <div className="admin-modal admin-form-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="admin-panel-header">
              <div>
                <h2>{editingId ? "Update Category" : "Create Category"}</h2>
              </div>
            </div>
            <form className="admin-dashboard-form" onSubmit={onSubmit}>
              <label>
                Name
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <label className="admin-form-span-2">
                Description
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </label>
              <div className="row admin-form-actions admin-form-span-2">
                <button type="submit">{editingId ? "Update Category" : "Add Category"}</button>
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete category"
        description={`Delete "${pendingDelete?.name || ""}"?`}
        confirmLabel="Delete"
        onConfirm={onDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}

export default AdminCategoriesPage;
