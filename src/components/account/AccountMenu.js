import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/reducers/userSlice';
import { useUser } from '../../utils/hooks/useUser';

function AccountMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const { logout } = useUser();

  const handleTabClick = (index) => {
    const isAdmin = currentUser && currentUser.roleName === "Admin";
    const logoutTabIndex = isAdmin ? 5 : 3;
    if (index === logoutTabIndex) {
      logout();
      navigate("/authentication");
      return;
    }
  };

  if (!currentUser) return null;

  return (
    <ul className="account-menu">
      {currentUser.roleName === "Admin" ? (
        <>
          <li
            className={location.pathname === "/admin/products" ? "active" : ""}
            onClick={() => navigate("/admin/products")}
          >
            Quản lý sản phẩm
          </li>
          <li
            className={location.pathname === "/admin/discounts" ? "active" : ""}
            onClick={() => navigate("/admin/discounts")}
          >
            Quản lý khuyến mãi
          </li>
          <li
            className={location.pathname === "/admin/categories" ? "active" : ""}
            onClick={() => navigate("/admin/categories")}
          >
            Quản lý danh mục
          </li>
          <li
            className={location.pathname === "/admin/orders" ? "active" : ""}
            onClick={() => navigate("/admin/orders")}
          >
            Quản lý đơn hàng
          </li>
          <li
            className={location.pathname === "/admin/revenue" ? "active" : ""}
            onClick={() => navigate("/admin/revenue")}
          >
            Quản lý doanh thu
          </li>
          <li
            className={location.pathname === "/admin/users" ? "active" : ""}
            onClick={() => navigate("/admin/users")}
          >
            Quản lý tài khoản
          </li>
          <li onClick={() => handleTabClick(5)}>Đăng xuất</li>
        </>
      ) : (
        <>
          <li
            className={location.pathname === "/account/orders" ? "active" : ""}
            onClick={() => navigate("/account/orders")}
          >
            Đơn hàng của tôi
          </li>
          <li
            className={location.pathname === "/account/profile" ? "active" : ""}
            onClick={() => navigate("/account/profile")}
          >
            Thông tin cá nhân
          </li>
          <li
            className={location.pathname === "/account/password" ? "active" : ""}
            onClick={() => navigate("/account/password")}
          >
            Thay đổi mật khẩu
          </li>
          <li onClick={() => handleTabClick(3)}>Đăng xuất</li>
        </>
      )}
    </ul>
  );
}

export default AccountMenu; 