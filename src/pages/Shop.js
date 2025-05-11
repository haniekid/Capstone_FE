import React from "react";
import ProductGrid from "../components/product/ProductList";
import "../styles/shop.scss";

function Shop() {
  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div className="shop-hero-overlay">
          <h1> Khám Phá Hương Vị Việt Nam </h1>{" "}
          <p> Khám phá các món ăn đặc trưng và bán chạy nhất của chúng tôi </p>{" "}
        </div>{" "}
      </section>{" "}
      <div className="shop-content-container">
        <ProductGrid />
      </div>{" "}
    </div>
  );
}

export default Shop;
