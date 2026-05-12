import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import ManageAccount from "./pages/ManageAccount";

export default function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/shop"               element={<Shop />} />
        <Route path="/product/:id"        element={<ProductDetail />} />
        <Route path="/cart"               element={<Cart />} />
        <Route path="/orders"             element={<Orders />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
<Route
  path="/account"
  element={
    <ProtectedRoute>
      <ManageAccount />
    </ProtectedRoute>
  }
/>
        {/* public login page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* checkout is only accessible after login */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </HashRouter>
  );
}