import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/hooks/useUtil';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function MyOrders({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: 'dateTime', direction: 'desc' });
  const navigate = useNavigate();

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
        return 'Đã hủy';
      case 1:
        return 'Chờ xác nhận';
      case 2:
        return 'Đã xác nhận';
      case 3:
        return 'Đã thanh toán';
      case 4:
        return 'Đã cọc';
      case 5:
        return 'Đang chuẩn bị';
      case 6:
        return 'Đang giao hàng';
      case 7:
        return 'Đã giao';
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

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedOrders = React.useMemo(() => {
    const sorted = [...filteredOrders];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === 'dateTime') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredOrders, sortConfig]);

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

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
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort('dateTime')} style={{ cursor: 'pointer' }}>
                Ngày đặt{' '}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Trạng thái{' '}
              </th>
              <th>Thành Tiền </th>
            </tr>
          </thead>
          <tbody>
            {' '}
            {currentOrders.map((order, idx) => (
              <tr
                key={order.orderID}
                className="order-row"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/order/${order.orderID}`)}
              >
                <td className="order-id">{idx + 1}</td>
                <td className="order-date">{formatDateTime(order.dateTime)}</td>
                <td><span className={`order-status status-${order.status}`}>{getStatusText(order.status)}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: '#1a73e8' }}>{formatPrice(order.finalTotal)}</td>
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
