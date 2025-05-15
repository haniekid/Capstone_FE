import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";
import { useCart } from "../../utils/hooks/useCart";
import { useWishlist } from "../../utils/hooks/useWishlist";
import { searchProducts } from "../../store/reducers/productSlice";
import MiniCart from "../cart/MiniCart";

function Header() {
  const location = useLocation();
  const { quantity, items, updateQuantity, removeFromCart } = useCart();
  const { wishlistCount } = useWishlist();
  const dispatch = useDispatch();
  const [openMiniCart, setOpenMiniCart] = useState(false);
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isShop = location.pathname === "/shop";

  // Adapter cho MiniCart
  const handleUpdateQty = (id, qty) => {
    const item = items.find((item) => item.product.productID === id);
    if (item) {
      updateQuantity(id, item.size, qty);
    }
  };
  const handleRemove = (id) => {
    const item = items.find((item) => item.product.productID === id);
    if (item) {
      removeFromCart(id, item.size);
    }
  };
  // Chuyển đổi dữ liệu cho MiniCart
  // Thêm log để kiểm tra dữ liệu thực tế
  if (items.length > 0) {
    console.log("Cart item sample:", items[0]);
  }
  const cartItems = items.map((item) => ({
    id: item.product.productID,
    name:
      item.product.productName ||
      item.product.name ||
      item.product.title ||
      "Sản phẩm",
    image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    size: item.size,
  }));

  return (
    <nav>
      <div className="header-second">
        <div className="header-second-msg">
          <p>
            <span> CHẾ BIẾN </span> VỆ SINH, AN TOÀN, HỢP VỆ SINH{" "}
          </p>{" "}
          <p>
            <span> MIỄN PHÍ </span> SHIPPING ĐỐI VỚI HÓA ĐƠN TRÊN 200.000Đ{" "}
          </p>{" "}
          <p>
            <span> GIAO HÀNG </span> NHANH CHÓNG TRONG VÒNG 60 PHÚT{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="header-container">
        <Link className="header-main header-section" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "200px", width: "auto", display: "block" }}
          />{" "}
        </Link>{" "}
        <ul className="header-section">
          <li>
            <Link to="/shop"> CỬA HÀNG </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/contact"> LIÊN HỆ </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/about"> VỀ CHÚNG TÔI </Link>{" "}
          </li>{" "}
        </ul>{" "}
        <div className="header-tools header-section">
          <button
            type="button"
            className="icon-btn"
            onClick={() => navigate("/account")}
          >
            <FontAwesomeIcon icon={icons.user} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => navigate("/wishlist")}
          >
            <FontAwesomeIcon icon={icons.heart} />
            {wishlistCount > 0 && (
              <span className="icon-badge">{wishlistCount > 9 ? "9+" : wishlistCount}</span>
            )}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setOpenMiniCart(true)}
          >
            <FontAwesomeIcon icon={icons.cart} />
            {quantity > 0 && (
              <span className="icon-badge">{quantity > 9 ? "9+" : quantity}</span>
            )}
          </button>
          <div className="burger">
            <FontAwesomeIcon icon={icons.hamburger} />
          </div>
        </div>
      </div>{" "}
      <div className={`header-line ${isHome || isShop ? "active" : ""}`}> </div>{" "}
      <MiniCart
        open={openMiniCart}
        onClose={() => setOpenMiniCart(false)}
        cartItems={cartItems || []}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
      />
    </nav>
  );
}

export default Header;
