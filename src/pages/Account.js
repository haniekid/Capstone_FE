import React, { useState, useEffect } from "react";
import Profile from "../components/account/EditProfile";
import Orders from "../components/account/MyOrders";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setUser } from "../store/reducers/userSlice";

function MyAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate("/authentication");
    }
  }, [currentUser, navigate]);

  const handleTabClick = (index) => {
    if (index === 2) {
      dispatch(setUser(null));
      navigate("/authentication");
    }
    setActiveTab(index);
  };

  return (
    <>
      {currentUser && (
        <div className="container account">
          <ul className="account-menu">
            <li
              className={activeTab === 0 ? "active" : ""}
              onClick={() => handleTabClick(0)}
            >
              Profile
            </li>

            {/* Show My Orders for Users, My Products for Admin */}
            {currentUser.roleName === "Admin" ? (
              <li
                className={activeTab === 1 ? "active" : ""}
                onClick={() => navigate("/admin/products")}
              >
                Manage Products
              </li>
            ) : (
              <li
                className={activeTab === 1 ? "active" : ""}
                onClick={() => handleTabClick(1)}
              >
                My Orders
              </li>
            )}

            <li onClick={() => handleTabClick(2)}>Log Out</li>
          </ul>

          <div className="profile-container">
            {activeTab === 0 && <Profile currentUser={currentUser} />}
            {activeTab === 1 && currentUser.roleName !== "Admin" && (
              <Orders currentUser={currentUser} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MyAccount;
