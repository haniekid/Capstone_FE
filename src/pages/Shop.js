import React from "react";
import ProductGrid from "../components/product/ProductList";
import "../styles/shop.scss";

function Shop() {
  return (
    <div className="shop-page">
      <div className="shop-content-container">
        <ProductGrid />
      </div>
    </div>
  );
}

export default Shop;
