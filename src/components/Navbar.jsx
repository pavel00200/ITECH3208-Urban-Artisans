import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { cart } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    setProfileOpen(false);
    setOpen(false);
  }, [location.pathname, location.search]);

  function handleLogout() {
    logout();
    setProfileOpen(false);
    setOpen(false);
    navigate("/");
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <button
            className="hamburger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link to="/" className="brand">
            <span className="brand-urban">Urban</span>
            <span className="brand-artisans">Artisans</span>
          </Link>

          <div className="nav-actions">
            <Link to="/" className="nav-link">🏠 Home</Link>
            <Link to="/shop" className="nav-link">🛍️ Shop</Link>
            <Link to="/orders" className="nav-link">📦 My Orders</Link>

            {isLoggedIn ? (
              <div className="profile-area">
                <button
                  className="profile-trigger"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <span className="profile-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>

                  <span className="profile-name">
                    {user?.name || "User"}
                  </span>

                  <span className="profile-arrow">⌄</span>
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-card-head">
                      <div className="profile-big-avatar">
                        {user?.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>

                      <div>
                        <h3>Hi {user?.name || "User"}!</h3>
                        <p>Welcome back to Urban Artisans</p>
                      </div>
                    </div>

                    <Link
                      to="/wishlist"
                      onClick={() => setProfileOpen(false)}
                    >
                      ♡ Wishlist
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setProfileOpen(false)}
                    >
                      🛒 Cart
                    </Link>

                    <Link
                      to="/account"
                      onClick={() => setProfileOpen(false)}
                    >
                      ⚙️ Manage account
                    </Link>

                    <button
                      className="profile-logout"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-group">
                <Link to="/login" className="nav-login-btn">
                  Login
                </Link>

                <Link to="/register" className="nav-register-btn">
                  Register
                </Link>
              </div>
            )}

            <Link to="/cart" className="cart-btn">
              🛒
              {totalQty > 0 && (
                <span className="cart-count">{totalQty}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      ></div>

      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <h3>Menu</h3>

          <button
            className="close"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="drawer-nav">
          <Link to="/" onClick={() => setOpen(false)}>
            🏠 Home
          </Link>

          <Link to="/shop" onClick={() => setOpen(false)}>
            🛍️ Shop All
          </Link>

          <Link to="/wishlist" onClick={() => setOpen(false)}>
            ♡ Wishlist
          </Link>

          <Link
            to="/shop?category=Jewelry"
            onClick={() => setOpen(false)}
          >
            💍 Jewellery
          </Link>

          <Link
            to="/shop?category=Home Decor"
            onClick={() => setOpen(false)}
          >
            🏡 Home Decor
          </Link>

          <Link
            to="/shop?category=Clothing"
            onClick={() => setOpen(false)}
          >
            👗 Clothing
          </Link>

          <Link
            to="/shop?category=Accessories"
            onClick={() => setOpen(false)}
          >
            👜 Accessories
          </Link>

          {isLoggedIn ? (
            <button
              className="drawer-logout-btn"
              onClick={handleLogout}
            >
              🚪 Logout ({user?.name})
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
              >
                🔑 Login
              </Link>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
              >
                📝 Register
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}