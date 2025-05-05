import React from "react";
import ProductGrid from "../components/product/ProductList";
import "../styles/shop.scss";

function Shop() {
  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div className="shop-hero-overlay">
          <h1>Discover Vietnamese Flavors</h1>
          <p>Explore our featured dishes and best sellers</p>
        </div>
      </section>
      <div className="shop-content-container">
        <ProductGrid />
      </div>
    </div>
  );
}

export default Shop;
