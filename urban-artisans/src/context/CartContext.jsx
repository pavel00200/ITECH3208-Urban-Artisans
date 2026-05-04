import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product, qty = 1, option = "") {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.option === option
      );
      if (existing) {
        // Increase qty if same product+option already in cart
        return prev.map((item) =>
          item.id === product.id && item.option === option
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        // Add new product
        return [...prev, { ...product, qty, option }];
      }
    });
  }

  function removeFromCart(id, option = "") {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.option === option)));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
