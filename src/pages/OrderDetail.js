import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatPrice } from '../utils/hooks/useUtil';
import '../styles/account.css';
import { FaArrowLeft } from 'react-icons/fa';

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setIsAdmin(user.roleName === 'Admin');
        }
      } catch (err) {
        console.error('Error checking admin role:', err);
      }
    };

    checkAdminRole();
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7089/api/Order/order/${orderId}`
        );
        setOrder(response.data);
      } catch (err) {
        setError('Không thể tải thông tin đơn hàng');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleBack = () => {
    if (isAdmin) {
      navigate('/admin/orders');
    } else {
      navigate('/account');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Đã hủy';
      case 1:
        return 'Đang xử lý';
      case 2:
        return 'Đã xác nhận';
      case 3:
        return 'Đang chuẩn bị';
      case 4:
        return 'Đang giao hàng';
      case 5:
        return 'Đã giao hàng';
      default:
        return 'Không xác định';
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading"> Đang tải thông tin đơn hàng... </div>;
  }

  if (error) {
    return <div className="error-message"> {error} </div>;
  }

  if (!order) {
    return <div className="no-orders"> Không tìm thấy thông tin đơn hàng </div>;
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <div className="header-left">
          <button onClick={handleBack} className="back-link">
            <FaArrowLeft style={{ marginRight: 6 }} /> Quay lại
          </button>
          <h1> Chi tiết đơn hàng# {order.order.orderID} </h1>{' '}
        </div>{' '}
        <div className={`order-status status-${order.order.status}`}>
          {' '}
          {getStatusText(order.order.status)}{' '}
        </div>{' '}
      </div>
      <div className="order-detail-content">
        <div className="order-info-section">
          <div className="info-card">
            <h2> Thông tin đơn hàng </h2>{' '}
            <div className="info-grid">
              <div className="info-item">
                <span className="label"> Mã đơn hàng: </span>{' '}
                <span className="value"> #{order.order.orderID} </span>{' '}
              </div>{' '}
              <div className="info-item">
                <span className="label"> Ngày đặt: </span>{' '}
                <span className="value">
                  {' '}
                  {formatDateTime(order.order.dateTime)}{' '}
                </span>{' '}
              </div>{' '}
              <div className="info-item">
                <span className="label"> Phương thức thanh toán: </span>{' '}
                <span className="value">
                  {' '}
                  {order.order.paymentMethod === 'vnpay'
                    ? `VNPay (${order.order.vnpayOption}%)`
                    : 'Thanh toán khi nhận hàng'}{' '}
                </span>{' '}
              </div>{' '}
              <div className="info-item">
                <span className="label"> Phương thức giao hàng: </span>{' '}
                <span className="value">
                  {' '}
                  {order.order.shippingMethod === 'home'
                    ? 'Giao hàng tận nơi'
                    : 'Nhận tại cửa hàng'}{' '}
                </span>{' '}
              </div>{' '}
              {order.order.note && (
                <div className="info-item">
                  <span className="label"> Ghi chú: </span>{' '}
                  <span className="value"> {order.order.note} </span>{' '}
                </div>
              )}{' '}
            </div>{' '}
          </div>
          <div className="info-card">
            <h2> Địa chỉ giao hàng </h2>{' '}
            <div className="address-info">
              <p className="address-detail">
                {' '}
                {order.shippingAddress.addressDetail}{' '}
              </p>{' '}
              <p className="address-location">
                {' '}
                {order.shippingAddress.wardName},{' '}
                {order.shippingAddress.districtName}{' '}
              </p>{' '}
              <p className="address-province">
                {' '}
                {order.shippingAddress.province}{' '}
              </p>{' '}
            </div>{' '}
          </div>{' '}
        </div>
        <div className="order-items-section">
          <h2> Sản phẩm </h2>{' '}
          <div className="items-list">
            {' '}
            {order.orderItems.map((item) => (
              <div key={item.orderItemId} className="order-item">
                <div className="item-info">
                  <h3> {item.productName} </h3>{' '}
                  <div className="item-details">
                    <span className="quantity">
                      {' '}
                      Số lượng: {item.quantity}{' '}
                    </span>{' '}
                    <span className="price">
                      {' '}
                      {formatPrice(item.price)}{' '}
                    </span>{' '}
                  </div>{' '}
                </div>{' '}
                <div className="item-total">
                  {' '}
                  {formatPrice(item.totalPrice)}{' '}
                </div>{' '}
              </div>
            ))}{' '}
          </div>
          <div className="order-summary">
            <div className="summary-row">
              <span> Tạm tính </span>{' '}
              <span> {formatPrice(order.order.subtotal)} </span>{' '}
            </div>{' '}
            {order.order.discountCode && (
              <div className="summary-row">
                <span> Giảm giá({order.order.discountCode}) </span>{' '}
                <span>
                  {' '}
                  -
                  {formatPrice(
                    order.order.subtotal - order.order.finalTotal
                  )}{' '}
                </span>{' '}
              </div>
            )}{' '}
            <div className="summary-row">
              <span> Phí vận chuyển </span>{' '}
              <span> {formatPrice(order.order.shippingFee)} </span>{' '}
            </div>{' '}
            <div className="summary-row total">
              <span> Tổng cộng </span>{' '}
              <span> {formatPrice(order.order.finalTotal)} </span>{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}

export default OrderDetail;
