import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { formatPrice } from "../utils/hooks/useUtil";

const API_URL =
  "https://localhost:7089/api/Product/GetProductsForAdminDashboard";
const DELETE_API_URL =
  "https://localhost:7089/api/Product/DeleteProductsForAdminDashboard";

const ManageProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "isDeleted",
    direction: "asc",
  });
  const itemsPerPage = 6;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${DELETE_API_URL}/${productId}`);
      // Refresh the products list after successful deletion
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product: " + err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      if (sortConfig.key === "isDeleted") {
        // Sort by isDeleted first (false comes before true)
        if (a.isDeleted !== b.isDeleted) {
          return sortConfig.direction === "asc"
            ? a.isDeleted
              ? 1
              : -1
            : a.isDeleted
            ? -1
            : 1;
        }
        // If isDeleted status is the same, sort by name as secondary criteria
        return a.name.localeCompare(b.name);
      }

      if (sortConfig.key === "price") {
        return sortConfig.direction === "asc"
          ? a.price - b.price
          : b.price - a.price;
      }

      if (sortConfig.key === "salePrice") {
        const aPrice = a.salePrice || a.price;
        const bPrice = b.salePrice || b.price;
        return sortConfig.direction === "asc"
          ? aPrice - bPrice
          : bPrice - aPrice;
      }

      if (sortConfig.key === "quantity") {
        return sortConfig.direction === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      }

      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortConfig.key === "type") {
        return sortConfig.direction === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }

      return 0;
    });
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedProducts = sortData(filteredProducts);

  // Calculate pagination values
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div> Loading... </div>;
  if (error) return <div> Error: {error} </div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Quản Lý Sản Phẩm</h1>
      <div className="admin-content">
        <button
          className="add-new-btn"
          onClick={() => navigate("/admin/products/add")}
        >
          +Thêm Sản Phẩm Mới{" "}
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} className="sortable">
                  Tên{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                </th>{" "}
                <th onClick={() => handleSort("type")} className="sortable">
                  Loại{" "}
                  {sortConfig.key === "type" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                </th>{" "}
                <th onClick={() => handleSort("price")} className="sortable">
                  Giá{" "}
                  {sortConfig.key === "price" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                </th>{" "}
                <th
                  onClick={() => handleSort("salePrice")}
                  className="sortable"
                >
                  Giá Khuyến Mãi{" "}
                  {sortConfig.key === "salePrice" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                </th>{" "}
                <th onClick={() => handleSort("quantity")} className="sortable">
                  Số Lượng{" "}
                  {sortConfig.key === "quantity" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                </th>{" "}
                <th> Hình Ảnh </th>{" "}
                <th
                  onClick={() => handleSort("isDeleted")}
                  className="sortable"
                >
                  Trạng Thái{" "}
                  {sortConfig.key === "isDeleted" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}{" "}
                </th>{" "}
                <th> Thao Tác </th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {currentProducts.map((product) => (
                <tr
                  key={product.productID}
                  className={product.isDeleted ? "deleted-row" : ""}
                >
                  <td> {product.name} </td> <td> {product.type} </td>{" "}
                  <td> {formatPrice(product.price)} </td>{" "}
                  <td>
                    {" "}
                    {product.salePrice
                      ? formatPrice(product.salePrice)
                      : "-"}{" "}
                  </td>{" "}
                  <td> {product.quantity} </td>{" "}
                  <td>
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />{" "}
                  </td>{" "}
                  <td>
                    <span
                      className={`status-badge ${
                        product.isDeleted ? "deleted" : "active"
                      }`}
                    >
                      {product.isDeleted ? "Đã Xóa" : "Đang Hoạt Động"}{" "}
                    </span>{" "}
                  </td>{" "}
                  <td>
                    <button
                      className="action-btn edit"
                      onClick={() =>
                        navigate(`/admin/products/detail/${product.productID}`)
                      }
                    >
                      Chi Tiết{" "}
                    </button>{" "}
                    <button
                      className="action-btn delete"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn có chắc chắn muốn xóa sản phẩm này?"
                          )
                        ) {
                          handleDelete(product.productID);
                        }
                      }}
                      disabled={product.isDeleted}
                    >
                      Xóa{" "}
                    </button>{" "}
                  </td>{" "}
                </tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous{" "}
            </button>{" "}
            {currentPage > 2 && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(1)}
              >
                1{" "}
              </button>
            )}{" "}
            {currentPage > 3 && (
              <span className="pagination-ellipsis"> ... </span>
            )}{" "}
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
                    {pageNumber}{" "}
                  </button>
                );
              }
              return null;
            })}{" "}
            {currentPage < totalPages - 2 && (
              <span className="pagination-ellipsis"> ... </span>
            )}{" "}
            {currentPage < totalPages - 1 && (
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}{" "}
              </button>
            )}{" "}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next{" "}
            </button>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};

export default ManageProduct;
