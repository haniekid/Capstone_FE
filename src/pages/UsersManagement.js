import React from "react";
import UsersTable from "../components/account/UsersTable";

const UsersManagement = () => {
  return (
    <div className="admin-container">
      <div className="users-management">
        <h2>Quản Lý Người Dùng</h2>
        <UsersTable />
      </div>
    </div>
  );
};

export default UsersManagement; 