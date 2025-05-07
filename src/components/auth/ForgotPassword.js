import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";
import axios from "axios";

function ForgotPassword({ onSwitchTab }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await axios.post(
        `https://localhost:7089/api/User/forgot-password?email=${encodeURIComponent(
          formData.email
        )}`,
        {}, // Empty body
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      if (response.status === 200) {
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          setError(error.response.data);
        } else if (error.response.data.errors) {
          const errorMessages = Object.values(
            error.response.data.errors
          ).flat();
          setError(errorMessages[0]);
        } else if (error.response.data.title) {
          setError(error.response.data.title);
        } else {
          setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="forgot-password">
        <h1>Kiểm Tra Email</h1>
        <div className="success-message">
          Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn. Vui
          lòng kiểm tra hộp thư (và thư mục spam) để tiếp tục.
        </div>
        <button className="styled-button" onClick={() => onSwitchTab("login")}>
          Quay Lại Đăng Nhập
        </button>
      </div>
    );
  }

  return (
    <div className="forgot-password">
      <h1>Quên Mật Khẩu</h1>
      <p className="description">
        Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
      </p>
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

        <button type="submit" className="styled-button" disabled={isSubmitting}>
          {isSubmitting ? "ĐANG XỬ LÝ..." : "GỬI"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
