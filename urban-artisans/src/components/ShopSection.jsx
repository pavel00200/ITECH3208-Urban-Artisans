import React, { useState } from "react";
import ProductCard from "./ProductCard.jsx";

export default function ShopSection({ title, items, limit = 5 }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, limit);

  return (
    <section className="shop-section">
      <div className="shop-head-row">
        <h2>{title}</h2>
        {items.length > limit && (
          <button className="link-cta" onClick={() => setExpanded(v => !v)}>
            {expanded ? "Show 5 only" : `Show all (${items.length})`}
          </button>
        )}
      </div>

      <div className="grid">
        {visible.map(p => (
          <ProductCard key={p.id} img={p.img} name={p.name} price={`$${p.price}`} />
        ))}
      </div>
    </section>
  );
}
