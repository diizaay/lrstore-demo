import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CategoryPage from "./pages/CategoryPage";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AccountPage from "./pages/AccountPage";
import ProductDetails from "./pages/ProductDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminLogin from "./pages/admin/AdminLogin";
import FloatingWhatsappButton from "./components/FloatingWhatsappButton";
import AboutPage from "./pages/AboutPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import ShippingPage from "./pages/ShippingPage";
import ReturnsPage from "./pages/ReturnsPage";
import TermsPage from "./pages/TermsPage";
import FaqPage from "./pages/FaqPage";
import PrivacyPage from "./pages/PrivacyPage";
import FalaConnoscoPage from "./pages/FalaConnoscoPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  );
}

const AppShell = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="App min-h-screen flex flex-col bg-slate-50">
      {!isAdminRoute && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produto/:productId" element={<ProductDetails />} />
          <Route path="/categorias/:slug" element={<CategoryPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/conta" element={<AccountPage />} />
          <Route path="/sobre-nos" element={<AboutPage />} />
          <Route path="/central-de-ajuda" element={<HelpCenterPage />} />
          <Route path="/envios-entregas" element={<ShippingPage />} />
          <Route path="/devolucoes" element={<ReturnsPage />} />
          <Route path="/termos-condicoes" element={<TermsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/politica-privacidade" element={<PrivacyPage />} />
          <Route path="/fala-connosco" element={<FalaConnoscoPage />} />
          <Route
            path="/pedido/:orderNumber"
            element={<OrderConfirmation />}
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="support" element={<AdminSupport />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsappButton />}
      <Toaster />
    </div>
  );
};

export default App;
