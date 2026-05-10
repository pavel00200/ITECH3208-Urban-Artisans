import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty 🛒</h2>
        <Link to="/shop" className="btn">Continue Shopping</Link>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  function handleCheckout() {
    navigate(isLoggedIn ? "/checkout" : "/login");
  }

  return (
    <div className="cart-page">
      <nav className="pd-breadcrumb">
        <Link to="/" className="link">Home</Link>
        <span>/</span>
        <Link to="/shop" className="link">Shop</Link>
        <span>/</span>
        <span className="muted">Cart</span>
      </nav>

      <h1>Your Cart</h1>

      <div className="cart-grid">
        <ul className="cart-list">
          {cart.map((item, i) => (
            <li key={`${item.id}-${item.option}-${i}`} className="cart-item">
              <img src={item.img} alt={item.name} className="cart-img" />

              <div className="cart-info">
                <h3>{item.name}</h3>

                {item.option && (
                  <p className="cart-option">Option: {item.option}</p>
                )}

                <p>Price: ${item.price}</p>

                <div className="cart-qty-row">
                  <span>Qty:</span>

                  <button
                    className="cart-qty-btn"
                    onClick={() => decreaseQty(item.id, item.option)}
                  >
                    -
                  </button>

                  <span className="cart-qty-value">{item.qty}</span>

                  <button
                    className="cart-qty-btn"
                    onClick={() => increaseQty(item.id, item.option)}
                  >
                    +
                  </button>
                </div>

                <p className="cart-subtotal">
                  Subtotal: ${item.price * item.qty}
                </p>
              </div>

              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id, item.option)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <p>Total Items: {totalItems}</p>
          <h3>Total: ${total.toFixed(2)}</h3>

          <button className="btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <button className="btn-clear" onClick={clearCart}>
            Clear Cart
          </button>
        </aside>
      </div>
    </div>
  );
}