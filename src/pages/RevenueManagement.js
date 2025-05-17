import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { formatCurrency } from "../utils/format";
import AccountMenu from "../components/account/AccountMenu";
import "../styles/admin.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueManagement = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filteredOrderItems, setFilteredOrderItems] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    averageOrderValue: 0,
    totalProductsSold: 0,
    bestSellingCategory: "",
  });
  const [peakTimeData, setPeakTimeData] = useState({
    timeRange: '',
    orderCount: 0,
    percentage: 0
  });

  useEffect(() => {
    // Set default date range to last month
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(lastMonth.toISOString().split('T')[0]);
    
    fetchData();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      console.log('Fetching details for user ID:', userId); // Debug log
      const response = await axios.get(`https://localhost:7089/api/User/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, orderItemsResponse] = await Promise.all([
        axios.get("https://localhost:7089/api/Order"),
        axios.get("https://localhost:7089/api/OrderItem")
      ]);
      
      console.log('All orders:', ordersResponse.data); // Debug log
      console.log('All order items:', orderItemsResponse.data); // Debug log
      
      setOrders(ordersResponse.data);
      setOrderItems(orderItemsResponse.data);
      
      // Filter orders for last month by default
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      
      const filtered = ordersResponse.data.filter((order) => {
        const orderDate = new Date(order.dateTime);
        return orderDate >= lastMonth && orderDate <= today;
      });
      
      console.log('Filtered orders:', filtered); // Debug log
      
      setFilteredOrders(filtered);
      
      // Filter order items based on filtered orders
      const filteredItems = orderItemsResponse.data.filter(item => 
        filtered.some(order => order.orderID === item.orderId)
      );
      
      console.log('Filtered order items:', filteredItems); // Debug log
      
      setFilteredOrderItems(filteredItems);
      calculateTotalRevenue(filtered);
      calculateTopProducts(filteredItems);
      await calculateTopCustomers(filtered);
      calculateStats(filtered, filteredItems);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTopCustomers = async (orders) => {
    console.log('Calculating top customers with orders:', orders);

    if (!orders || orders.length === 0) {
      console.log('No orders to process');
      setTopCustomers([]);
      return;
    }

    // Tạo map để lưu thông tin chi tiêu của từng user
    const userSpending = new Map();

    // Tính toán tổng chi tiêu cho mỗi user
    orders.forEach(order => {
      console.log('Processing order:', order);
      
      if (order.userID) {
        console.log('Found userID:', order.userID);
        
        const currentSpending = userSpending.get(order.userID) || {
          userId: order.userID,
          totalSpent: 0,
          totalOrders: 0,
          totalItems: 0
        };

        currentSpending.totalSpent += order.finalTotal || 0;
        currentSpending.totalOrders += 1;
        currentSpending.totalItems += orderItems.reduce((sum, item) => 
          item.orderId === order.orderID ? sum + item.quantity : sum, 0
        );

        userSpending.set(order.userID, currentSpending);
      } else {
        console.log('Order has no userID:', order);
      }
    });

    console.log('User spending map:', userSpending);

    // Chuyển Map thành Array và sắp xếp theo tổng chi tiêu
    const sortedUsers = Array.from(userSpending.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    console.log('Top 5 users by spending:', sortedUsers);

    if (sortedUsers.length === 0) {
      console.log('No users found in sorted list');
      setTopCustomers([]);
      return;
    }

    // Lấy thông tin chi tiết của top 5 users
    const customersWithDetails = await Promise.all(
      sortedUsers.map(async (user) => {
        try {
          console.log('Fetching details for user ID:', user.userId);
          const userDetails = await fetchUserDetails(user.userId);
          console.log('User details received:', userDetails);
          
          return {
            ...user,
            userName: userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Khách hàng không xác định',
            email: userDetails?.email || 'Không có email',
            phoneNumber: userDetails?.phone || 'Không có số điện thoại'
          };
        } catch (error) {
          console.error('Error fetching details for user', user.userId, ':', error);
          return {
            ...user,
            userName: 'Khách hàng không xác định',
            email: 'Không có email',
            phoneNumber: 'Không có số điện thoại'
          };
        }
      })
    );

    console.log('Final customer details:', customersWithDetails);
    setTopCustomers(customersWithDetails);
  };

  const calculateStats = (orders, items) => {
    // Tổng số đơn hàng
    const totalOrders = orders.length;

    // Giá trị đơn hàng trung bình
    const averageOrderValue = totalOrders > 0 
      ? orders.reduce((sum, order) => sum + (order.finalTotal || 0), 0) / totalOrders 
      : 0;

    // Tổng số sản phẩm đã bán
    const totalProductsSold = items.reduce((sum, item) => sum + item.quantity, 0);

    // Danh mục bán chạy nhất
    const categorySales = items.reduce((acc, item) => {
      const category = item.categoryName || 'Không phân loại';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.quantity;
      return acc;
    }, {});

    const bestSellingCategory = Object.entries(categorySales)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Không có dữ liệu';

    setStats({
      totalOrders,
      averageOrderValue,
      totalProductsSold,
      bestSellingCategory
    });
  };

  const calculateTotalRevenue = (data) => {
    const total = data.reduce((sum, order) => sum + (order.finalTotal || 0), 0);
    setTotalRevenue(total);
  };

  const calculateTopProducts = (items) => {
    const productStats = items.reduce((acc, item) => {
      if (!acc[item.productName]) {
        acc[item.productName] = {
          totalQuantity: 0,
          totalRevenue: 0,
          productName: item.productName
        };
      }
      acc[item.productName].totalQuantity += item.quantity;
      acc[item.productName].totalRevenue += item.totalPrice;
      return acc;
    }, {});

    const sortedProducts = Object.values(productStats)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    setTopProducts(sortedProducts);
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
      setFilteredOrderItems(orderItems);
      calculateTotalRevenue(orders);
      calculateTopProducts(orderItems);
      calculateTopCustomers(orders);
      calculateStats(orders, orderItems);
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.dateTime);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      return orderDate >= start && orderDate <= end;
    });

    const filteredItems = orderItems.filter(item => 
      filtered.some(order => order.orderID === item.orderId)
    );

    setFilteredOrders(filtered);
    setFilteredOrderItems(filteredItems);
    calculateTotalRevenue(filtered);
    calculateTopProducts(filteredItems);
    calculateTopCustomers(filtered);
    calculateStats(filtered, filteredItems);
  };

  const getChartData = () => {
    const groupedData = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.dateTime).toLocaleDateString("vi-VN");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += order.finalTotal || 0;
      return acc;
    }, {});

    return {
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: "Doanh thu",
          data: Object.values(groupedData),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ doanh thu theo ngày",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  const calculatePeakTime = (orders) => {
    // Tạo một object để lưu số lượng đơn hàng theo giờ
    const hourlyOrders = {};
    
    // Đếm số lượng đơn hàng cho mỗi giờ
    orders.forEach(order => {
      const date = new Date(order.dateTime);
      const hour = date.getHours();
      hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
    });

    // Tìm giờ có nhiều đơn hàng nhất
    let maxOrders = 0;
    let peakHour = 0;
    
    Object.entries(hourlyOrders).forEach(([hour, count]) => {
      if (count > maxOrders) {
        maxOrders = count;
        peakHour = parseInt(hour);
      }
    });

    // Tính phần trăm đơn hàng trong giờ cao điểm
    const totalOrders = orders.length;
    const peakPercentage = ((maxOrders / totalOrders) * 100).toFixed(1);

    // Tạo khoảng thời gian (ví dụ: 10:00 - 11:00)
    const startTime = `${peakHour.toString().padStart(2, '0')}:00`;
    const endTime = `${(peakHour + 1).toString().padStart(2, '0')}:00`;

    return {
      timeRange: `${startTime} - ${endTime}`,
      orderCount: maxOrders,
      percentage: peakPercentage
    };
  };

  useEffect(() => {
    if (filteredOrders.length > 0) {
      const peakTime = calculatePeakTime(filteredOrders);
      setPeakTimeData(peakTime);
    }
  }, [filteredOrders]);

  const getPeakTimeChartData = (orders) => {
    // Tạo một object để lưu số lượng đơn hàng theo giờ
    const hourlyOrders = {};
    
    // Đếm số lượng đơn hàng cho mỗi giờ
    orders.forEach(order => {
      const date = new Date(order.dateTime);
      const hour = date.getHours();
      hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
    });

    // Tạo mảng 24 giờ
    const hours = Array.from({length: 24}, (_, i) => i);
    const data = hours.map(hour => hourlyOrders[hour] || 0);

    return {
      labels: hours.map(hour => `${hour.toString().padStart(2, '0')}:00`),
      datasets: [
        {
          label: 'Số lượng đơn hàng',
          data: data,
          backgroundColor: 'rgba(66, 153, 225, 0.5)',
          borderColor: 'rgb(66, 153, 225)',
          borderWidth: 1
        }
      ]
    };
  };

  const peakTimeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê đơn hàng theo giờ',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng đơn hàng'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Giờ'
        }
      }
    }
  };

  return (
    <div className="container account">
      <AccountMenu />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Quản lý doanh thu</h1>
        </div>

        <div className="revenue-stats">
          <div className="stat-card">
            <h3>Tổng doanh thu</h3>
            <div className="value">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="stat-card">
            <h3>Tổng số đơn hàng</h3>
            <div className="value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <h3>Giá trị đơn hàng trung bình</h3>
            <div className="value">{formatCurrency(stats.averageOrderValue)}</div>
          </div>
          <div className="stat-card">
            <h3>Tổng sản phẩm đã bán</h3>
            <div className="value">{stats.totalProductsSold}</div>
          </div>
        </div>

        <div className="revenue-filters">
          <div className="filter-group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-input"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-input"
            />
            <button onClick={handleFilter} className="action-btn">
              Lọc
            </button>
          </div>
        </div>

        <div className="revenue-chart">
          {loading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : (
            <Line data={getChartData()} options={chartOptions} />
          )}
        </div>

        <div className="top-customers">
          <h2>Khách hàng mua nhiều nhất</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Xếp hạng</th>
                  <th>Tên khách hàng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Số đơn hàng</th>
                  <th>Tổng số sản phẩm</th>
                  <th>Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={customer.userId}>
                    <td>
                      <span className="product-rank">{index + 1}</span>
                    </td>
                    <td>{customer.userName}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>{customer.totalOrders}</td>
                    <td>{customer.totalItems}</td>
                    <td>{formatCurrency(customer.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="top-products">
          <h2>Sản phẩm bán chạy</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Xếp hạng</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng đã bán</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <span className="product-rank">{index + 1}</span>
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.totalQuantity}</td>
                    <td>{formatCurrency(product.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="time-stats-card">
          <h2>Thời gian đặt hàng cao điểm</h2>
          <div className="time-stats-info">
            <div className="time-stats-item">
              <div>
                <div className="time-stats-label">Khoảng thời gian</div>
                <div className="time-stats-percentage">
                  {peakTimeData.timeRange}
                </div>
              </div>
              <div className="time-stats-value">
                {peakTimeData.orderCount} đơn hàng
                <div className="time-stats-percentage">
                  ({peakTimeData.percentage}% tổng số đơn)
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: '400px', marginTop: '20px' }}>
            {loading ? (
              <div className="loading">Đang tải dữ liệu...</div>
            ) : (
              <Bar data={getPeakTimeChartData(filteredOrders)} options={peakTimeChartOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement; 