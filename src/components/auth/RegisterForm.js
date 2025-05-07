import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (registerData) => {
    try {
      console.log("Form submitted with data:", registerData);
      setApiError(null);
      setIsSubmitting(true);

      const userData = {
        userID: 0,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        address: "string",
        city: "string",
        postalCode: "string",
        roleName: "string",
        isActivated: true,
        activationToken: "string",
      };

      console.log("Sending data to API:", userData);

      const response = await axios({
        method: "post",
        url: "https://localhost:7089/api/User",
        headers: {
          "Content-Type": "application/json",
        },
        data: userData,
      });

      console.log("API Response:", response);

      if (response.status >= 200 && response.status < 300) {
        alert(
          "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản!"
        );
        navigate("/authentication");
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response?.data) {
        console.log("Server error response:", error.response.data);
        if (typeof error.response.data === "string") {
          setApiError(error.response.data);
        } else if (error.response.data.message) {
          setApiError(error.response.data.message);
        } else if (error.response.data.title) {
          setApiError(error.response.data.title);
        } else if (error.response.data.errors) {
          const firstError = Object.values(error.response.data.errors)[0];
          setApiError(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setApiError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register">
      <h1>Đăng Ký</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && <div className="error-message">{apiError}</div>}
        <div className="divider">
          <label className="input-label">
            Họ <span>*</span>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Nhập họ"
                {...register("firstName", {
                  required: "Vui lòng nhập họ",
                  minLength: {
                    value: 2,
                    message: "Họ phải có ít nhất 2 ký tự",
                  },
                })}
                className="styled-input"
              />
            </div>
          </label>
          {errors.firstName && (
            <span className="error">{errors.firstName.message}</span>
          )}
          <label className="input-label">
            Tên <span>*</span>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Nhập tên"
                {...register("lastName", {
                  required: "Vui lòng nhập tên",
                  minLength: {
                    value: 2,
                    message: "Tên phải có ít nhất 2 ký tự",
                  },
                })}
                className="styled-input"
              />
            </div>
          </label>
          {errors.lastName && (
            <span className="error">{errors.lastName.message}</span>
          )}
        </div>
        <label className="input-label">
          Email <span>*</span>
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="example@email.com"
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
          Số Điện Thoại <span>*</span>
          <div className="input-wrapper">
            <input
              type="tel"
              placeholder="0123456789"
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^(0[0-9]{9})$/,
                  message:
                    "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 chữ số)",
                },
              })}
              className="styled-input"
            />
          </div>
        </label>
        {errors.phone && <span className="error">{errors.phone.message}</span>}
        <label className="input-label">
          Mật Khẩu <span>*</span>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
                maxLength: {
                  value: 20,
                  message: "Mật khẩu không được quá 20 ký tự",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
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
          {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
        </button>
      </form>
    </div>
  );
}

export default Register;
