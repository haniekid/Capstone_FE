import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/hooks/useUtil';

function MyOrders({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7089/api/Order/user/${currentUser.userID}`
        );

        // Transform the data to match our needs
        const validOrders = Array.isArray(response.data)
          ? response.data.map((item) => {
              const order = item.order || {};
              return {
                orderID: order.orderID || 0,
                status: order.status || 0,
                dateTime: order.dateTime || new Date().toISOString(),
                finalTotal: order.finalTotal || 0,
                shippingMethod: order.shippingMethod || '',
                paymentMethod: order.paymentMethod || '',
                shippingAddress: item.shippingAddress || {},
                orderItems: item.orderItems || [],
              };
            })
          : [];

        setOrders(validOrders);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng');
        setLoading(false);
      }
    };

    if (currentUser && currentUser.userID) {
      fetchOrders();
    }
  }, [currentUser]);

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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const filteredOrders =
    selectedStatus === 'all'
      ? orders
      : orders.filter((order) => order.status.toString() === selectedStatus);

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="loading"> Đang tải danh sách đơn hàng... </div>;
  }

  if (error) {
    return <div className="error-message"> {error} </div>;
  }

  if (orders.length === 0) {
    return <div className="no-orders"> Bạn chưa có đơn hàng nào </div>;
  }

  return (
    <div className="my-orders-container">
      <h1> Đơn Hàng Của Tôi </h1>{' '}
      <div className="order-filters">
        <button
          className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
          onClick={() => {
            setSelectedStatus('all');
            setCurrentPage(1);
          }}
        >
          Tất cả{' '}
        </button>{' '}
        <button
          className={`filter-btn ${selectedStatus === '0' ? 'active' : ''}`}
          onClick={() => {
            setSelectedStatus('0');
            setCurrentPage(1);
          }}
        >
          Chờ xác nhận{' '}
        </button>{' '}
        <button
          className={`filter-btn ${selectedStatus === '1' ? 'active' : ''}`}
          onClick={() => {
            setSelectedStatus('1');
            setCurrentPage(1);
          }}
        >
          Đã xác nhận{' '}
        </button>{' '}
        <button
          className={`filter-btn ${selectedStatus === '2' ? 'active' : ''}`}
          onClick={() => {
            setSelectedStatus('2');
            setCurrentPage(1);
          }}
        >
          Đang giao hàng{' '}
        </button>{' '}
        <button
          className={`filter-btn ${selectedStatus === '3' ? 'active' : ''}`}
          onClick={() => {
            setSelectedStatus('3');
            setCurrentPage(1);
          }}
        >
          Đã giao hàng{' '}
        </button>{' '}
        <button
          className={`filter-btn ${selectedStatus === '4' ? 'active' : ''}`}
          onClick={() => {
            setSelectedStatus('4');
            setCurrentPage(1);
          }}
        >
          Đã hủy{' '}
        </button>{' '}
      </div>{' '}
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th> Mã đơn hàng </th> <th> Ngày đặt </th> <th> Trạng thái </th>{' '}
              <th> Tổng tiền </th> <th> Thao tác </th>{' '}
            </tr>{' '}
          </thead>{' '}
          <tbody>
            {' '}
            {currentOrders.map((order) => (
              <tr key={`order-${order.orderID}`}>
                <td className="order-id"> #{order.orderID} </td>{' '}
                <td className="order-date">
                  {' '}
                  {formatDateTime(order.dateTime)}{' '}
                </td>{' '}
                <td>
                  <span className={`order-status status-${order.status}`}>
                    {' '}
                    {getStatusText(order.status)}{' '}
                  </span>{' '}
                </td>{' '}
                <td className="order-total">
                  {' '}
                  {formatPrice(order.finalTotal || 0)}{' '}
                </td>{' '}
                <td>
                  <Link
                    to={`/order/${order.orderID}`}
                    className="view-detail-btn"
                  >
                    Xem chi tiết{' '}
                  </Link>{' '}
                </td>{' '}
              </tr>
            ))}{' '}
          </tbody>{' '}
        </table>{' '}
      </div>{' '}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Trước{' '}
          </button>{' '}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}{' '}
            </button>
          ))}{' '}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Sau{' '}
          </button>{' '}
        </div>
      )}{' '}
    </div>
  );
}

export default MyOrders;
