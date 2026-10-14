import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { BsCart4 } from "react-icons/bs";
import { listProducts } from "../api/productsApi";
import { addToCart, getCartItems, removeFromCart, updateCartQuantity } from "../lib/cartStore";
import { formatCurrency } from "../lib/currency";
import ProductImage from "../components/ProductImage";
import { showCartToast, showWarningToast } from "../lib/toast";

function getProductBadge(product) {
  const stock = Number(product.stock) || 0;
  if (stock <= 0) {
    return { label: "Sold Out", tone: "sold-out" };
  }
  if (stock <= 5) {
    return { label: "Limited", tone: "limited" };
  }
  return { label: "Fresh Batch", tone: "fresh" };
}

function getShortDescription(description) {
  const text = String(description || "").trim();
  if (!text) {
    return "Traditional flavour, carefully prepared for everyday kitchens.";
  }
  return text.length > 110 ? `${text.slice(0, 107)}...` : text;
}

function ProductListPage({ isLoggedIn }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const syncCartQuantities = () => {
      const quantities = {};
      getCartItems().forEach((item) => {
        quantities[item.id] = Number(item.quantity) || 0;
      });
      setCartQuantities(quantities);
    };

    loadProducts();
    syncCartQuantities();
    window.addEventListener("cart-updated", syncCartQuantities);

    return () => {
      window.removeEventListener("cart-updated", syncCartQuantities);
    };
  }, []);

  const availableCategories = useMemo(() => {
    const categories = new Set();
    products.forEach((product) => {
      const categoryName = product.categoryName || product.category?.name || "";
      if (categoryName) {
        categories.add(categoryName);
      }
    });
    return Array.from(categories).sort((left, right) => left.localeCompare(right));
  }, [products]);

  const orderedProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const matches = [];
    const remainingInStock = [];
    const remainingOutOfStock = [];

    products.forEach((product) => {
      const name = String(product.name || "").toLowerCase();
      const isMatch = searchTerm && name.includes(searchTerm);
      const categoryName = product.categoryName || product.category?.name || "";

      if (categoryFilter !== "all" && categoryName !== categoryFilter) {
        return;
      }

      if (isMatch) {
        matches.push(product);
        return;
      }

      if (Number(product.stock) <= 0) {
        remainingOutOfStock.push(product);
      } else {
        remainingInStock.push(product);
      }
    });

    if (!searchTerm) {
      return [...remainingInStock, ...remainingOutOfStock];
    }

    return [...matches, ...remainingInStock, ...remainingOutOfStock];
  }, [products, search, categoryFilter]);

  const onIncreaseQuantity = (product) => {
    addToCart(product);
    const totalItems = getCartItems().reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
    showCartToast(totalItems);
  };

  const onDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      removeFromCart(productId);
      return;
    }
    updateCartQuantity(productId, currentQuantity - 1);
  };

  const openProductCard = (productId) => {
    if (!isLoggedIn) {
      showWarningToast("Login required to view details or add to cart.");
      navigate("/login");
      return;
    }
    navigate(`/products/${productId}`);
  };

  return (
    <section>
      <div className="sticky-filter-shell sticky-filter-shell-public">
        <div className="admin-search-block sticky-filter-bar sticky-filter-bar-public">
          <div className="search-input-wrap">
            <span className="search-input-icon" aria-hidden="true">
              <FiSearch />
            </span>
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name"
            />
          </div>
          <select
            className="product-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p className="muted">Loading products...</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {orderedProducts.map((product) => {
            const isOutOfStock = Number(product.stock) <= 0;
            const quantity = cartQuantities[product.id] || 0;
            const badge = getProductBadge(product);

            return (
              <article
                key={product.id}
                className="card product-shop-card product-shop-card-clickable"
                onClick={() => openProductCard(product.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProductCard(product.id);
                  }
                }}
                role="link"
                tabIndex={0}
              >
                <div className={`product-card-media product-shop-card-media ${isOutOfStock ? "is-out-of-stock" : ""}`}>
                  <div className="product-card-image-wrap product-image-link">
                    <ProductImage imageUrl={product.imageUrl} productName={product.name} className="product-card-image" />
                  </div>
                  <div className={`product-shop-badge ${badge.tone}`}>{badge.label}</div>
                </div>

                <div className="product-shop-body">
                  <p className="product-shop-weight-label">{product.weight}</p>
                  <h3 className="product-shop-title">{product.name}</h3>
                  <p className="product-shop-description">{getShortDescription(product.description)}</p>

                  <div className="product-shop-price-row">
                    <p className="product-shop-price">{formatCurrency(product.price)}</p>
                    <div className="row product-shop-actions">
                      {quantity > 0 ? (
                        <div className="cart-stepper product-shop-stepper" onClick={(event) => event.stopPropagation()}>
                          <button
                            type="button"
                            className="secondary"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDecreaseQuantity(product.id, quantity);
                            }}
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            className="add-cart product-shop-add"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (!isLoggedIn) {
                                showWarningToast("Login required to view details or add to cart.");
                                navigate("/login");
                                return;
                              }
                              if (isOutOfStock) {
                                showWarningToast("Product not available.");
                                return;
                              }
                              onIncreaseQuantity(product);
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="add-cart product-shop-add"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!isLoggedIn) {
                              showWarningToast("Login required to view details or add to cart.");
                              navigate("/login");
                              return;
                            }
                            if (isOutOfStock) {
                              showWarningToast("Product not available.");
                              return;
                            }
                            onIncreaseQuantity(product);
                          }}
                        >
                          <BsCart4 />
                          <span> add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProductListPage;
