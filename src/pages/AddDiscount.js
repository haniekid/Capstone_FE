import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/discount.css";

const API_URL = "https://localhost:7089/api/Discount";

const AddDiscount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discount, setDiscount] = useState({
    code: "",
    description: "",
    discountType: "Percentage",
    discountValue: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    usageLimit: "",
    isActive: true,
    minOrderValue: "",
    maxDiscountValue: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formattedDiscount = {
        ...discount,
        startDate: new Date(discount.startDate).toISOString(),
        endDate: discount.endDate
          ? new Date(discount.endDate).toISOString()
          : null,
        discountValue: Number(discount.discountValue),
        usageLimit: discount.usageLimit ? Number(discount.usageLimit) : null,
        minOrderValue: discount.minOrderValue
          ? Number(discount.minOrderValue)
          : null,
        maxDiscountValue: discount.maxDiscountValue
          ? Number(discount.maxDiscountValue)
          : null,
      };

      await axios.post(API_URL, formattedDiscount);
      navigate("/admin/discounts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="discount-container">
        <div className="loading-spinner"> Creating discount... </div>{" "}
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
          <h1 className="discount-title"> Thêm Mã Khuyến Mãi Mới </h1>{" "}
        </div>{" "}
      </div>{" "}
      {error && <div className="error-message"> {error} </div>}{" "}
      <form onSubmit={handleSubmit} className="discount-form">
        <div className="form-section">
          <h2 className="form-section-title"> Thông Tin Cơ Bản </h2>{" "}
          <div className="form-row">
            <div className="form-group">
              <label className="required-field" htmlFor="code">
                Mã Khuyến Mãi{" "}
              </label>{" "}
              <input
                type="text"
                id="code"
                name="code"
                value={discount.code}
                onChange={handleChange}
                required
                placeholder="VD: SUMMER2024"
              />
            </div>{" "}
            <div className="form-group">
              <label className="required-field" htmlFor="discountType">
                Loại Khuyến Mãi{" "}
              </label>{" "}
              <select
                id="discountType"
                name="discountType"
                value={discount.discountType}
                onChange={handleChange}
                required
              >
                <option value="Percentage"> Phần Trăm </option>{" "}
                <option value="FixedAmount"> Số Tiền Cố Định </option>{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
          <div className="form-group">
            <label className="required-field" htmlFor="description">
              Mô Tả{" "}
            </label>{" "}
            <textarea
              id="description"
              name="description"
              value={discount.description}
              onChange={handleChange}
              required
              placeholder="Nhập mô tả cho mã khuyến mãi này"
            />
          </div>{" "}
        </div>{" "}
        <div className="form-section">
          <h2 className="form-section-title"> Chi Tiết Khuyến Mãi </h2>{" "}
          <div className="form-row">
            <div className="form-group">
              <label className="required-field" htmlFor="discountValue">
                {" "}
                {discount.discountType === "Percentage"
                  ? "Phần Trăm Giảm"
                  : "Số Tiền Giảm"}{" "}
              </label>{" "}
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                value={discount.discountValue}
                onChange={handleChange}
                min="0"
                max={discount.discountType === "Percentage" ? "100" : undefined}
                step={discount.discountType === "Percentage" ? "1" : "0.01"}
                required
                placeholder={
                  discount.discountType === "Percentage" ? "0-100" : "0.00"
                }
              />{" "}
            </div>{" "}
            <div className="form-group">
              <label htmlFor="usageLimit"> Giới Hạn Sử Dụng </label>{" "}
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={discount.usageLimit}
                onChange={handleChange}
                min="1"
                placeholder="Để trống nếu không giới hạn"
              />
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="form-section">
          <h2 className="form-section-title"> Thời Gian Áp Dụng </h2>{" "}
          <div className="form-row">
            <div className="form-group">
              <label className="required-field" htmlFor="startDate">
                Ngày Bắt Đầu{" "}
              </label>{" "}
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={discount.startDate}
                onChange={handleChange}
                required
              />
            </div>{" "}
            <div className="form-group">
              <label htmlFor="endDate"> Ngày Kết Thúc </label>{" "}
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={discount.endDate}
                onChange={handleChange}
                min={discount.startDate}
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={discount.isActive}
              onChange={handleChange}
            />{" "}
            <label htmlFor="isActive"> Active </label>{" "}
          </div>{" "}
        </div>{" "}
        <div className="form-section">
          <h2 className="form-section-title"> Điều Kiện Áp Dụng </h2>{" "}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minOrderValue">
                {" "}
                Giá Trị Đơn Hàng Tối Thiểu{" "}
              </label>{" "}
              <input
                type="number"
                id="minOrderValue"
                name="minOrderValue"
                value={discount.minOrderValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Để trống nếu không yêu cầu"
              />
            </div>{" "}
            <div className="form-group">
              <label htmlFor="maxDiscountValue"> Giá Trị Giảm Tối Đa </label>{" "}
              <input
                type="number"
                id="maxDiscountValue"
                name="maxDiscountValue"
                value={discount.maxDiscountValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Để trống nếu không giới hạn"
              />
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Tạo Mã Khuyến Mãi{" "}
          </button>{" "}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/discounts")}
          >
            Hủy{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </div>
  );
};

export default AddDiscount;
