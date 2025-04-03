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
            ←Back to Discounts{" "}
          </button>{" "}
          <h1 className="discount-title"> Add New Discount </h1>{" "}
        </div>{" "}
      </div>{" "}
      {error && <div className="error-message"> {error} </div>}{" "}
      <form onSubmit={handleSubmit} className="discount-form">
        <div className="form-section">
          <h2 className="form-section-title"> Basic Information </h2>{" "}
          <div className="form-row">
            <div className="form-group">
              <label className="required-field" htmlFor="code">
                Discount Code{" "}
              </label>{" "}
              <input
                type="text"
                id="code"
                name="code"
                value={discount.code}
                onChange={handleChange}
                required
                placeholder="e.g., SUMMER2024"
              />
            </div>{" "}
            <div className="form-group">
              <label className="required-field" htmlFor="discountType">
                Discount Type{" "}
              </label>{" "}
              <select
                id="discountType"
                name="discountType"
                value={discount.discountType}
                onChange={handleChange}
                required
              >
                <option value="Percentage"> Percentage </option>{" "}
                <option value="FixedAmount"> Fixed Amount </option>{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
          <div className="form-group">
            <label className="required-field" htmlFor="description">
              Description{" "}
            </label>{" "}
            <textarea
              id="description"
              name="description"
              value={discount.description}
              onChange={handleChange}
              required
              placeholder="Enter a description for this discount"
            />
          </div>{" "}
        </div>{" "}
        <div className="form-section">
          <h2 className="form-section-title"> Discount Details </h2>{" "}
          <div className="form-row">
            <div className="form-group">
              <label className="required-field" htmlFor="discountValue">
                {" "}
                {discount.discountType === "Percentage"
                  ? "Percentage Off"
                  : "Amount Off"}{" "}
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
              <label htmlFor="usageLimit"> Usage Limit </label>{" "}
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={discount.usageLimit}
                onChange={handleChange}
                min="1"
                placeholder="Leave empty for unlimited"
              />
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="form-section">
          <h2 className="form-section-title"> Validity Period </h2>{" "}
          <div className="form-row">
            <div className="form-group">
              <label className="required-field" htmlFor="startDate">
                Start Date{" "}
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
              <label htmlFor="endDate"> End Date </label>{" "}
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
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/discounts")}
          >
            Cancel{" "}
          </button>{" "}
          <button type="submit" className="btn btn-primary">
            Create Discount{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </div>
  );
};

export default AddDiscount;
