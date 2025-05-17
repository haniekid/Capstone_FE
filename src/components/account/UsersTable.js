import userApi from "../../utils/api/userApi";
import React, { useEffect, useState } from "react";
import "./_usersTable.scss";
import AccountMenu from "./AccountMenu";
import "../../styles/admin.css";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("userID");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const users = await userApi.getUsers();
    setData(users);
    setLoading(false);
  };

  const handleToggleActive = async (user) => {
    setLoading(true);
    await userApi.lockUser(user.userID, !user.isActivated);
    fetchUsers();
  };

  const handleViewDetail = (user) => {
    // Placeholder: show modal hoặc alert chi tiết user
    alert(
      `Chi tiết người dùng:\n\nID: ${user.userID}\nHọ tên: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nTrạng thái: ${user.isActivated ? "Đang hoạt động" : "Đã khóa"}`
    );
  };

  // Search + sort + paging
  const filtered = data.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    let v1 = a[sortField];
    let v2 = b[sortField];
    if (sortField === "firstName") {
      v1 = a.firstName + " " + a.lastName;
      v2 = b.firstName + " " + b.lastName;
    }
    if (sortField === "isActivated") {
      v1 = a.isActivated ? 1 : 0;
      v2 = b.isActivated ? 1 : 0;
    }
    if (typeof v1 === "string") {
      v1 = v1.toLowerCase();
      v2 = v2.toLowerCase();
    }
    if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
    if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  const totalPage = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container account">
      <AccountMenu />
      <div className="admin-users">
        <div className="user-header">
          <h1 className="user-title">Quản Lý Tài Khoản</h1>
        </div>
        <div className="user-list">
          <div className="users-table-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Nhập tên người dùng hoặc email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="search-input"
              />
            </div>
            <table className="user-table">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("userID")}
                    className="sortable-header"
                  >
                    Mã Người Dùng{" "}
                    <span className="sort-icon">
                      {sortField === "userID" && (sortOrder === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("firstName")}
                    className="sortable-header"
                  >
                    Họ và Tên{" "}
                    <span className="sort-icon">
                      {sortField === "firstName" && (sortOrder === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("email")}
                    className="sortable-header"
                  >
                    Email{" "}
                    <span className="sort-icon">
                      {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("isActivated")}
                    className="sortable-header"
                  >
                    Trạng Thái{" "}
                    <span className="sort-icon">
                      {sortField === "isActivated" && (sortOrder === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((user, index) => (
                  <tr key={index}>
                    <td>{user.userID}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge ${user.isActivated ? 'active' : 'inactive'}`}>
                        {user.isActivated ? "Đang hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={`action-btn ${user.isActivated ? 'lock' : 'unlock'}`}
                        >
                          {user.isActivated ? "Khóa" : "Mở khóa"}
                        </button>
                        <button 
                          onClick={() => handleViewDetail(user)}
                          className="action-btn view"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
              >
                Trước
              </button>
              <div className="page-numbers">
                {[...Array(totalPage)].map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-btn ${page === index + 1 ? 'active' : ''}`}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button 
                className="pagination-btn" 
                disabled={page === totalPage} 
                onClick={() => setPage(page + 1)}
              >
                Sau
              </button>
            </div>
            {loading && <div className="loading">Đang tải...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
