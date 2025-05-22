import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/orders.scss";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../components/account/AccountMenu";
import orderApi from "../utils/api/orderApi";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const [openStatusMenu, setOpenStatusMenu] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://localhost:7089/api/Order");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Đã hủy";
      case 1:
        return "Đang xử lý";
      case 2:
        return "Đã xác nhận";
      case 3:
        return "Đang chuẩn bị";
      case 4:
        return "Đang giao hàng";
      case 5:
        return "Đã giao hàng";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#dc3545"; // Đỏ - Đã hủy
      case 1:
        return "#ffc107"; // Vàng - Đang xử lý
      case 2:
        return "#0dcaf0"; // Xanh dương nhạt - Đã xác nhận
      case 3:
        return "#6f42c1"; // Tím - Đang chuẩn bị
      case 4:
        return "#0d6efd"; // Xanh dương - Đang giao hàng
      case 5:
        return "#198754"; // Xanh lá - Đã giao hàng
      default:
        return "#6c757d";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig.key !== null) {
      sortableOrders.sort((a, b) => {
        if (sortConfig.key === "dateTime") {
          return sortConfig.direction === "asc"
            ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
            : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  const filteredOrders = sortedOrders.filter((order) => {
    const matchesSearch =
      !filterValue || order.orderID.toString().includes(filterValue);
    const matchesStatus =
      statusFilter === null || order.status === statusFilter;
    const orderDate = new Date(order.dateTime);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59); // Đặt thời gian kết thúc là cuối ngày
    const matchesDate = orderDate >= startDate && orderDate <= endDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const statusButtons = [
    { status: 0, text: "Đã hủy" },
    { status: 1, text: "Đang xử lý" },
    { status: 2, text: "Đã xác nhận" },
    { status: 3, text: "Đang chuẩn bị" },
    { status: 4, text: "Đang giao hàng" },
    { status: 5, text: "Đã giao hàng" },
  ];

  // Tính số lượng đơn hàng cho mỗi trạng thái
  const getStatusCount = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  // Thêm logic chuyển trạng thái hợp lệ
  const allowedTransitions = {
    1: [2, 0], // Đang xử lý -> Đã xác nhận, Đã hủy
    2: [3, 0, 1], // Đã xác nhận -> Đang chuẩn bị, Đã hủy, Đang xử lý (quay lại)
    3: [4, 0, 2], // Đang chuẩn bị -> Đang giao hàng, Đã hủy, Đã xác nhận (quay lại)
    4: [5, 0, 3], // Đang giao hàng -> Đã giao hàng, Đã hủy, Đang chuẩn bị (quay lại)
  };

  const handleStatusClick = (orderId) => {
    setOpenStatusMenu(orderId);
  };

  const handleStatusSelect = async (order, newStatus) => {
    setOpenStatusMenu(null);
    if (order.status === newStatus) return;
    try {
      await orderApi.updateOrderStatus(order.orderID, newStatus);
      fetchOrders();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".status-menu")) {
        setOpenStatusMenu(null);
      }
    };

    if (openStatusMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Dù có add hay không, luôn luôn remove để tránh memory leak
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openStatusMenu]);

  return (
    <div className="container account">
      <AccountMenu />
      <div className="admin-orders">
        <div className="order-header">
          <h1 className="product-title">Quản Lý Đơn Hàng</h1>
        </div>
        <div className="orders-management">
          <div className="filter-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="date-filter">
              <div className="date-input-group">
                <label>Từ ngày:</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  max={dateRange.endDate}
                />
              </div>
              <div className="date-input-group">
                <label>Đến ngày:</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  min={dateRange.startDate}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="status-filters">
              <button
                className={`status-btn ${statusFilter === null ? "active" : ""}`}
                onClick={() => setStatusFilter(null)}
              >
                Tất cả ({orders.length})
              </button>
              {statusButtons.map((btn) => (
                <button
                  key={btn.status}
                  className={`status-btn ${statusFilter === btn.status ? "active" : ""}`}
                  onClick={() => setStatusFilter(btn.status)}
                  style={{
                    backgroundColor:
                      statusFilter === btn.status
                        ? getStatusColor(btn.status)
                        : "transparent",
                    color:
                      statusFilter === btn.status
                        ? "white"
                        : getStatusColor(btn.status),
                    borderColor: getStatusColor(btn.status),
                  }}
                >
                  {btn.text}: {getStatusCount(btn.status)}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("orderID")}
                    className="sortable"
                  >
                    Mã đơn hàng{" "}
                    {sortConfig.key === "orderID" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("status")} className="sortable">
                    Trạng thái{" "}
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => handleSort("paymentMethod")}
                    className="sortable"
                  >
                    Phương thức thanh toán{" "}
                    {sortConfig.key === "paymentMethod" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => handleSort("shippingMethod")}
                    className="sortable"
                  >
                    Phương thức vận chuyển{" "}
                    {sortConfig.key === "shippingMethod" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => handleSort("finalTotal")}
                    className="sortable"
                  >
                    Tổng tiền{" "}
                    {sortConfig.key === "finalTotal" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => handleSort("dateTime")}
                    className="sortable"
                  >
                    Ngày đặt{" "}
                    {sortConfig.key === "dateTime" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order) => (
                  <tr key={order.orderID}>
                    <td>#{order.orderID}</td>
                    <td style={{ position: "relative" }}>
                      <span
                        className={`status status-${order.status}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleStatusClick(order.orderID)}
                      >
                        {getStatusText(order.status)}
                      </span>
                      {openStatusMenu === order.orderID && (
                        <div
                          className="status-menu"
                          style={{
                            position: "absolute",
                            zIndex: 10,
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: 6,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            top: 32,
                            left: 0,
                          }}
                        >
                          {(allowedTransitions[order.status] || [])
                            .filter((st) => st !== order.status)
                            .map((st) => (
                              <div
                                key={st}
                                style={{
                                  padding: "8px 16px",
                                  cursor: "pointer",
                                  color: st === 0 ? "#dc3545" : "#222",
                                  fontWeight: st === 0 ? 600 : undefined,
                                }}
                                onClick={() => handleStatusSelect(order, st)}
                              >
                                {getStatusText(st)}
                              </div>
                            ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {order.paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : "VNPay"}
                    </td>
                    <td>
                      {order.shippingMethod === "store"
                        ? "Nhận tại cửa hàng"
                        : "Giao hàng tận nơi"}
                    </td>
                    <td>{formatPrice(order.finalTotal)}</td>
                    <td>{formatDate(order.dateTime)}</td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => handleViewOrderDetails(order.orderID)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-btn ${currentPage === number ? "active" : ""}`}
                  >
                    {number}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;
