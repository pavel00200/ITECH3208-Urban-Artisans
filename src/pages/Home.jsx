import React, { useEffect, useState } from "react";
import CategorySection from "../components/CategorySection.jsx";
import "../styles/hero.css";
import "../styles/section.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch("https://urban-artisans-api.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const getCategoryProducts = (cat) =>
    products.filter((p) => p.category === cat).slice(0, 4);

  const slides = [
    {
      category: "Jewellery",
      dbCategory: "Jewelry",
      title: "Handcrafted Jewellery Collection",
      text: "Explore unique handmade earrings, necklaces, bracelets and accessories created by independent artisans with careful detail and style.",
      badge: "Featured Collection • Handmade Jewellery",
      button: "View Jewellery",
    },
    {
      category: "Home Decor",
      dbCategory: "Home Decor",
      title: "Artisan Home Decor Pieces",
      text: "Discover handcrafted bowls, wall decor and decorative pieces designed to bring warmth, creativity and character into your home.",
      badge: "Featured Collection • Home Decor",
      button: "View Home Decor",
    },
    {
      category: "Clothing",
      dbCategory: "Clothing",
      title: "Handmade Clothing & Fashion",
      text: "Shop handmade clothing pieces created with traditional patterns, soft fabrics and unique artisan design for everyday wear.",
      badge: "Featured Collection • Handmade Clothing",
      button: "View Clothing",
    },
    {
      category: "Accessories",
      dbCategory: "Accessories",
      title: "Creative Handmade Accessories",
      text: "Find handcrafted accessories made with creativity and care, including unique personal items designed by skilled artisans.",
      badge: "Featured Collection • Accessories",
      button: "View Accessories",
    },
  ];

  const currentSlide = slides[activeSlide];

  const slideProduct =
    products.find((p) => p.category === currentSlide.dbCategory) || products[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

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

        <div className="hero-content-wrap">
          <div className="hero-glass-card hero-animate" key={activeSlide}>
            <p className="hero-badge">{currentSlide.badge}</p>

            <h1>{currentSlide.title}</h1>

            <p className="hero-text">{currentSlide.text}</p>

            <div className="hero-actions">
              <a
                href={`#/shop?category=${currentSlide.dbCategory}`}
                className="glass-btn primary"
              >
                {currentSlide.button}
              </a>

              {slideProduct && (
                <a
                  href={`#/product/${slideProduct.id}`}
                  className="glass-btn secondary"
                >
                  View Product
                </a>
              )}
            </div>
          </div>

          {slideProduct && (
            <div className="hero-feature-image" key={slideProduct.id}>
              <img src={slideProduct.img} alt={slideProduct.name} />
            </div>
          )}
        </div>

        <button
          className="hero-arrow left"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          className="hero-arrow right"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="hero-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.category}
              className={activeSlide === index ? "active" : ""}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${slide.category} slide`}
            ></button>
          ))}
        </div>
      </section>

      <div className="home-section-intro">
        <p>Featured Handmade Categories</p>

        <h2>
          Shop artisan jewellery, handmade home decor, clothing and accessories
        </h2>

        <p>
          Explore handcrafted collections featuring artisan jewellery, premium
          home decor, handmade fashion, and creative accessories made by
          independent artisans using authentic craftsmanship techniques.
        </p>
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
        title="Jewellery"
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