import React, { useState, useEffect } from "react";
import CartItems from "../components/cart/CartItem";
import { useCart } from "../utils/hooks/useCart";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/hooks/useUtil";
import { DELIVERY_THRESHOLD } from "../store/reducers/cartSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getTotal } from "../store/reducers/cartSlice";
import ShippingAddressForm from "../components/cart/ShippingAddressForm";

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
  const [shippingMethod, setShippingMethod] = useState("home"); // 'home' hoặc 'store'
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); // 'vnpay' hoặc 'cod'
  const [vnpayOption, setVnpayOption] = useState("50"); // '50' hoặc '100'
  const [deliveryFeeFromAPI, setDeliveryFeeFromAPI] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  // Placeholder states for new form fields
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    note: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    districtId: "",
    districtName: "",
    wardCode: "",
    wardName: "",
    addressDetail: "",
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (address) => {
    setShippingAddress(address);
  };

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

  // Callback để nhận phí vận chuyển từ ShippingAddressForm
  const handleShippingFeeChange = (fee) => {
    const rounded = Math.floor(fee / 1000) * 1000;
    setDeliveryFeeFromAPI(rounded);
    if (shippingMethod === "home") setShippingFee(rounded);
  };

  // Tính phí vận chuyển dựa vào shippingMethod
  const subtotalAfterDiscount = discountInfo
    ? discountInfo.type === "Percentage"
      ? (Number(defaultSubtotal) || 0) -
        ((Number(defaultSubtotal) || 0) * (Number(discountInfo.value) || 0)) /
          100
      : (Number(defaultSubtotal) || 0) - (Number(discountInfo.value) || 0)
    : Number(defaultSubtotal) || 0;
  const totalAmount = subtotalAfterDiscount + shippingFee;
  const discount100 =
    vnpayOption === "100" && paymentMethod === "vnpay" ? totalAmount * 0.05 : 0;
  const finalTotal = totalAmount - discount100;

  useEffect(() => {
    if (shippingMethod === "store") {
      setShippingFee(0);
    } else if (shippingMethod === "home") {
      setShippingFee(deliveryFeeFromAPI);
    }
  }, [shippingMethod, deliveryFeeFromAPI]);

  const handlePlaceOrder = () => {
    const orderData = {
      customer: { ...form },
      shippingAddress: {
        province: "Hà Nội",
        ...shippingAddress,
      },
      shippingMethod,
      shippingFee,
      paymentMethod,
      vnpayOption,
      items: items.map((item) => ({
        productId: item.product.productID,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      })),
      discount: discountInfo
        ? {
            discountCode: discountInfo.code,
            discountType: discountInfo.type,
            discountValue: discountInfo.value,
            discountAmount:
              discountInfo.type === "Percentage"
                ? (defaultSubtotal * discountInfo.value) / 100
                : discountInfo.value,
          }
        : null,
      subtotal: defaultSubtotal,
      finalTotal,
    };
    console.log(orderData);
  };

  return (
    <div className="cart-checkout-page">
      <div className="checkout-4col-container">
        {/* 1. Thông tin nhận hàng */}
        <div className="checkout-col info-col">
          <h2 className="checkout-section-title">Thông tin nhận hàng</h2>
          <form className="checkout-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleFormChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleFormChange}
              required
            />
            <div className="phone-group">
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleFormChange}
                required
              />
              <span className="vn-flag">🇻🇳</span>
            </div>
            <textarea
              name="note"
              placeholder="Ghi chú (tùy chọn)"
              value={form.note}
              onChange={handleFormChange}
              rows={2}
            />
          </form>
        </div>
        {/* 2. Địa chỉ giao hàng */}
        <div className="checkout-col address-col">
          <h2 className="checkout-section-title">Địa chỉ giao hàng</h2>
          <ShippingAddressForm
            hideTitle
            onShippingFeeChange={handleShippingFeeChange}
            shippingMethod={shippingMethod}
            onAddressChange={handleAddressChange}
          />
        </div>
        {/* 3. Vận chuyển & Thanh toán */}
        <div className="checkout-col method-col">
          <h2 className="checkout-section-title">Vận chuyển</h2>
          <div className="checkout-shipping-method">
            <div
              className={`shipping-option${
                shippingMethod === "home" ? " selected" : ""
              }`}
              onClick={() => setShippingMethod("home")}
            >
              <input
                type="radio"
                name="shipping"
                value="home"
                checked={shippingMethod === "home"}
                onChange={() => setShippingMethod("home")}
                className="shipping-radio"
              />
              <span className="shipping-label">Giao Hàng Tận Nơi</span>
              <span className="shipping-fee">
                {deliveryFeeFromAPI === 0
                  ? "0đ"
                  : `${formatPrice(deliveryFeeFromAPI)}`}
              </span>
            </div>
            <div
              className={`shipping-option${
                shippingMethod === "store" ? " selected" : ""
              }`}
              onClick={() => setShippingMethod("store")}
            >
              <input
                type="radio"
                name="shipping"
                value="store"
                checked={shippingMethod === "store"}
                onChange={() => setShippingMethod("store")}
                className="shipping-radio"
              />
              <span className="shipping-label">Đến cửa hàng nhận đơn</span>
              <span className="shipping-fee">0đ</span>
            </div>
          </div>
          <h2 className="checkout-section-title" style={{ marginTop: 24 }}>
            Thanh toán
          </h2>
          <div className="checkout-payment-method">
            <div
              className={`payment-option${
                paymentMethod === "vnpay" ? " selected" : ""
              }`}
              onClick={() => setPaymentMethod("vnpay")}
            >
              <input
                type="radio"
                name="payment"
                value="vnpay"
                checked={paymentMethod === "vnpay"}
                onChange={() => setPaymentMethod("vnpay")}
                className="payment-radio"
              />
              <span className="payment-label">Thanh toán qua VNPay</span>
            </div>
            {paymentMethod === "vnpay" && (
              <div className="vnpay-options">
                <label>
                  <input
                    type="radio"
                    name="vnpayOption"
                    value="50"
                    checked={vnpayOption === "50"}
                    onChange={() => setVnpayOption("50")}
                  />
                  Thanh toán trước 50%
                </label>
                <label>
                  <input
                    type="radio"
                    name="vnpayOption"
                    value="100"
                    checked={vnpayOption === "100"}
                    onChange={() => setVnpayOption("100")}
                  />
                  Thanh toán 100% (giảm 5% tổng giá trị đơn hàng)
                </label>
              </div>
            )}
            {totalAmount <= 300000 && (
              <div
                className={`payment-option${
                  paymentMethod === "cod" ? " selected" : ""
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="payment-radio"
                />
                <span className="payment-label">Thanh toán khi giao hàng</span>
              </div>
            )}
          </div>
        </div>
        {/* 4. Đơn hàng & giá & đặt hàng */}
        <div className="checkout-col order-col">
          <h2 className="checkout-section-title">
            Đơn hàng ({items.length} sản phẩm)
          </h2>
          <div className="checkout-cart-items">
            <CartItems />
          </div>
          <div className="checkout-discount">
            <input
              placeholder="Nhập mã giảm giá"
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={isLoading}
            />
            <button onClick={handleApplyDiscount} disabled={isLoading}>
              Áp dụng
            </button>
            {discountError && (
              <div className="error-message">{discountError}</div>
            )}
          </div>
          <div className="checkout-summary">
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{formatPrice(Number(defaultSubtotal) || 0)}</span>
            </div>
            {discountInfo && (
              <div className="summary-row">
                <span>Giảm giá ({discountInfo.code})</span>
                <span>
                  {discountInfo.type === "Percentage"
                    ? `- ${discountInfo.value}%`
                    : `- ${formatPrice(Number(discountInfo.value) || 0)}`}
                </span>
              </div>
            )}
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>
                {shippingFee === 0 ? "0đ" : `${formatPrice(shippingFee)}`}
              </span>
            </div>
            {discount100 > 0 && (
              <div className="summary-row">
                <span>Giảm 5% khi thanh toán 100% VNPay</span>
                <span>-{formatPrice(discount100)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Tổng cộng</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <button className="checkout-btn" onClick={handlePlaceOrder}>
            ĐẶT HÀNG
          </button>
          <Link to="/cart" className="back-to-cart">
            &lt; Quay về giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
