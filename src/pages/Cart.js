import React, { useState } from "react";
import CartItems from "../components/cart/CartItem";
import { useCart } from "../utils/hooks/useCart";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/hooks/useUtil";
import { DELIVERY_THRESHOLD } from "../store/reducers/cartSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getTotal } from "../store/reducers/cartSlice";

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
  const [discountError, setDiscountError] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsLoading(true);
    setDiscountError(null);

    try {
      const response = await axios.get(
        `https://localhost:7089/api/Discount/discount/code/${discountCode}`
      );
      const discountData = response.data;

      if (!discountData) {
        setDiscountError("Mã giảm giá không hợp lệ");
        return;
      }

      // Validate discount
      const now = new Date();
      const startDate = new Date(discountData.startDate);
      const endDate = discountData.endDate
        ? new Date(discountData.endDate)
        : null;

      if (now < startDate) {
        setDiscountError("Mã giảm giá chưa có hiệu lực");
        return;
      }

      if (endDate && now > endDate) {
        setDiscountError("Mã giảm giá đã hết hạn");
        return;
      }

      if (!discountData.isActive) {
        setDiscountError("Mã giảm giá không còn hiệu lực");
        return;
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (discountData.discountType === "Percentage") {
        discountAmount = (defaultSubtotal * discountData.discountValue) / 100;
      } else if (discountData.discountType === "FixedAmount") {
        discountAmount = discountData.discountValue;
      }

      // Apply discount
      applyDiscount(discountCode, discountAmount);
      dispatch(getTotal());
      setDiscountInfo({
        code: discountCode,
        type: discountData.discountType,
        value: discountData.discountValue,
      });
      setDiscountCode("");
    } catch (error) {
      setDiscountError("Mã giảm giá không hợp lệ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    applyDiscount("", 0);
    setDiscountInfo(null);
    setDiscountError(null);
    dispatch(getTotal());
  };

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
              <p>{formatPrice(Number(defaultSubtotal) || 0)}</p>
            </div>
            {discountInfo && (
              <div className="space-between">
                <p>Thành tiền sau giảm</p>
                <p>
                  {formatPrice(
                    (Number(defaultSubtotal) || 0) -
                      (discountInfo.type === "Percentage"
                        ? ((Number(defaultSubtotal) || 0) *
                            (Number(discountInfo.value) || 0)) /
                          100
                        : Number(discountInfo.value) || 0)
                  )}
                </p>
              </div>
            )}
            {discountInfo && (
              <div className="space-between">
                <p>
                  Voucher ({discountInfo.code})
                  <button
                    className="remove-discount-btn small"
                    onClick={handleRemoveDiscount}
                  >
                    Xóa
                  </button>
                </p>
                <p>
                  {discountInfo.type === "Percentage"
                    ? `-${discountInfo.value}%`
                    : `-${formatPrice(Number(discountInfo.value) || 0)}`}
                </p>
              </div>
            )}
            <div className="space-between">
              <p>Phí Vận Chuyển</p>
              <p>{formatPrice(Number(delivery) || 0)}</p>
            </div>
            <div className="line"></div>
            <div className="space-between bold">
              <p>Tổng Cộng</p>
              <p>
                {formatPrice(
                  (Number(defaultSubtotal) || 0) -
                    (discountInfo
                      ? discountInfo.type === "Percentage"
                        ? ((Number(defaultSubtotal) || 0) *
                            (Number(discountInfo.value) || 0)) /
                          100
                        : Number(discountInfo.value) || 0
                      : 0) +
                    (Number(delivery) || 0)
                )}
              </p>
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
          <div className="discount-code">
            <div className="discount-input-group">
              <input
                placeholder="Mã Giảm Giá"
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={isLoading}
              />
              <button onClick={handleApplyDiscount} disabled={isLoading}>
                {isLoading ? "Đang Xử Lý..." : "Áp Dụng"}
              </button>
              {discountError && (
                <div className="error-message">{discountError}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
