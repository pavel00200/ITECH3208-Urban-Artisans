import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import "../styles/checkout.css";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name:    user?.name  || "",
    email:   user?.email || "",
    address: "",
    city:    "",
    zip:     "",
    country: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const order = {
      userId:        user?.id || 1,
      items:         cart,
      total,
      paymentMethod,
      shipping:      formData,
      date:          new Date().toLocaleString(),
    };

    try {
      // save the order to the database
      const res = await fetch("https://itech3208-urban-artisans.onrender.com/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(order),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // also keep it in context so OrderConfirmation can read it immediately
        addOrder({ ...order, dbId: data.orderId });
        clearCart();
        navigate("/order-confirmation", { state: { ...order, dbId: data.orderId } });
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch {
      // if server is down, still let the user complete the flow locally
      addOrder(order);
      clearCart();
      navigate("/order-confirmation", { state: order });
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="checkout-grid">
        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <ul className="checkout-items">
            {cart.map((item, i) => (
              <li key={i} className="checkout-item">
                <img src={item.img} alt={item.name} className="checkout-img" />
                <div>
                  <p>{item.name}</p>
                  {item.option && <small>Option: {item.option}</small>}
                  <p>{item.qty} × ${item.price} = ${item.qty * item.price}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
        </aside>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Details</h2>
          <label>
            Full Name
            <input type="text" name="name" placeholder="Full Name"
              value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Email Address
            <input type="email" name="email" placeholder="Email Address"
              value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Shipping Address
            <input type="text" name="address" placeholder="Shipping Address"
              value={formData.address} onChange={handleChange} required />
          </label>
          <div className="checkout-row">
            <label>
              City
              <input type="text" name="city" placeholder="City"
                value={formData.city} onChange={handleChange} required />
            </label>
            <label>
              Zip Code
              <input type="text" name="zip" placeholder="Zip Code"
                value={formData.zip} onChange={handleChange} required />
            </label>
            <label>
              Country
              <input type="text" name="country" placeholder="Country"
                value={formData.country} onChange={handleChange} required />
            </label>
          </div>

          <h2>Payment Method</h2>
          <div className="payment-options">
            {["card", "paypal", "cod"].map((method) => (
              <div
                key={method}
                className={`payment-card ${paymentMethod === method ? "selected" : ""}`}
                onClick={() => setPaymentMethod(method)}
              >
                <input type="radio" value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)} />
                <span>
                  {method === "card"   ? "💳 Credit / Debit Card"
                  : method === "paypal" ? "🅿️ PayPal"
                  : "💵 Cash on Delivery"}
                </span>
              </div>
            ))}
          </div>

          {paymentMethod === "card" && (
            <>
              <label>
                Card Number
                <input type="text" placeholder="1234 5678 9012 3456" required />
              </label>
              <div className="checkout-row">
                <label>Expiry Date<input type="text" placeholder="MM/YY" required /></label>
                <label>CVV<input type="password" placeholder="123" required /></label>
              </div>
            </>
          )}
          {paymentMethod === "paypal" && <p>You will be redirected to PayPal.</p>}
          {paymentMethod === "cod"    && <p>Pay with cash on delivery.</p>}

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}