import { useLocation, Link } from "react-router-dom";
import "../styles/order.css";

export default function OrderConfirmation() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="order-page">
        <h2>No order found.</h2>
        <Link to="/shop" className="btn">
          Go to Shop
        </Link>
      </div>
    );
  }

  const { items, total, paymentMethod, shipping, date } = state;

  return (
    <div className="order-page">
      <h1>Thank you for your order! 🎉</h1>
      <p>Order Date: {date}</p>

      <div className="order-container">
        {/* Left: Ordered Items */}
        <div className="order-items">
          <h2>Items Ordered</h2>
          {items.map((item, i) => (
            <div key={i} className="order-item">
              <img src={item.img} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                {item.option && <p>Option: {item.option}</p>}
                <p>
                  {item.qty} × ${item.price} = ${item.qty * item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Shipping & Payment Info */}
        <div className="order-summary">
          <h2>Shipping Details</h2>
          <p><strong>Name:</strong> {shipping.name}</p>
          <p><strong>Email:</strong> {shipping.email}</p>
          <p>
            <strong>Address:</strong> {shipping.address}, {shipping.city},{" "}
            {shipping.zip}, {shipping.country}
          </p>

          <h2>Payment</h2>
          <p>{paymentMethod.toUpperCase()}</p>
          <h2>Total Paid</h2>
          <p>${total.toFixed(2)}</p>

          <Link to="/shop" className="btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
