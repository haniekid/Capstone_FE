import userApi from "../../utils/api/userApi";
import React, { useEffect, useState } from "react";

function UsersTable() {
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
    <div style={{ overflowX: "auto" }}>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: 6,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 220,
          }}
        />
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("userID")}
              style={{ cursor: "pointer" }}
            >
              Mã Người Dùng{" "}
              {sortField === "userID" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("firstName")}
              style={{ cursor: "pointer" }}
            >
              Họ và Tên{" "}
              {sortField === "firstName" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("email")}
              style={{ cursor: "pointer" }}
            >
              Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("isActivated")}
              style={{ cursor: "pointer" }}
            >
              Trạng Thái{" "}
              {sortField === "isActivated" && (sortOrder === "asc" ? "▲" : "▼")}
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
                <span
                  style={{
                    color: user.isActivated ? "green" : "red",
                    fontWeight: 600,
                  }}
                >
                  {user.isActivated ? "Đang hoạt động" : "Đã khóa"}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleToggleActive(user)}
                  style={{ marginRight: 8 }}
                >
                  {user.isActivated ? "Khóa" : "Mở khóa"}
                </button>
                <button onClick={() => handleViewDetail(user)}>
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Trước
        </button>
        <span>
          Trang {page} / {totalPage}
        </span>
        <button disabled={page === totalPage} onClick={() => setPage(page + 1)}>
          Sau
        </button>
      </div>
      {loading && <div>Đang tải...</div>}
    </div>
  );
}

export default UsersTable;
