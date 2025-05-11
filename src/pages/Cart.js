import React, { useState, useEffect } from 'react';
import CartItems from '../components/cart/CartItem';
import { useCart } from '../utils/hooks/useCart';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/hooks/useUtil';
import { DELIVERY_THRESHOLD } from '../store/reducers/cartSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getTotal } from '../store/reducers/cartSlice';
import ShippingAddressForm from '../components/cart/ShippingAddressForm';

const GHN_TOKEN = '7aae38b4-2b1d-11f0-afab-c2dd849a5f98';
const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api';
const HANOI_PROVINCE_ID = 201;

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
  const auth = useSelector((state) => state.auth);
  const currentUser =
    (auth && auth.user) || JSON.parse(localStorage.getItem('user') || 'null');
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [shippingMethod, setShippingMethod] = useState('home'); // 'home' hoặc 'store'
  const [paymentMethod, setPaymentMethod] = useState('vnpay'); // 'vnpay' hoặc 'cod'
  const [vnpayOption, setVnpayOption] = useState('50'); // '50' hoặc '100'
  const [deliveryFeeFromAPI, setDeliveryFeeFromAPI] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  // Placeholder states for new form fields
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    note: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    districtId: '',
    districtName: '',
    wardCode: '',
    wardName: '',
    addressDetail: '',
  });

  // States for address form
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [address, setAddress] = useState('');

  const userId = currentUser ? currentUser.userID : null;

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDistrictChange = (e) => {
    const newDistrictId = e.target.value;
    setSelectedDistrict(newDistrictId);
    setSelectedWard('');
    setWards([]);

    // Update shipping address
    const districtObj = districts.find(
      (d) => d.DistrictID.toString() === newDistrictId
    );
    setShippingAddress((prev) => ({
      ...prev,
      districtId: newDistrictId,
      districtName: districtObj ? districtObj.DistrictName : '',
      wardCode: '',
      wardName: '',
    }));

    // Reset shipping fee when district changes
    setDeliveryFeeFromAPI(0);
  };

  const handleWardChange = (e) => {
    const newWardCode = e.target.value;
    setSelectedWard(newWardCode);

    // Update shipping address
    const wardObj = wards.find((w) => w.WardCode === newWardCode);
    setShippingAddress((prev) => ({
      ...prev,
      wardCode: newWardCode,
      wardName: wardObj ? wardObj.WardName : '',
    }));

    // Calculate shipping fee when ward is selected
    if (newWardCode && selectedDistrict) {
      calculateShippingFee(selectedDistrict, newWardCode);
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setShippingAddress((prev) => ({
      ...prev,
      addressDetail: newAddress,
    }));
  };

  // Add function to calculate shipping fee
  const calculateShippingFee = async (districtId, wardCode) => {
    try {
      const response = await axios.post(
        `${GHN_API_URL}/v2/shipping-order/fee`,
        {
          service_type_id: 2, // Giao hàng nhanh
          insurance_value: subtotalAfterDiscount,
          from_district_id: 1454, // Quận Cầu Giấy
          from_ward_code: '20109', // Phường Dịch Vọng
          to_district_id: parseInt(districtId),
          to_ward_code: wardCode,
          height: 10,
          length: 10,
          weight: 500,
          width: 10,
        },
        {
          headers: {
            token: GHN_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 200) {
        const fee = response.data.data.total;
        const rounded = Math.floor(fee / 1000) * 1000;
        setDeliveryFeeFromAPI(rounded);
        if (shippingMethod === 'home') {
          setShippingFee(rounded);
        }
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
    }
  };

  // Fetch districts of Hanoi when component mounts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          `${GHN_API_URL}/master-data/district`,
          {
            headers: {
              token: GHN_TOKEN,
            },
            params: {
              province_id: HANOI_PROVINCE_ID,
            },
          }
        );
        if (response.data.code === 200) {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) return;
      try {
        const response = await axios.get(`${GHN_API_URL}/master-data/ward`, {
          headers: {
            token: GHN_TOKEN,
          },
          params: {
            district_id: selectedDistrict,
          },
        });
        if (response.data.code === 200) {
          setWards(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  // Update useEffect for user data to calculate shipping fee
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId && (!form.email || !form.name || !form.phone)) {
          const response = await axios.get(
            `https://localhost:7089/api/User/${userId}`
          );
          if (response.status === 200) {
            const userData = response.data;
            console.log('User data from API:', userData);

            // Update form data
            setForm({
              email: userData.email || '',
              name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
              phone: userData.phone || '',
              note: '',
            });

            // Update address form data
            if (
              userData.districtID ||
              userData.wardCode ||
              userData.addressDetail
            ) {
              setSelectedDistrict(
                userData.districtID ? userData.districtID.toString() : ''
              );
              setSelectedWard(userData.wardCode || '');
              setAddress(userData.addressDetail || '');

              // Update shipping address
              const addressData = {
                districtId: userData.districtID
                  ? userData.districtID.toString()
                  : '',
                districtName: '',
                wardCode: userData.wardCode || '',
                wardName: '',
                addressDetail: userData.addressDetail || '',
              };

              // Find district name
              const districtObj = districts.find(
                (d) => d.DistrictID.toString() === addressData.districtId
              );
              if (districtObj) {
                addressData.districtName = districtObj.DistrictName;
              }

              // Find ward name
              const wardObj = wards.find(
                (w) => w.WardCode === addressData.wardCode
              );
              if (wardObj) {
                addressData.wardName = wardObj.WardName;
              }

              console.log('Setting shipping address with:', addressData);
              setShippingAddress(addressData);

              // Calculate shipping fee if we have both district and ward
              if (userData.districtID && userData.wardCode) {
                calculateShippingFee(
                  userData.districtID.toString(),
                  userData.wardCode
                );
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, form.email, form.name, form.phone, districts, wards]);

  // Add a new useEffect to log shipping address changes
  useEffect(() => {
    console.log('Current shipping address:', shippingAddress);
  }, [shippingAddress]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá');
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
        setDiscountError('Mã giảm giá không hợp lệ');
        return;
      }

      // Validate discount
      const now = new Date();
      const startDate = new Date(discountData.startDate);
      const endDate = discountData.endDate
        ? new Date(discountData.endDate)
        : null;

      if (now < startDate) {
        setDiscountError('Mã giảm giá chưa có hiệu lực');
        return;
      }

      if (endDate && now > endDate) {
        setDiscountError('Mã giảm giá đã hết hạn');
        return;
      }

      if (!discountData.isActive) {
        setDiscountError('Mã giảm giá không còn hiệu lực');
        return;
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (discountData.discountType === 'Percentage') {
        discountAmount = (defaultSubtotal * discountData.discountValue) / 100;
      } else if (discountData.discountType === 'FixedAmount') {
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
      setDiscountCode('');
    } catch (error) {
      setDiscountError('Mã giảm giá không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    applyDiscount('', 0);
    setDiscountInfo(null);
    setDiscountError(null);
    dispatch(getTotal());
  };

  // Callback để nhận phí vận chuyển từ ShippingAddressForm
  const handleShippingFeeChange = (fee) => {
    const rounded = Math.floor(fee / 1000) * 1000;
    setDeliveryFeeFromAPI(rounded);
    if (shippingMethod === 'home') setShippingFee(rounded);
  };

  // Tính phí vận chuyển dựa vào shippingMethod
  const subtotalAfterDiscount = discountInfo
    ? discountInfo.type === 'Percentage'
      ? (Number(defaultSubtotal) || 0) -
        ((Number(defaultSubtotal) || 0) * (Number(discountInfo.value) || 0)) /
          100
      : (Number(defaultSubtotal) || 0) - (Number(discountInfo.value) || 0)
    : Number(defaultSubtotal) || 0;
  const totalAmount = subtotalAfterDiscount + shippingFee;
  const discount100 =
    vnpayOption === '100' && paymentMethod === 'vnpay' ? totalAmount * 0.05 : 0;
  const finalTotal = totalAmount - discount100;

  useEffect(() => {
    if (shippingMethod === 'store') {
      setShippingFee(0);
    } else if (shippingMethod === 'home') {
      setShippingFee(deliveryFeeFromAPI);
    }
  }, [shippingMethod, deliveryFeeFromAPI]);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        Order: {
          OrderID: 0,
          Status: 0,
          UserID: currentUser ? Number(currentUser.userID) : 0,
          DiscountCode: discountInfo ? discountInfo.code : '',
          ShippingMethod: shippingMethod,
          ShippingFee: shippingFee,
          PaymentMethod: paymentMethod,
          VnpayOption: vnpayOption,
          Subtotal: defaultSubtotal,
          FinalTotal: finalTotal,
          DateTime: new Date().toISOString(),
          Note: form.note || '',
        },
        ShippingAddress: {
          Province: 'Hà Nội',
          DistrictId: shippingAddress.districtId,
          DistrictName: shippingAddress.districtName,
          WardCode: shippingAddress.wardCode,
          WardName: shippingAddress.wardName,
          AddressDetail: shippingAddress.addressDetail,
        },
        OrderItems: items.map((item) => {
          console.log('Full item:', item);
          console.log('Product:', item.product);
          console.log('ProductPriceID:', item.product.productPriceID);

          // Try to get productId from different possible locations
          let productId = 0;
          if (item.product.productPriceID) {
            if (typeof item.product.productPriceID === 'object') {
              productId =
                item.product.productPriceID.id ||
                item.product.productPriceID.productId ||
                item.product.productPriceID.productID ||
                0;
            } else {
              productId = Number(item.product.productPriceID) || 0;
            }
          } else if (item.product.id) {
            productId = Number(item.product.id) || 0;
          }

          console.log('Extracted productId:', productId);

          return {
            ProductId: productId,
            ProductName: item.product.name,
            Quantity: Number(item.quantity),
            Price: Number(item.price),
            TotalPrice: Number(item.price * item.quantity),
          };
        }),
      };

      // Log for debugging
      console.log('Order Data:', JSON.stringify(orderData, null, 2));
      console.log('Current User:', currentUser);
      console.log('Discount Info:', discountInfo);
      console.log('Shipping Method:', shippingMethod);
      console.log('Payment Method:', paymentMethod);
      console.log('Vnpay Option:', vnpayOption);

      // Validate required fields
      if (!form.email || !form.name || !form.phone) {
        alert('Vui lòng điền đầy đủ thông tin người nhận hàng');
        return;
      }

      if (
        shippingMethod === 'home' &&
        (!shippingAddress.districtId || !shippingAddress.wardCode)
      ) {
        alert('Vui lòng chọn địa chỉ giao hàng');
        return;
      }

      if (items.length === 0) {
        alert('Giỏ hàng trống');
        return;
      }

      // Call API to create payment URL
      console.log(
        'Sending request to:',
        'https://localhost:7089/api/Pay/CreatePaymentUrl'
      );
      const response = await axios.post(
        'https://localhost:7089/api/Pay/CreatePaymentUrl',
        orderData
      );

      console.log('Response data:', response.data);

      // Check if response.data is a string (URL) or an object with URL
      let paymentUrl = null;
      if (typeof response.data === 'string') {
        paymentUrl = response.data;
      } else if (
        response.data &&
        (response.data.url || response.data.paymentUrl)
      ) {
        paymentUrl = response.data.url || response.data.paymentUrl;
      }

      if (paymentUrl) {
        // Nếu là thanh toán online, redirect sang paymentUrl
        window.location.href = paymentUrl;
      } else {
        // Nếu không có paymentUrl (COD hoặc đã thanh toán xong), chuyển sang trang thành công
        window.location.href = '/order-success';
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response && error.response.data,
        status: error.response && error.response.status,
        headers: error.response && error.response.headers,
      });
      alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="cart-checkout-page">
      <div className="checkout-4col-container">
        {' '}
        {/* 1. Thông tin nhận hàng */}{' '}
        <div className="checkout-col info-col">
          <h2 className="checkout-section-title"> Thông tin nhận hàng </h2>{' '}
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
            </div>{' '}
            <textarea
              name="note"
              placeholder="Ghi chú (tùy chọn)"
              value={form.note}
              onChange={handleFormChange}
              rows={2}
            />{' '}
          </form>{' '}
        </div>{' '}
        {/* 2. Địa chỉ giao hàng */}{' '}
        <div className="checkout-col address-col">
          <h2 className="checkout-section-title"> Địa chỉ giao hàng </h2>{' '}
          <div className="shipping-address-form">
            <div className="form-group">
              <label className="input-label">
                Tỉnh / Thành phố{' '}
                <div className="input-wrapper">
                  <input
                    type="text"
                    value="Hà Nội"
                    disabled
                    className="styled-input"
                  />
                </div>{' '}
              </label>{' '}
            </div>{' '}
            <div className="form-group">
              <label className="input-label">
                Quận / Huyện{' '}
                <div className="input-wrapper">
                  <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="styled-select"
                  >
                    <option value=""> Chọn Quận / Huyện </option>{' '}
                    {districts.map((district) => (
                      <option
                        key={district.DistrictID}
                        value={district.DistrictID}
                      >
                        {' '}
                        {district.DistrictName}{' '}
                      </option>
                    ))}{' '}
                  </select>{' '}
                </div>{' '}
              </label>{' '}
            </div>{' '}
            <div className="form-group">
              <label className="input-label">
                Phường / Xã{' '}
                <div className="input-wrapper">
                  <select
                    value={selectedWard}
                    onChange={handleWardChange}
                    className="styled-select"
                    disabled={!selectedDistrict}
                  >
                    <option value=""> Chọn Phường / Xã </option>{' '}
                    {wards.map((ward) => (
                      <option key={ward.WardCode} value={ward.WardCode}>
                        {' '}
                        {ward.WardName}{' '}
                      </option>
                    ))}{' '}
                  </select>{' '}
                </div>{' '}
              </label>{' '}
            </div>{' '}
            <div className="form-group">
              <label className="input-label">
                Địa chỉ chi tiết{' '}
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Nhập địa chỉ chi tiết"
                    className="styled-input"
                  />
                </div>{' '}
              </label>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
        {/* 3. Vận chuyển & Thanh toán */}{' '}
        <div className="checkout-col method-col">
          <h2 className="checkout-section-title"> Vận chuyển </h2>{' '}
          <div className="checkout-shipping-method">
            <div
              className={`shipping-option${
                shippingMethod === 'home' ? ' selected' : ''
              }`}
              onClick={() => setShippingMethod('home')}
            >
              <input
                type="radio"
                name="shipping"
                value="home"
                checked={shippingMethod === 'home'}
                onChange={() => setShippingMethod('home')}
                className="shipping-radio"
              />
              <span className="shipping-label"> Giao Hàng Tận Nơi </span>{' '}
              <span className="shipping-fee">
                {' '}
                {deliveryFeeFromAPI === 0
                  ? '0đ'
                  : formatPrice(deliveryFeeFromAPI)}{' '}
              </span>{' '}
            </div>{' '}
            <div
              className={`shipping-option${
                shippingMethod === 'store' ? ' selected' : ''
              }`}
              onClick={() => setShippingMethod('store')}
            >
              <input
                type="radio"
                name="shipping"
                value="store"
                checked={shippingMethod === 'store'}
                onChange={() => setShippingMethod('store')}
                className="shipping-radio"
              />
              <span className="shipping-label"> Đến cửa hàng nhận đơn </span>{' '}
              <span className="shipping-fee"> 0 đ </span>{' '}
            </div>{' '}
          </div>{' '}
          <h2 className="checkout-section-title" style={{ marginTop: 24 }}>
            Thanh toán{' '}
          </h2>{' '}
          <div className="checkout-payment-method">
            <div
              className={`payment-option${
                paymentMethod === 'vnpay' ? ' selected' : ''
              }`}
              onClick={() => setPaymentMethod('vnpay')}
            >
              <input
                type="radio"
                name="payment"
                value="vnpay"
                checked={paymentMethod === 'vnpay'}
                onChange={() => setPaymentMethod('vnpay')}
                className="payment-radio"
              />
              <span className="payment-label"> Thanh toán qua VNPay </span>{' '}
            </div>{' '}
            {paymentMethod === 'vnpay' && (
              <div className="vnpay-options">
                <label>
                  <input
                    type="radio"
                    name="vnpayOption"
                    value="50"
                    checked={vnpayOption === '50'}
                    onChange={() => setVnpayOption('50')}
                  />
                  Thanh toán trước 50 %
                </label>{' '}
                <label>
                  <input
                    type="radio"
                    name="vnpayOption"
                    value="100"
                    checked={vnpayOption === '100'}
                    onChange={() => setVnpayOption('100')}
                  />
                  Thanh toán 100 % (giảm 5 % tổng giá trị đơn hàng){' '}
                </label>{' '}
              </div>
            )}{' '}
            {totalAmount <= 300000 && (
              <div
                className={`payment-option${
                  paymentMethod === 'cod' ? ' selected' : ''
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="payment-radio"
                />
                <span className="payment-label">
                  {' '}
                  Thanh toán khi giao hàng{' '}
                </span>{' '}
              </div>
            )}{' '}
          </div>{' '}
        </div>{' '}
        {/* 4. Đơn hàng & giá & đặt hàng */}{' '}
        <div className="checkout-col order-col">
          <h2 className="checkout-section-title">
            Đơn hàng({items.length}
            sản phẩm){' '}
          </h2>{' '}
          <div className="checkout-cart-items">
            <CartItems />
          </div>{' '}
          <div className="checkout-discount">
            <input
              placeholder="Nhập mã giảm giá"
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={isLoading}
            />{' '}
            <button onClick={handleApplyDiscount} disabled={isLoading}>
              Áp dụng{' '}
            </button>{' '}
            {discountError && (
              <div className="error-message"> {discountError} </div>
            )}{' '}
          </div>{' '}
          <div className="checkout-summary">
            <div className="summary-row">
              <span> Tạm tính </span>{' '}
              <span> {formatPrice(Number(defaultSubtotal) || 0)} </span>{' '}
            </div>{' '}
            {discountInfo && (
              <div className="summary-row">
                <span> Giảm giá({discountInfo.code}) </span>{' '}
                <span>
                  {' '}
                  {discountInfo.type === 'Percentage'
                    ? `- ${discountInfo.value}%`
                    : `- ${formatPrice(Number(discountInfo.value) || 0)}`}{' '}
                </span>{' '}
              </div>
            )}{' '}
            <div className="summary-row">
              <span> Phí vận chuyển </span>{' '}
              <span>
                {' '}
                {shippingFee === 0 ? '0đ' : formatPrice(shippingFee)}{' '}
              </span>{' '}
            </div>{' '}
            {discount100 > 0 && (
              <div className="summary-row">
                <span> Giảm 5 % khi thanh toán 100 % VNPay </span>{' '}
                <span> -{formatPrice(discount100)} </span>{' '}
              </div>
            )}{' '}
            <div className="summary-row total">
              <span> Tổng cộng </span>{' '}
              <span> {formatPrice(finalTotal)} </span>{' '}
            </div>{' '}
          </div>{' '}
          <button className="checkout-btn" onClick={handlePlaceOrder}>
            ĐẶT HÀNG{' '}
          </button>{' '}
          <Link to="/cart" className="back-to-cart">
            & lt; Quay về giỏ hàng{' '}
          </Link>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}

export default CartPage;
