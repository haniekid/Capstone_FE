import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { icons } from "../../assets/icons/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "../../utils/hooks/useUser";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (loginData) => {
    try {
      setError(null);
      setIsSubmitting(true);
      const user = await login(loginData);
      if (user) {
        if (location.pathname === "/authentication") {
          navigate("/account");
        }
      } else {
        setError("Email hoặc mật khẩu không chính xác");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      <h1>Đăng Nhập</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="input-label">
          Email
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.email} className="input-icon" />
            <input
              type="email"
              placeholder="Nhập email của bạn"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ",
                },
              })}
              className="styled-input"
            />
          </div>
        </label>
        {errors.email && <span className="error">{errors.email.message}</span>}

        <label className="input-label">
          Mật Khẩu
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.lock} className="input-icon" />
            <input
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
              })}
              className="styled-input"
            />
          </div>
        </label>
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}

        <button type="submit" className="styled-button" disabled={isSubmitting}>
          {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
        </button>
      </form>
    </div>
  );
}

export default Login;
