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

  useEffect(() => {
    const fetchDiscountDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/discount/${id}`);
        setDiscount(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountDetail();
  }, [id]);

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
            ←Back to Discounts{" "}
          </button>{" "}
          <h1 className="discount-title"> Discount Details </h1>{" "}
        </div>{" "}
      </div>
      <div className="form-section">
        <div className="detail-row">
          <div className="detail-group">
            <label> Code </label>{" "}
            <div className="detail-value"> {discount.code} </div>{" "}
          </div>{" "}
          <div className="detail-group">
            <label> Status </label>{" "}
            <div className="detail-value">
              <span
                className={`status ${
                  discount.isActive ? "active" : "inactive"
                }`}
              >
                {" "}
                {discount.isActive ? "Active" : "Inactive"}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <div className="detail-group">
          <label> Description </label>{" "}
          <div className="detail-value"> {discount.description} </div>{" "}
        </div>
        <div className="detail-row">
          <div className="detail-group">
            <label> Type </label>{" "}
            <div className="detail-value"> {discount.discountType} </div>{" "}
          </div>{" "}
          <div className="detail-group">
            <label> Value </label>{" "}
            <div className="detail-value">
              {" "}
              {discount.discountType === "Percentage"
                ? `${discount.discountValue}%`
                : `$${discount.discountValue}`}{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <div className="detail-row">
          <div className="detail-group">
            <label> Start Date </label>{" "}
            <div className="detail-value">
              {" "}
              {formatDate(discount.startDate)}{" "}
            </div>{" "}
          </div>{" "}
          <div className="detail-group">
            <label> End Date </label>{" "}
            <div className="detail-value"> {formatDate(discount.endDate)} </div>{" "}
          </div>{" "}
        </div>
        <div className="detail-row">
          <div className="detail-group">
            <label> Usage </label>{" "}
            <div className="detail-value">
              {" "}
              {discount.usedCount || 0}/ {discount.usageLimit || "∞"}{" "}
            </div>{" "}
          </div>{" "}
          <div className="detail-group">
            <label> Created At </label>{" "}
            <div className="detail-value">
              {" "}
              {formatDate(discount.createdAt)}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/admin/discounts")}
        >
          Back{" "}
        </button>{" "}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(`/admin/discounts/edit/${id}`)}
        >
          Edit Discount{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
};

export default DiscountDetail;
