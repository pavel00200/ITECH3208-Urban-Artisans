import React from "react";
import "../styles/infoPage.css";

export default function BuyerFAQ() {
  return (
    <main className="info-page">
      <h1>Buyer FAQ</h1>

      <h3>How do I buy a product?</h3>
      <p>
        Go to the Shop page, choose a product, add it to cart and continue to checkout.
      </p>

      <h3>Can I search products?</h3>
      <p>
        Yes. Use the search box on the Shop page to find products quickly.
      </p>

      <h3>Can I filter products?</h3>
      <p>
        Products can be filtered by categories like Jewellery, Home Decor, Clothing and Accessories.
      </p>

      <h3>Where can I see my orders?</h3>
      <p>
        Logged in users can view their orders from the My Orders page.
      </p>
    </main>
  );
}