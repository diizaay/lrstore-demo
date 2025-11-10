import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CategoryPage from "./pages/CategoryPage";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="App min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/categorias/:slug" element={<CategoryPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido/:orderNumber" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
