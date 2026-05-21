import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({
  id,
  slug,
  img,
  name,
  price
}) {

  return (

    <Link
      to={`/product/${id}-${slug}`}
      className="block"
    >

      <article className="card hover:shadow-lg transition">

        <div className="thumb">

          <img
            src={img}
            alt={`${name} handmade artisan product`}
            loading="lazy"
            decoding="async"
          />

        </div>

        <div className="meta">

          <p className="name">
            {name}
          </p>

          <span className="price">
            ${price}
          </span>

        </div>

      </article>

    </Link>
  );
}