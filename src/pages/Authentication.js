import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../components/auth/RegisterForm";
import Login from "../components/auth/LoginForm";
import ForgotPassword from "../components/auth/ForgotPassword";
import { useUser } from "../utils/hooks/useUser";

function Authentication() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { currentUser, token } = useUser();

  useEffect(() => {
    // Check if user is already logged in
    if (token && currentUser) {
      try {
        // Decode token to check expiration
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        // If token is still valid and we have a currentUser, redirect to account
        if (currentTime < expirationTime && currentUser) {
          navigate("/account");
        }
      } catch (error) {
        console.error("Error checking token validity:", error);
        // If there's an error decoding the token, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [token, currentUser, navigate]);

  return (
    <div className="auth container">
      <div className="auth-container">
        {activeTab === "login" && <Login />}
        {activeTab === "signup" && <Register />}
        {activeTab === "forgot" && (
          <ForgotPassword onSwitchTab={setActiveTab} />
        )}
      </div>
      <div className="auth-tabs">
        <a
          className={`tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Đã có tài khoản?
        </a>
        <a
          className={`tab ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => setActiveTab("signup")}
        >
          Chưa có tài khoản?
        </a>
        <a
          className={`tab ${activeTab === "forgot" ? "active" : ""}`}
          onClick={() => setActiveTab("forgot")}
        >
          Quên mật khẩu?
        </a>
      </div>
    </div>
  );
}

export default Authentication;
