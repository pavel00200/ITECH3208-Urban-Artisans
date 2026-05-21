import React, { useEffect, useState } from "react";
import CategorySection from "../components/CategorySection.jsx";
import "../styles/hero.css";
import "../styles/section.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {

    // Wake up Render backend faster
    fetch("https://itech3208-urban-artisans.onrender.com");

    fetch("https://itech3208-urban-artisans.onrender.com/products")
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
              <img
                src={slides[activeSlide].img}
                alt={`${slides[activeSlide].name} handmade artisan product`}
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="hero-glass-card hero-animate">
              <p className="hero-badge">
                Handmade Crafts • Artisan Products • Unique Collection
              </p>

              <h1>
                Handmade Artisan Crafts & Unique Handmade Products
              </h1>

              <p className="hero-text">
                Discover handcrafted jewelry, artisan home decor, handmade
                clothing, and unique accessories created by skilled independent
                artisans. Urban Artisans offers premium handmade products
                designed with creativity, craftsmanship, and authentic artistic
                detail.
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
        <p>Featured Handmade Categories</p>

        <h2>
          Shop artisan jewelry, handmade home decor, clothing and accessories
        </h2>

        <p>
          Explore handcrafted collections featuring artisan jewelry, premium
          home decor, handmade fashion, and creative accessories made by
          independent artisans using authentic craftsmanship techniques.
        </p>
      </div>

      <div className="category-seo-text">
        <h3>Handmade Home Decor</h3>

        <p>
          Explore artisan home decor products including handmade wall art,
          decorative bowls, sculptures, and unique interior pieces crafted by
          skilled artisans using premium materials and authentic craftsmanship.
        </p>
      </div>

      <CategorySection
        title="Home Decor"
        bg="var(--sage-green)"
        products={getCategoryProducts("Home Decor")}
      />

      <div className="category-seo-text">
        <h3>Handmade Accessories</h3>

        <p>
          Discover handcrafted accessories designed with creativity,
          premium materials, and artisan craftsmanship for everyday fashion,
          gifting, and modern lifestyle styling.
        </p>
      </div>

      <CategorySection
        title="Accessories"
        bg="var(--clay-beige)"
        products={getCategoryProducts("Accessories")}
      />

      <div className="category-seo-text">
        <h3>Artisan Jewelry Collection</h3>

        <p>
          Shop handmade jewelry including elegant earrings, necklaces,
          bracelets, and artisan accessories designed with timeless style,
          creative detailing, and handcrafted quality.
        </p>
      </div>

      <CategorySection
        title="Jewelry"
        bg="var(--sage-green)"
        products={getCategoryProducts("Jewelry")}
      />

      <div className="category-seo-text">
        <h3>Handmade Clothing</h3>

        <p>
          Browse handcrafted clothing collections featuring artisan robes,
          cotton skirts, cultural fashion styles, and comfortable handmade
          designs created for modern fashion lovers.
        </p>
      </div>

      <CategorySection
        title="Clothing"
        bg="var(--clay-beige)"
        products={getCategoryProducts("Clothing")}
      />
    </>
  );
}