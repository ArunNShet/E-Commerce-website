import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsCart4, BsCartFill } from "react-icons/bs";
import { MdOutlineShoppingBag, MdShoppingBag } from "react-icons/md";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminChangePasswordPage from "./pages/admin/AdminChangePasswordPage";
import { clearAuthSession, getAuthSession } from "./lib/auth";
import { showSuccessToast } from "./lib/toast";

function PublicLayout({ isLoggedIn, isAdmin, onLogout }) {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="layout">
      <Header isLoggedIn={isLoggedIn} isAdmin={false} onLogout={onLogout} />
      <main className={isHomeRoute ? "page-shell page-shell-home" : "page-shell"}>
        <Outlet />
      </main>
      <Footer />
      {isLoggedIn && (
        <nav className="bottom-nav">
          <NavLink to="/" end>
            {({ isActive }) => (
              <>
                <span className="nav-item-icon">
                  {isActive ? <AiFillHome /> : <AiOutlineHome />}
                </span>
                Home
              </>
            )}
          </NavLink>
          <NavLink to="/products">
            {({ isActive }) => (
              <>
                <span className="nav-item-icon">
                  {isActive ? <MdShoppingBag /> : <MdOutlineShoppingBag />}
                </span>
                Products
              </>
            )}
          </NavLink>
          <NavLink to="/cart">
            {({ isActive }) => (
              <>
                <span className="nav-item-icon">
                  {isActive ? <BsCartFill /> : <BsCart4 />}
                </span>
                Cart
              </>
            )}
          </NavLink>
        </nav>
      )}
    </div>
  );
}

function AdminRouteShell({ session, onSessionChange }) {
  return <AdminLayout session={session} onSessionChange={onSessionChange} />;
}

function AppShell() {
  const location = useLocation();
  const [session, setSession] = useState(getAuthSession());
  const isLoggedIn = useMemo(() => Boolean(session.token), [session.token]);
  const isAdmin = useMemo(() => session.role === "ADMIN", [session.role]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setSession({ token: "", role: "", phone: "", name: "" });
    showSuccessToast("Logged out successfully.");
  };

  return (
    <>
      <Routes>
        <Route
          element={<PublicLayout isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />}
        >
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductListPage isLoggedIn={isLoggedIn} isAdmin={false} />}
          />
          <Route path="/shop" element={<Navigate to="/products" replace />} />
          <Route
            path="/products/:id"
            element={isLoggedIn ? <ProductDetailPage isAdmin={false} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/product/:id"
            element={isLoggedIn ? <ProductDetailPage isAdmin={false} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cart"
            element={isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={isLoggedIn ? <Navigate to={isAdmin ? "/admin/dashboard" : "/"} replace /> : <LoginPage onLogin={setSession} />} />
          <Route path="/forgot-password" element={isLoggedIn ? <Navigate to={isAdmin ? "/admin/dashboard" : "/"} replace /> : <ForgotPasswordPage />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to={isAdmin ? "/admin/dashboard" : "/"} replace /> : <RegisterPage onRegister={setSession} />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route
          path="/admin"
          element={<AdminRouteShell session={session} onSessionChange={setSession} />}
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage authToken={session.token} />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="change-password" element={<AdminChangePasswordPage />} />
        </Route>

        <Route path="*" element={<Navigate to={isAdmin ? "/admin/dashboard" : "/"} replace />} />
      </Routes>
      <ToastContainer newestOnTop pauseOnFocusLoss={false} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
