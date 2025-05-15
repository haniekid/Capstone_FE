import React, { useState, useEffect } from "react";
import Profile from "../components/account/EditProfile";
import Orders from "../components/account/MyOrders";
import ChangePassword from "../components/account/ChangePassword";
import ManageCategory from "./ManageCategory";
import UsersTable from "../components/account/UsersTable";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setUser } from "../store/reducers/userSlice";
import { useUser } from "../utils/hooks/useUser";

function MyAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState(0);
  const { logout } = useUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/authentication");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (location.state && location.state.tab === "orders") {
      setActiveTab(1);
    }
  }, [location.state]);

  const handleTabClick = (index) => {
    const isAdmin = currentUser && currentUser.roleName === "Admin";
    const logoutTabIndex = isAdmin ? 5 : 3;
    if (index === logoutTabIndex) {
      logout();
      navigate("/authentication");
      return;
    }
    setActiveTab(index);
  };

  return (
    <>
      {" "}
      {currentUser && (
        <div className="container account">
          <ul className="account-menu">
            {" "}
            {currentUser.roleName === "Admin" ? (
              <>
                <li
                  className={activeTab === 0 ? "active" : ""}
                  onClick={() => navigate("/admin/products")}
                >
                  Quản Lý Sản Phẩm{" "}
                </li>{" "}
                <li
                  className={activeTab === 1 ? "active" : ""}
                  onClick={() => navigate("/admin/discounts")}
                >
                  Quản Lý Khuyến Mãi{" "}
                </li>{" "}
                <li
                  className={activeTab === 2 ? "active" : ""}
                  onClick={() => handleTabClick(2)}
                >
                  Quản Lý Danh Mục{" "}
                </li>{" "}
                <li
                  className={activeTab === 3 ? "active" : ""}
                  onClick={() => navigate("/admin/orders")}
                >
                  Quản Lý Đơn Hàng{" "}
                </li>{" "}
                <li
                  className={activeTab === 4 ? "active" : ""}
                  onClick={() => handleTabClick(4)}
                >
                  Quản Lý Người Dùng{" "}
                </li>{" "}
                <li onClick={() => handleTabClick(5)}> Đăng Xuất </li>{" "}
              </>
            ) : (
              <>
                <li
                  className={activeTab === 0 ? "active" : ""}
                  onClick={() => handleTabClick(0)}
                >
                  Đơn Hàng Của Tôi{" "}
                </li>{" "}
                <li
                  className={activeTab === 1 ? "active" : ""}
                  onClick={() => handleTabClick(1)}
                >
                  Thông Tin Cá Nhân{" "}
                </li>{" "}
                <li
                  className={activeTab === 2 ? "active" : ""}
                  onClick={() => handleTabClick(2)}
                >
                  Thay Đổi Mật Khẩu{" "}
                </li>{" "}
                <li onClick={() => handleTabClick(3)}> Đăng Xuất </li>{" "}
              </>
            )}{" "}
          </ul>{" "}
          <div className="profile-container">
            {" "}
            {activeTab === 0 && currentUser.roleName !== "Admin" && (
              <Orders currentUser={currentUser} />
            )}{" "}
            {activeTab === 1 && currentUser.roleName !== "Admin" && (
              <Profile currentUser={currentUser} />
            )}{" "}
            {activeTab === 2 && currentUser.roleName === "Admin" && (
              <ManageCategory />
            )}{" "}
            {activeTab === 2 && currentUser.roleName !== "Admin" && (
              <ChangePassword currentUser={currentUser} />
            )}{" "}
            {activeTab === 4 && currentUser.roleName === "Admin" && (
              <UsersTable />
            )}
          </div>{" "}
        </div>
      )}{" "}
    </>
  );
}

export default MyAccount;
