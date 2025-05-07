import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await axios.post(
        "https://localhost:7089/api/User/reset-password",
        {
          token: token,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        // Chuyển về trang đăng nhập sau 3 giây
        setTimeout(() => {
          navigate("/authentication");
        }, 3000);
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

  if (success) {
    return (
      <div className="reset-password">
        <h1>Đặt Lại Mật Khẩu</h1>
        <div className="success-message">
          Mật khẩu của bạn đã được thay đổi thành công. Bạn sẽ được chuyển về
          trang đăng nhập sau 3 giây.
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password">
      <h1>Đặt Lại Mật Khẩu</h1>
      <p className="description">Vui lòng nhập mật khẩu mới của bạn.</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="input-label">
          Mật Khẩu Mới
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.lock} className="input-icon" />
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              {...register("newPassword", {
                required: "Vui lòng nhập mật khẩu mới",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
              })}
              className="styled-input"
            />
          </div>
        </label>
        {errors.newPassword && (
          <span className="error">{errors.newPassword.message}</span>
        )}

        <label className="input-label">
          Xác Nhận Mật Khẩu
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.lock} className="input-icon" />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === watch("newPassword") || "Mật khẩu không khớp",
              })}
              className="styled-input"
            />
          </div>
        </label>
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword.message}</span>
        )}

        <button type="submit" className="styled-button" disabled={isSubmitting}>
          {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
