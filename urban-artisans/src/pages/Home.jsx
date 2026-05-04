import React, { useEffect, useState } from "react";
import CategorySection from "../components/CategorySection.jsx";
import "../styles/hero.css";
import "../styles/section.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const getCategoryProducts = (cat) =>
    products.filter((p) => p.category === cat).slice(0, 4);

  const slides = products.slice(0, 4);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      <section className="modern-hero">
        <div className="hero-bg-circle circle-one"></div>
        <div className="hero-bg-circle circle-two"></div>

        {slides.length > 0 && (
          <>
            <div className="hero-feature-image">
              <img src={slides[activeSlide].img} alt={slides[activeSlide].name} />
            </div>

            <div className="hero-glass-card hero-animate">
              <p className="hero-badge">New Arrival • Handmade • Unique</p>

              <h1>{slides[activeSlide].name}</h1>

              <p className="hero-text">
                Discover exclusive handmade items crafted by independent
                artisans with care, detail and creativity.
              </p>

              <div className="hero-actions">
                <a
                  href={`#/product/${slides[activeSlide].id}`}
                  className="glass-btn primary"
                >
                  View Product
                </a>

                <a href="#/shop" className="glass-btn secondary">
                  Shop Collection
                </a>
              </div>
            </div>

            <button className="hero-arrow left" onClick={prevSlide}>
              ‹
            </button>

            <button className="hero-arrow right" onClick={nextSlide}>
              ›
            </button>

            <div className="hero-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={activeSlide === index ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                ></button>
              ))}
            </div>
          </>
        )}
      </section>

      <div className="home-section-intro">
        <p>Featured Categories</p>
        <h2>Shop by handmade collections</h2>
      </div>

      <CategorySection
        title="Home Decor"
        bg="var(--sage-green)"
        products={getCategoryProducts("Home Decor")}
      />

      <CategorySection
        title="Accessories"
        bg="var(--clay-beige)"
        products={getCategoryProducts("Accessories")}
      />

      <CategorySection
        title="Jewelry"
        bg="var(--sage-green)"
        products={getCategoryProducts("Jewelry")}
      />

      <CategorySection
        title="Clothing"
        bg="var(--clay-beige)"
        products={getCategoryProducts("Clothing")}
      />
    </>
  );
}