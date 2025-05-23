import React from "react";
import ProductCard from "../components/product/ProductItem";
import { useWishlist } from "../utils/hooks/useWishlist";

function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist();

  return (
    <div className="wishlist container">
      <h1>Danh sách sản phẩm yêu thích</h1>
      <div className="wishlist-control">
        <a onClick={clearWishlist}>Xóa Danh Sách Yêu Thích</a>
      </div>
      <div className="product-grid">
        {wishlistItems.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
