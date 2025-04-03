import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const API_URL = "https://localhost:7089/api/Discount";

const ManageDiscount = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 6;

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setDiscounts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDiscount = async (discountData) => {
    try {
      setLoading(true);
      const response = await axios.post(API_URL, discountData);
      setDiscounts([...discounts, response.data]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDiscount = async (discountId, discountData) => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/${discountId}`, discountData);
      setDiscounts(
        discounts.map((d) =>
          d.discountId === discountId ? { ...d, ...discountData } : d
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscount = async (discountId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${discountId}`);
      setDiscounts(discounts.filter((d) => d.discountId !== discountId));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No End Date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddDiscount = () => {
    const newDiscount = {
      code: "NEW_CODE",
      description: "New discount description",
      discountType: "Percentage",
      discountValue: 10,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: 100,
      isActive: true,
    };
    createDiscount(newDiscount);
  };

  const handleDeleteDiscount = async (discountId) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      await deleteDiscount(discountId);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (sortConfig.key === "period") {
        // Sort by endDate for period
        const aDate = a.endDate ? new Date(a.endDate) : new Date("9999-12-31");
        const bDate = b.endDate ? new Date(b.endDate) : new Date("9999-12-31");
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (sortConfig.key === "value") {
        // First sort by type, then by value
        if (a.discountType !== b.discountType) {
          return sortConfig.direction === "asc"
            ? a.discountType.localeCompare(b.discountType)
            : b.discountType.localeCompare(a.discountType);
        }
        return sortConfig.direction === "asc"
          ? a.discountValue - b.discountValue
          : b.discountValue - a.discountValue;
      }

      if (sortConfig.key === "status") {
        // Sort by isActive status
        if (a.isActive === b.isActive) {
          return 0;
        }
        return sortConfig.direction === "asc"
          ? a.isActive
            ? 1
            : -1
          : a.isActive
          ? -1
          : 1;
      }

      if (sortConfig.key === "code") {
        return sortConfig.direction === "asc"
          ? a.code.localeCompare(b.code)
          : b.code.localeCompare(a.code);
      }

      if (sortConfig.key === "usage") {
        const aUsage = a.usedCount || 0;
        const bUsage = b.usedCount || 0;
        return sortConfig.direction === "asc"
          ? aUsage - bUsage
          : bUsage - aUsage;
      }

      return 0;
    });
  };

  // Filter and sort discounts
  const filteredDiscounts = discounts.filter((discount) =>
    discount.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedDiscounts = sortData(filteredDiscounts);

  // Calculate pagination values
  const indexOfLastDiscount = currentPage * itemsPerPage;
  const indexOfFirstDiscount = indexOfLastDiscount - itemsPerPage;
  const currentDiscounts = sortedDiscounts.slice(
    indexOfFirstDiscount,
    indexOfLastDiscount
  );
  const totalPages = Math.ceil(sortedDiscounts.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-discounts">
      <div className="discount-header">
        <h1 className="discount-title">Manage Discounts</h1>
        <button
          className="add-discount-btn"
          onClick={() => navigate("/admin/discounts/add")}
        >
          + Add New Discount
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by discount code..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="discounts-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("code")} className="sortable">
                Code{" "}
                {sortConfig.key === "code" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("value")} className="sortable">
                Value{" "}
                {sortConfig.key === "value" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("period")} className="sortable">
                Period{" "}
                {sortConfig.key === "period" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("usage")} className="sortable">
                Usage{" "}
                {sortConfig.key === "usage" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("status")} className="sortable">
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDiscounts.map((discount) => (
              <tr key={discount.discountId}>
                <td>{discount.code}</td>
                <td>
                  {discount.discountType === "Percentage"
                    ? `${discount.discountValue}%`
                    : `$${discount.discountValue}`}
                </td>
                <td>
                  {formatDate(discount.startDate)}
                  {discount.endDate ? ` - ${formatDate(discount.endDate)}` : ""}
                </td>
                <td>{`${discount.usedCount || 0} / ${
                  discount.usageLimit || "∞"
                }`}</td>
                <td>
                  <span
                    className={`status ${
                      discount.isActive ? "active" : "inactive"
                    }`}
                  >
                    {discount.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/admin/discounts/detail/${discount.discountId}`)
                    }
                  >
                    Detail
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteDiscount(discount.discountId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn nav-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* First page */}
          {currentPage > 2 && (
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
          )}

          {/* Ellipsis */}
          {currentPage > 3 && <span className="pagination-ellipsis">...</span>}

          {/* Current page and neighbors */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === currentPage ||
              pageNumber === currentPage - 1 ||
              pageNumber === currentPage + 1
            ) {
              return (
                <button
                  key={pageNumber}
                  className={`pagination-btn ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}

          {/* Ellipsis */}
          {currentPage < totalPages - 2 && (
            <span className="pagination-ellipsis">...</span>
          )}

          {/* Last page */}
          {currentPage < totalPages - 1 && (
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            className="pagination-btn nav-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageDiscount;
