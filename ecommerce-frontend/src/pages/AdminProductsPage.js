import React, { useEffect, useMemo, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  uploadProductImage
} from "../api/productsApi";
import ProductImage from "../components/ProductImage";
import AdminTableSkeleton from "../components/admin/AdminTableSkeleton";
import ConfirmModal from "../components/admin/ConfirmModal";
import EmptyState from "../components/admin/EmptyState";
import { getActiveCategoryOptions, getStoredCategories } from "../lib/adminData";
import { formatCurrency } from "../lib/currency";
import { showErrorToast, showSuccessToast, showWarningToast } from "../lib/toast";

const initialForm = {
  name: "",
  weight: "",
  description: "",
  categoryName: "",
  price: "",
  stock: "0"
};

function normalizeCategory(product) {
  return product.categoryName || product.category?.name || "";
}

function AdminProductsPage({ authToken }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [storedCategories, setStoredCategories] = useState(() => getStoredCategories());

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await listProducts();
      setProducts(Array.isArray(data) ? data : []);
      setStoredCategories(getStoredCategories());
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const syncCategories = () => setStoredCategories(getStoredCategories());
    window.addEventListener("storage", syncCategories);
    window.addEventListener("admin-categories-updated", syncCategories);
    return () => {
      window.removeEventListener("storage", syncCategories);
      window.removeEventListener("admin-categories-updated", syncCategories);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const availableCategories = useMemo(() => {
    const combined = new Set(getActiveCategoryOptions(storedCategories));
    products.forEach((product) => {
      const categoryName = normalizeCategory(product);
      if (categoryName) {
        combined.add(categoryName);
      }
    });
    return Array.from(combined).sort((left, right) => left.localeCompare(right));
  }, [products, storedCategories]);

  const summary = useMemo(() => {
    const total = products.length;
    const categorized = products.filter((product) => normalizeCategory(product)).length;
    const uncategorized = total - categorized;
    return { total, categorized, uncategorized };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = [];
    const others = [];

    products.forEach((product) => {
      const name = String(product.name || "").toLowerCase();
      const categoryName = normalizeCategory(product);
      const passesCategory = categoryFilter === "all" || categoryName === categoryFilter;

      if (!passesCategory) {
        return;
      }

      if (term && name.includes(term)) {
        matches.push(product);
      } else {
        others.push(product);
      }
    });

    return term ? [...matches, ...others] : [...others];
  }, [products, search, categoryFilter]);

  const resetForm = () => {
    if (imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setEditingId(null);
    setForm(initialForm);
    setImageFile(null);
    setImagePreviewUrl("");
    setModalOpen(false);
  };

  const onFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onImageChange = (file) => {
    if (imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl("");
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const getFormPayload = (uploadedImageUrl) => ({
    name: form.name.trim(),
    weight: form.weight.trim(),
    description: form.description.trim(),
    categoryName: form.categoryName,
    imageUrl: uploadedImageUrl,
    price: Number(form.price),
    stock: Number(form.stock)
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      categoryName: availableCategories[0] || ""
    });
    setModalOpen(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      let uploadedImageUrl = editingId
        ? products.find((product) => product.id === editingId)?.imageUrl || ""
        : "";

      if (imageFile) {
        const uploadResponse = await uploadProductImage(imageFile, authToken);
        uploadedImageUrl = uploadResponse?.imageUrl || uploadedImageUrl;
      }

      if (editingId) {
        await updateProduct(editingId, getFormPayload(uploadedImageUrl), authToken);
        showSuccessToast("Product updated.");
      } else {
        await createProduct(getFormPayload(uploadedImageUrl), authToken);
        showSuccessToast("Product created.");
      }

      await loadProducts();
      resetForm();
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (product) => {
    if (imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setEditingId(product.id);
    setForm({
      name: product.name || "",
      weight: product.weight || "",
      description: product.description || "",
      categoryName: normalizeCategory(product),
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0)
    });
    setImageFile(null);
    setImagePreviewUrl("");
    setModalOpen(true);
  };

  const onDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    try {
      await deleteProduct(pendingDelete.id, authToken);
      showWarningToast("Product deleted.");
      setPendingDelete(null);
      await loadProducts();
    } catch (err) {
      showErrorToast(err.message);
    }
  };

  return (
    <section className="admin-page-stack">
      <div className="admin-stats-grid">
        <article className="admin-stat-card">
          <span>Total Products</span>
          <strong>{summary.total}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Categorized</span>
          <strong>{summary.categorized}</strong>
        </article>
        <article className="admin-stat-card">
          <span>Uncategorized</span>
          <strong>{summary.uncategorized}</strong>
        </article>
      </div>

      <div className="card admin-panel-card">
        <div className="admin-panel-header admin-panel-header-actions">
          <div>
            <h2>Products</h2>
          </div>
          <div className="admin-toolbar">
            <button type="button" className="admin-add-button" onClick={openAddModal}>
              <FiPlus />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="sticky-filter-shell sticky-filter-shell-admin">
          <div className="admin-search-block sticky-filter-bar sticky-filter-bar-admin">
            <div className="search-input-wrap">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search products"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
              }}
            >
              <option value="all">All categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <AdminTableSkeleton rows={6} columns={8} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState title="No products found" message="Try another search or create a new product." />
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table admin-products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Weight</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const isOutOfStock = Number(product.stock) <= 0;
                    const categoryName = normalizeCategory(product) || "Uncategorized";

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="admin-table-image">
                            <ProductImage imageUrl={product.imageUrl} productName={product.name} className="cart-item-image" />
                          </div>
                        </td>
                        <td>
                          <strong>{product.name}</strong>
                        </td>
                        <td>{categoryName}</td>
                        <td>{product.weight}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`admin-status-pill ${isOutOfStock ? "is-danger" : "is-success"}`}>
                            {isOutOfStock ? "Out of stock" : "Available"}
                          </span>
                        </td>
                        <td>
                          <div className="row admin-table-actions">
                            <button
                              type="button"
                              className="secondary admin-icon-button"
                              onClick={() => onEdit(product)}
                              title="Edit product"
                              aria-label="Edit product"
                            >
                              <FiEdit />
                            </button>
                            <button
                              type="button"
                              className="danger admin-icon-button"
                              onClick={() => setPendingDelete(product)}
                              title="Delete product"
                              aria-label="Delete product"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </>
        )}
      </div>

      {modalOpen && (
        <div className="admin-modal-backdrop" role="presentation" onClick={resetForm}>
          <div className="admin-modal admin-form-modal admin-product-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="admin-panel-header">
              <div>
                <h2>{editingId ? "Update Product" : "Create Product"}</h2>
              </div>
            </div>

            <form className="admin-products-form admin-dashboard-form" onSubmit={onSubmit}>
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(e) => onFormChange("name", e.target.value)}
                  required
                  maxLength={180}
                  placeholder="Enter product name"
                />
              </label>
              <label>
                Category
                <select
                  value={form.categoryName}
                  onChange={(e) => onFormChange("categoryName", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Weight
                <input
                  value={form.weight}
                  onChange={(e) => onFormChange("weight", e.target.value)}
                  required
                  maxLength={50}
                  placeholder="500g, 1kg"
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={(e) => onFormChange("price", e.target.value)}
                  required
                  placeholder="0.00"
                />
              </label>
              <label className="admin-form-span-2">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => onFormChange("description", e.target.value)}
                  rows={4}
                  maxLength={1500}
                  placeholder="Enter product description"
                />
              </label>
              <label className="admin-form-span-2">
                Upload File
                <div className="file-upload-row admin-upload-row">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageChange(e.target.files?.[0] || null)}
                  />
                  {imagePreviewUrl && (
                    <div className="admin-image-preview admin-image-preview-inline">
                      <ProductImage
                        imageUrl={imagePreviewUrl}
                        productName={form.name || "Product preview"}
                        className="admin-image-preview-media admin-image-preview-inline-media"
                      />
                    </div>
                  )}
                </div>
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => onFormChange("stock", e.target.value)}
                  required
                />
              </label>
              <div className="row admin-form-actions admin-form-span-2">
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
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
        title="Delete product"
        description={`Delete "${pendingDelete?.name || ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={onDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}

export default AdminProductsPage;
