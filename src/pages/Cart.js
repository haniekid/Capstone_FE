import React, { useState } from "react";
import CartItems from "../components/cart/CartItem";
import { useCart } from "../utils/hooks/useCart";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/hooks/useUtil";
import { DELIVERY_THRESHOLD } from "../store/reducers/cartSlice";

function CartPage() {
  const {
    discount,
    applyDiscount,
    clearCart,
    items,
    subtotal,
    defaultSubtotal,
    delivery,
    total,
    quantity,
  } = useCart();
  const [discountCode, setDiscountCode] = useState("");

  return (
    <div className="cart flex container">
      <div className="cart-container flex-2">
        <h1>
          Giỏ Hàng{" "}
          {quantity > 0
            ? "(" +
              quantity +
              " " +
              (quantity === 1 ? "sản phẩm" : "sản phẩm") +
              ")"
            : ""}
        </h1>
        {items.length === 0 ? (
          <p>Giỏ hàng của bạn đang trống.</p>
        ) : (
          <div className="cart-items">
            <CartItems />
            <a onClick={clearCart}>Xóa Giỏ Hàng</a>
          </div>
        )}
      </div>
      {quantity > 0 && (
        <div className="cart-summary">
          <div className="summary-content">
            <h2>Tổng Quan</h2>
            <div className="space-between">
              <p>Tạm Tính</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            {discount > 0 && (
              <div className="space-between">
                <p>Giảm Giá</p>
                <p>-10%</p>
              </div>
            )}
            <div className="space-between">
              <p>Phí Vận Chuyển</p>
              <p>{delivery ? delivery : "Miễn Phí"}</p>
            </div>
            <div className="line"></div>
            <div className="space-between bold">
              <p>Tổng Cộng</p>
              <p>{formatPrice(total)}</p>
            </div>
            <Link to="/checkout">
              <button>THANH TOÁN</button>
            </Link>
            {defaultSubtotal < DELIVERY_THRESHOLD ? (
              <p>
                Mua thêm {formatPrice(DELIVERY_THRESHOLD - defaultSubtotal)} để
                được miễn phí vận chuyển!
              </p>
            ) : (
              <p>Đơn hàng của bạn đủ điều kiện để được miễn phí vận chuyển.</p>
            )}
          </div>
          {!discount > 0 && (
            <div className="discount-code">
              <input
                placeholder="Mã Giảm Giá"
                type="text"
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={() => applyDiscount(discountCode)}>
                Áp Dụng
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CartPage;
