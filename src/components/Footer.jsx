import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="foot-columns">

        <div>
          <h4>Info</h4>
          <Link to="/buyer-faq">Buyer FAQ</Link>
          <Link to="/seller-faq">Seller FAQ</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>

        <div>
          <h4>About</h4>
          <Link to="/about">The Movement</Link>
          <Link to="/about">Our Commitment</Link>
          <Link to="/about">Village Council</Link>
        </div>

      </div>

      <div className="foot-bottom">
        © {new Date().getFullYear()} Urban Artisans
      </div>
    </footer>
  );
}