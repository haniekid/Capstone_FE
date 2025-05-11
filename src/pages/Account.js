import React, { useState, useEffect } from 'react';
import Profile from '../components/account/EditProfile';
import Orders from '../components/account/MyOrders';
import ChangePassword from '../components/account/ChangePassword';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setUser } from '../store/reducers/userSlice';
import { useUser } from '../utils/hooks/useUser';

function MyAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState(0);
  const { logout } = useUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/authentication');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Nếu có state.tab === "orders" thì chuyển sang tab Đơn Hàng Của Tôi
    if (location.state && location.state.tab === 'orders') {
      setActiveTab(1);
    }
  }, [location.state]);

  const handleTabClick = (index) => {
    if (index === 3) {
      logout();
      navigate('/authentication');
    }
    setActiveTab(index);
  };

  return (
    <>
      {' '}
      {currentUser && (
        <div className="container account">
          <ul className="account-menu">
            <li
              className={activeTab === 0 ? 'active' : ''}
              onClick={() => handleTabClick(0)}
            >
              Thông Tin Cá Nhân{' '}
            </li>
            {/* Show My Orders for Users, My Products for Admin */}{' '}
            {currentUser.roleName === 'Admin' ? (
              <>
                <li
                  className={activeTab === 1 ? 'active' : ''}
                  onClick={() => navigate('/admin/products')}
                >
                  Quản Lý Sản Phẩm{' '}
                </li>{' '}
                <li
                  className={activeTab === 2 ? 'active' : ''}
                  onClick={() => navigate('/admin/discounts')}
                >
                  Quản Lý Khuyến Mãi{' '}
                </li>{' '}
              </>
            ) : (
              <>
                <li
                  className={activeTab === 1 ? 'active' : ''}
                  onClick={() => handleTabClick(1)}
                >
                  Đơn Hàng Của Tôi{' '}
                </li>{' '}
                <li
                  className={activeTab === 2 ? 'active' : ''}
                  onClick={() => handleTabClick(2)}
                >
                  Thay Đổi Mật Khẩu{' '}
                </li>{' '}
              </>
            )}
            <li onClick={() => handleTabClick(3)}> Đăng Xuất </li>{' '}
          </ul>
          <div className="profile-container">
            {' '}
            {activeTab === 0 && <Profile currentUser={currentUser} />}{' '}
            {activeTab === 1 && currentUser.roleName !== 'Admin' && (
              <Orders currentUser={currentUser} />
            )}{' '}
            {activeTab === 2 && currentUser.roleName !== 'Admin' && (
              <ChangePassword currentUser={currentUser} />
            )}{' '}
          </div>{' '}
        </div>
      )}{' '}
    </>
  );
}

export default MyAccount;
