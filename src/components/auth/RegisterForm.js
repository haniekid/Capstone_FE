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
  const navigate = useNavigate();

  const onSubmit = async (registerData) => {
    try {
      setApiError(null);

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

      console.log("Sending data:", userData);

      const response = await axios({
        method: "post",
        url: "https://localhost:7089/api/User",
        headers: {
          "Content-Type": "application/json",
        },
        data: userData,
      });

      console.log("Response:", response);

      if (response.status >= 200 && response.status < 300) {
        alert(
          "Registration successful! Please confirm your activation in your email to activate your account!"
        );
        window.location.href = "/authentication";
      }
    } catch (error) {
      console.error("Error details:", error);
      if (error.response?.data) {
        console.log("Server error:", error.response.data);
        setApiError(
          error.response.data.message ||
            "Registration failed. Please check your details."
        );
      } else {
        setApiError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {apiError && <div className="error-message">{apiError}</div>}
        <div className="divider">
          <label className="input-label">
            First Name <span>*</span>
            <div className="input-wrapper">
              <input
                type="text"
                {...register("firstName", { required: true })}
              />
            </div>
          </label>
          {errors.firstName && (
            <span className="error">This field is required</span>
          )}
          <label className="input-label">
            Last Name <span>*</span>
            <div className="input-wrapper">
              <input
                type="text"
                {...register("lastName", { required: true })}
              />
            </div>
          </label>
          {errors.lastName && (
            <span className="error">This field is required</span>
          )}
        </div>
        <label className="input-label">
          Email <span>*</span>
          <div className="input-wrapper">
            <input
              type="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
        </label>
        {errors.email && (
          <span className="error">
            {errors.email.message || "This field is required"}
          </span>
        )}
        <label className="input-label">
          Phone <span>*</span>
          <div className="input-wrapper">
            <input
              type="tel"
              {...register("phone", {
                required: true,
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
            />
          </div>
        </label>
        {errors.phone && (
          <span className="error">
            {errors.phone.message || "This field is required"}
          </span>
        )}
        <label className="input-label">
          Password <span>*</span>
          <div className="input-wrapper">
            <input
              type="password"
              {...register("password", {
                required: true,
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Password must be at most 20 characters",
                },
              })}
            />
          </div>
        </label>
        {errors.password && (
          <span className="error">
            {errors.password.message || "This field is required"}
          </span>
        )}
        <button type="submit">REGISTER</button>
      </form>
    </div>
  );
}

export default Register;
