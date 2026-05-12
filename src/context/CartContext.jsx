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

        // Increase quantity if already exists
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

    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.option === option)
      )
    );
  }

  // Increase quantity
  function increaseQty(id, option = "") {

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.option === option
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  }

  // Decrease quantity
  function decreaseQty(id, option = "") {

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.option === option
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>

  );
}

export function useCart() {
  return useContext(CartContext);
}