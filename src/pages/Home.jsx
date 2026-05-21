import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

      .then((data) => {

        console.log("HOME PRODUCTS:", data);

        setProducts(data);
      })

      .catch((err) =>
        console.error("Failed to fetch products:", err)
      );

  }, []);

  const getCategoryProducts = (cat) =>
    products
      .filter((p) => p.category === cat)
      .slice(0, 4);

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
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);

  }, [slides.length]);

  const nextSlide = () => {

    setActiveSlide(
      (prev) => (prev + 1) % slides.length
    );
  };

  const prevSlide = () => {

    setActiveSlide(
      (prev) =>
        (prev - 1 + slides.length) % slides.length
    );
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
                alt={slides[activeSlide].name}
              />
            </div>

            <div className="hero-glass-card hero-animate">
              <p className="hero-badge">
                Handmade Crafts • Artisan Products • Unique Collection
              </p>

            <h1>{currentSlide.title}</h1>

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

        <p>
          Featured Handmade Categories
        </p>

        <h2>
          Shop artisan jewelry, handmade home decor, clothing and accessories
        </h2>

        <p>
          Explore handcrafted collections featuring artisan jewelry, premium
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