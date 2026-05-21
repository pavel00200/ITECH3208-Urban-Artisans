import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {

  const { slug } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {

    setLoading(true);
    setError("");

    console.log("CURRENT SLUG:", slug);

    fetch(
      `https://itech3208-urban-artisans.onrender.com/products/${slug}`
    )

      .then((res) => {

        if (!res.ok) {
          throw new Error("Product not found");
        }

        return res.json();
      })

      .then((data) => {

        console.log("PRODUCT:", data);

        setProduct(data);
      })

      .catch((err) => {

        console.error(err);

        setError("Product not found");
      })

      .finally(() => setLoading(false));

  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  if (loading) {
    return (
      <div className="product-message">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-message">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-message">
        Product not found
      </div>
    );
  }

  return (
    <main className="product-detail-page">

      <section className="product-detail-card">

        <div className="product-image-box">
          <img
            src={product.img}
            alt={`${product.name} handmade artisan product`}
          />
        </div>

        <div className="product-info-box">

          <p className="product-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <p className="product-price">
            ${product.price}
          </p>

          <p className="product-short-desc">
            {product.description}
          </p>

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

          <Link
            to="/shop"
            className="back-shop-link"
          >
            ← Back to Shop
          </Link>

        </div>

      </section>

    </main>
  );
}