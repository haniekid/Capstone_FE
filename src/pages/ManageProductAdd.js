import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin.css";

const BASE_URL = "https://localhost:7089/api/Product";
const TYPES_API_URL = `${BASE_URL}/GetProductTypesForAdminDashboard`;
const ADD_PRODUCT_URL = `${BASE_URL}/AddProductsForAdminDashboard`;

const ManageProductAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productID: 0,
    name: "",
    type: "",
    description: "",
    imageURL: "",
    price: 0,
    quantity: 0,
    listImageURL: [""],
    salePrice: 0,
    saleStartDate: "",
    saleEndDate: "",
    catergoryId: 0
  });

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(TYPES_API_URL);
      setProductTypes(response.data);
    } catch (err) {
      console.error("Error fetching product types:", err);
      setError("Failed to load product types");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdditionalImageChange = (index, value) => {
    const updatedImages = [...newProduct.listImageURL];
    updatedImages[index] = value;
    setNewProduct((prev) => ({
      ...prev,
      listImageURL: updatedImages,
    }));
  };

  const addImageField = () => {
    setNewProduct((prev) => ({
      ...prev,
      listImageURL: [...prev.listImageURL, ""],
    }));
  };

  const removeImageField = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      listImageURL: prev.listImageURL.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Filter out empty image URLs
      const filteredImages = newProduct.listImageURL.filter(
        (url) => url.trim() !== ""
      );

      // Find the selected category
      const selectedCategory = productTypes.find(type => type.categoryName === newProduct.type);

      // Format dates if they exist
      const formattedProduct = {
        ...newProduct,
        listImageURL: filteredImages,
        saleStartDate: newProduct.saleStartDate
          ? new Date(newProduct.saleStartDate).toISOString()
          : null,
        saleEndDate: newProduct.saleEndDate
          ? new Date(newProduct.saleEndDate).toISOString()
          : null,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
        catergoryId: selectedCategory ? selectedCategory.categoryId : 0
      };

      console.log('Sending product data:', formattedProduct);
      await axios.post(ADD_PRODUCT_URL, formattedProduct);
      navigate("/admin/products");
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(
        err.response?.data?.message || err.message || "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Thêm Sản Phẩm Mới</h1>

      <div className="admin-content">
        <div className="detail-header">
          <button
            className="back-btn"
            onClick={() => navigate("/admin/products")}
          >
            Quay Lại Danh Sách Sản Phẩm
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-detail-grid">
            <div className="product-main-info">
              <div className="form-group">
                <label>Tên:</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Loại:</label>
                <select
                  name="type"
                  value={newProduct.type}
                  onChange={(e) => {
                    const selectedType = productTypes.find(type => type.categoryName === e.target.value);
                    setNewProduct(prev => ({
                      ...prev,
                      type: e.target.value,
                      catergoryId: selectedType ? selectedType.categoryId : 0
                    }));
                  }}
                  className="form-select"
                  required
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {productTypes.map((type) => (
                    <option key={type.categoryId} value={type.categoryName}>
                      {type.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Mô Tả:</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giá:</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label>Số Lượng:</label>
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="product-sale-info">
              <h3>Thông Tin Khuyến Mãi</h3>
              <div className="form-group">
                <label>Giá Khuyến Mãi:</label>
                <input
                  type="number"
                  name="salePrice"
                  value={newProduct.salePrice}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                />
              </div>

              <div className="form-group">
                <label>Ngày Bắt Đầu Khuyến Mãi:</label>
                <input
                  type="datetime-local"
                  name="saleStartDate"
                  value={newProduct.saleStartDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Ngày Kết Thúc Khuyến Mãi:</label>
                <input
                  type="datetime-local"
                  name="saleEndDate"
                  value={newProduct.saleEndDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="product-images">
              <h3>Product Images</h3>
              <div className="form-group">
                <label>Main Image URL:</label>
                <input
                  type="text"
                  name="imageURL"
                  value={newProduct.imageURL}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Additional Images:</label>
                <div className="additional-images-container">
                  {newProduct.listImageURL.map((url, index) => (
                    <div key={index} className="additional-image-input">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) =>
                          handleAdditionalImageChange(index, e.target.value)
                        }
                        placeholder="Enter image URL"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImageField(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-image-btn"
                    onClick={addImageField}
                  >
                    + Add Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageProductAdd;
