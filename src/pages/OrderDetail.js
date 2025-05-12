import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { formatPrice } from '../utils/hooks/useUtil';

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đang giao hàng';
      case 3:
        return 'Đã giao hàng';
      case 4:
        return 'Đã hủy';
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
          <Link to="/account" className="back-link">
            & lt; Quay lại{' '}
          </Link>{' '}
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
