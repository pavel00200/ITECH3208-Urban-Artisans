import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/product.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const wishlistKey = currentUser
    ? `wishlist_${currentUser.email || currentUser.name}`
    : "wishlist_guest";

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem(wishlistKey)) || [];

    setWishlist(savedWishlist);
  }, [wishlistKey]);

  const removeWishlistItem = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      wishlistKey,
      JSON.stringify(updatedWishlist)
    );
  };

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <h1>My Wishlist</h1>

        <p>Your wishlist is empty.</p>

        <Link
          to="/shop"
          className="btn"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <h1>My Wishlist</h1>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div
            className="wishlist-card"
            key={item.id}
          >
            <img
              src={item.img}
              alt={`${item.name} handmade artisan wishlist product`}
              loading="lazy"
              decoding="async"
              width="300"
              height="300"
            />

            <h3>{item.name}</h3>

            <p>${item.price}</p>

            <Link
              to={`/product/${item.slug || item.id}`}
              className="wishlist-view-btn"
            >
              View Product
            </Link>

            <button
              onClick={() => removeWishlistItem(item.id)}
              aria-label={`Remove ${item.name} from wishlist`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}