import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [wishAdded, setWishAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`https://itech3208-urban-artisans.onrender.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setQty(1);
      })
      .catch((err) => {
        console.error(err);
        setError("Product not found");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || adding) return;

    setAdding(true);
    addToCart(product, qty);

    setTimeout(() => {
      setAdding(false);
    }, 1000);
  };

  const handleWishlist = () => {
    if (!product) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const wishlistKey = currentUser
      ? `wishlist_${currentUser.email || currentUser.name}`
      : "wishlist_guest";

    const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    const exists = wishlist.find((item) => item.id === product.id);

    if (!exists) {
      wishlist.push(product);
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }

    setWishAdded(true);

    setTimeout(() => {
      setWishAdded(false);
    }, 1500);
  };

  const handleImageError = (e) => {
    e.currentTarget.src = "/placeholder-product.png";
  };

  if (loading) return <div className="product-message">Loading...</div>;
  if (error) return <div className="product-message">{error}</div>;
  if (!product) return <div className="product-message">Product not found</div>;

  return (
    <main className="product-detail-page">
      <section className="product-detail-card">
        <div className="product-image-box">
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        <div className="product-info-box">
          <p className="product-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-price">${product.price}</p>

          <p className="product-short-desc">{product.description}</p>

          <div className="qty-box">
            <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>
              -
            </button>

            <span>{qty}</span>

            <button onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Added!" : "Add to Cart"}
          </button>

          <button className="wishlist-btn" onClick={handleWishlist}>
            {wishAdded ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
          </button>

          <div className="product-info-note">
            <strong>About this item</strong>
            <p>{product.description}</p>
          </div>

          <Link to="/shop" className="back-shop-link">
            ← Back to Shop
          </Link>
        </div>
      </section>
    </main>
  );
}