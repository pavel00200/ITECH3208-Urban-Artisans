import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="foot-columns">
        <div>
          <h4>Shop</h4>
          <a href="#">Jewelry</a>
          <a href="#">Home</a>
          <a href="#">Clothing</a>
          <a href="#">Sculpture</a>
          <a href="#">Accessories</a>
        </div>
        <div>
          <h4>Info</h4>
          <a href="#">Buyer FAQ</a>
          <a href="#">Seller FAQ</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div>
          <h4>About</h4>
          <a href="#">The Movement</a>
          <a href="#">Our Commitment</a>
          <a href="#">Village Council</a>
        </div>
      </div>
      <div className="foot-bottom">© {new Date().getFullYear()} Urban Artisans</div>
    </footer>
  );
}
