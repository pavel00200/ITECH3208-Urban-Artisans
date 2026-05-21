import { useEffect, useState } from "react";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/orders.css";

export default function Orders() {
  const { orders: contextOrders } = useOrders();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      // wait until user is loaded
      if (!user) {
        setOrders(contextOrders);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://urban-artisans-api.onrender.com/orders/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data); // database orders, newest first
      } catch (err) {
        console.error(err);
        // fallback to in-memory context orders
        setOrders(contextOrders);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, contextOrders]);

  if (loading) {
    return (
      <div className="orders-page">
        <p>Loading your orders…</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h2>No orders yet.</h2>
        <Link to="/shop" className="btn">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <nav className="pd-breadcrumb">
        <Link to="/" className="link">Home</Link>
        <span>/</span>
        <Link to="/shop" className="link">Shop</Link>
        <span>/</span>
        <span className="muted">My Orders</span>
      </nav>

      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map((order, index) => (
          <div key={order.id || index} className="order-card">
            <div className="order-header">
              <h2>Order #{order.id || order.dbId || orders.length - index}</h2>
              <span>{order.date || order.created_at}</span>
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <img src={item.img} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    {item.option && <p>Option: {item.option}</p>}
                    <p>{item.qty} × ${item.price} = ${item.qty * item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <p><strong>Payment:</strong> {(order.paymentMethod || order.payment_method || "").toUpperCase()}</p>
              <p><strong>Status:</strong> {order.status || "pending"}</p>
              <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <Link to="/shop" className="btn">Continue Shopping</Link>
    </div>
  );
}