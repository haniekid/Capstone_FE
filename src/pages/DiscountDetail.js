import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/discount.css";

const API_URL = "https://localhost:7089/api/Discount";

const DiscountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchDiscountDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/discount/${id}`);
        const discountData = response.data;

        // Format startDate and endDate to YYYY-MM-DD
        const formattedData = {
          ...discountData,
          startDate: discountData.startDate
            ? new Date(discountData.startDate).toISOString().split("T")[0]
            : "",
          endDate: discountData.endDate
            ? new Date(discountData.endDate).toISOString().split("T")[0]
            : "",
        };

        setDiscount(discountData);
        setFormData(formattedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountDetail();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/${id}`, formData);
      setDiscount(formData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No End Date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="discount-container">
        <div className="loading-spinner"> Loading... </div>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="discount-container">
        <div className="error-message"> {error} </div>{" "}
      </div>
    );
  }

  if (!discount) {
    return (
      <div className="discount-container">
        <div className="error-message"> Discount not found </div>{" "}
      </div>
    );
  }

  return (
    <div className="discount-container">
      <div className="discount-header">
        <div className="header-left">
          <button
            type="button"
            className="btn btn-secondary back-btn"
            onClick={() => navigate("/admin/discounts")}
          >
            ←Quay Lại Danh Sách Khuyến Mãi{" "}
          </button>{" "}
          <h1 className="discount-title"> Chi Tiết Khuyến Mãi </h1>{" "}
        </div>{" "}
      </div>{" "}
      <div className="discount-details">
        <div className="detail-row">
          <div className="detail-group">
            <label> Mã Khuyến Mãi </label>{" "}
            {isEditing ? (
              <input
                type="text"
                name="code"
                value={formData.code || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="detail-value"> {discount.code} </div>
            )}{" "}
          </div>{" "}
          <div className="detail-group">
            <label> Trạng Thái </label>{" "}
            {isEditing ? (
              <select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === "true",
                  }))
                }
              >
                <option value="true"> Đang Hoạt Động </option>{" "}
                <option value="false"> Không Hoạt Động </option>{" "}
              </select>
            ) : (
              <div className="detail-value">
                <span
                  className={`status ${
                    discount.isActive ? "active" : "inactive"
                  }`}
                >
                  {discount.isActive ? "Đang Hoạt Động" : "Không Hoạt Động"}{" "}
                </span>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        <div className="detail-group">
          <label> Mô Tả </label>{" "}
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
            />
          ) : (
            <div className="detail-value"> {discount.description} </div>
          )}{" "}
        </div>{" "}
        <div className="detail-row">
          <div className="detail-group">
            <label> Loại </label>{" "}
            {isEditing ? (
              <select
                name="discountType"
                value={formData.discountType || ""}
                onChange={handleInputChange}
              >
                <option value="Percentage"> Phần Trăm </option>{" "}
                <option value="FixedAmount"> Số Tiền Cố Định </option>{" "}
              </select>
            ) : (
              <div className="detail-value"> {discount.discountType} </div>
            )}{" "}
          </div>{" "}
          <div className="detail-group">
            <label> Giá Trị </label>{" "}
            {isEditing ? (
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="detail-value">
                {" "}
                {discount.discountType === "Percentage"
                  ? `${discount.discountValue}%`
                  : `$${discount.discountValue}`}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        <div className="detail-row">
          <div className="detail-group">
            <label> Ngày Bắt Đầu </label>{" "}
            {isEditing ? (
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="detail-value">
                {" "}
                {formatDate(discount.startDate)}{" "}
              </div>
            )}{" "}
          </div>{" "}
          <div className="detail-group">
            <label> Ngày Kết Thúc </label>{" "}
            {isEditing ? (
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleInputChange}
              />
            ) : (
              <div className="detail-value">
                {" "}
                {formatDate(discount.endDate)}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/discounts")}
        >
          Quay Lại{" "}
        </button>{" "}
        {isEditing ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveChanges}
          >
            Lưu Thay Đổi{" "}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh Sửa{" "}
          </button>
        )}{" "}
      </div>{" "}
    </div>
  );
};

export default DiscountDetail;
