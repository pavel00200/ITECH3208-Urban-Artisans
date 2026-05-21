import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/shop.css";

function useClickAway(ref, onAway) {
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onAway();
      }
    };

    document.addEventListener("mousedown", h);

    return () => document.removeEventListener("mousedown", h);
  }, [ref, onAway]);
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCat, setActiveCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("popular");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useClickAway(filterRef, () => setShowFilter(false));
  useClickAway(sortRef, () => setShowSort(false));

  useEffect(() => {
    fetch("https://itech3208-urban-artisans.onrender.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(data);

        const cats = Array.from(
          new Set(data.map((p) => p.category).filter(Boolean))
        ).sort();

        setCategories(["All", ...cats]);
      })
      .catch((err) => {
        console.error(err);
        setError("Products could not be loaded. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCat(categoryFromUrl);
    } else {
      setActiveCat("All");
    }
  }, [categoryFromUrl]);

  function handleCategoryChange(cat) {
    setActiveCat(cat);
    setShowFilter(false);

    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  }

  const searchText = q.trim().toLowerCase();

  const filtered = products
    .filter((p) => activeCat === "All" || p.category === activeCat)
    .filter((p) => {
      if (!searchText) return true;

      const name = p.name?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        category.includes(searchText) ||
        description.includes(searchText)
      );
    });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") {
      return Number(a.price) - Number(b.price);
    }

    if (sort === "price-desc") {
      return Number(b.price) - Number(a.price);
    }

    if (sort === "newest") {
      return Number(b.id) - Number(a.id);
    }

    return 0;
  });

  if (loading) {
    return (
      <div className="pd">
        <div className="empty-state">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd">
        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="shop">
      <div className="shop-toolbar">
        <div className="toolbar-left">
          <button
            className="btn-pill"
            onClick={() => {
              setShowFilter((v) => !v);
              setShowSort(false);
            }}
            aria-expanded={showFilter}
            aria-controls="filter-dropdown"
          >
            <span className="icon">≡</span> Filter
          </button>

          <div
            id="filter-dropdown"
            className="dropdown"
            ref={filterRef}
            hidden={!showFilter}
          >
            <div className="dropdown-head">Categories</div>

            <div className="dropdown-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`dropdown-item ${
                    activeCat === cat ? "is-active" : ""
                  }`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat === "Jewelry" ? "Jewellery" : cat}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-pill"
            onClick={() => {
              setShowSort((v) => !v);
              setShowFilter(false);
            }}
            aria-expanded={showSort}
            aria-controls="sort-dropdown"
          >
            Sort
            <span className="caret">{showSort ? "▴" : "▾"}</span>
          </button>

          <div
            id="sort-dropdown"
            className="dropdown"
            ref={sortRef}
            hidden={!showSort}
          >
            <div className="dropdown-head">Sort by</div>

            <div className="dropdown-list">
              <button
                className={`dropdown-item ${
                  sort === "popular" ? "is-active" : ""
                }`}
                onClick={() => {
                  setSort("popular");
                  setShowSort(false);
                }}
              >
                Most Popular
              </button>

              <button
                className={`dropdown-item ${
                  sort === "price-asc" ? "is-active" : ""
                }`}
                onClick={() => {
                  setSort("price-asc");
                  setShowSort(false);
                }}
              >
                Price: Low To High
              </button>

              <button
                className={`dropdown-item ${
                  sort === "price-desc" ? "is-active" : ""
                }`}
                onClick={() => {
                  setSort("price-desc");
                  setShowSort(false);
                }}
              >
                Price: High To Low
              </button>

              <button
                className={`dropdown-item ${
                  sort === "newest" ? "is-active" : ""
                }`}
                onClick={() => {
                  setSort("newest");
                  setShowSort(false);
                }}
              >
                Newest Arrivals
              </button>
            </div>
          </div>
        </div>

        <div className="toolbar-search">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            {q && (
              <button
                className="search-clear"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <header className="shop-header">
        <h1>{activeCat === "Jewelry" ? "Jewellery" : activeCat}</h1>
        <p className="muted">{sorted.length} items</p>
      </header>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <p>No items found. Try a different category or search term.</p>
        </div>
      ) : (
        <section className="grid">
          {sorted.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </section>
      )}
    </main>
  );
}