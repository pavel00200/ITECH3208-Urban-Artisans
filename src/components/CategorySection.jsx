import React from "react";
import ProductCard from "./ProductCard.jsx";

export default function CategorySection({ title, bg, products }) {
  return (
    <section className="section" style={{ backgroundColor: bg }}>
      <div className="section-inner">
        <div className="section-head">
          <h2>{title}</h2>
        </div>

        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
