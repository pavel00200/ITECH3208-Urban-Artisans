import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/base.css";
import { CartProvider }   from "./context/CartContext";
import { OrdersProvider } from "./context/OrdersContext";
import { AuthProvider }   from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <OrdersProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  </React.StrictMode>
);