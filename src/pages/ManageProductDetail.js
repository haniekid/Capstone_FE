import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin.css";
import { formatPrice } from "../utils/hooks/useUtil";

const BASE_URL = "https://localhost:7089/api/Product";
const TYPES_API_URL = `${BASE_URL}/GetProductTypesForAdminDashboard`;
const GET_PRODUCT_URL = `${BASE_URL}/GetProductsForAdminDashboard`;
const EDIT_PRODUCT_URL = `${BASE_URL}/EditProductsForAdminDashboard`;
const ADD_ONS_API_URL = `${BASE_URL}/GetAddOnProductByProductId`;
const INSERT_ADDON_API_URL = `${BASE_URL}/InsertAddOnProductByProductId`;
const DELETE_ADDON_API_URL = `${BASE_URL}/DeleteAddOnProductByProductId`;

const ManageProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    type: "",
    description: "",
    imageURL: "",
    price: 0,
    quantity: 0,
    listImageURL: [],
    salePrice: null,
    saleStartDate: null,
    saleEndDate: null,
    catergoryId: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [addOns, setAddOns] = useState([]);
  const [toppingProducts, setToppingProducts] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState("");
  const [addOnLoading, setAddOnLoading] = useState(false);
  const [addOnError, setAddOnError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
    fetchProductTypes();
    fetchAddOns();
    fetchToppingProducts();
  }, [id]);

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get(TYPES_API_URL);
      setProductTypes(response.data);
    } catch (err) {
      console.error("Error fetching product types:", err);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${GET_PRODUCT_URL}/${id}`);
      setProduct(response.data);
      setEditedProduct(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddOns = async () => {
    try {
      const response = await axios.get(`${ADD_ONS_API_URL}/${id}`);
      setAddOns(response.data);
    } catch (err) {
      console.error("Error fetching add-on products:", err);
    }
  };

  const fetchToppingProducts = async () => {
    try {
      const response = await axios.get(`${GET_PRODUCT_URL}`);
      const toppings = response.data.filter((p) => p.type === "Topping");
      setToppingProducts(toppings);
    } catch (err) {
      console.error("Error fetching topping products:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdditionalImageChange = (index, value) => {
    const updatedImages = [...editedProduct.listImageURL];
    updatedImages[index] = value;
    setEditedProduct((prev) => ({
      ...prev,
      listImageURL: updatedImages,
    }));
  };

  const addImageField = () => {
    setEditedProduct((prev) => ({
      ...prev,
      listImageURL: [...prev.listImageURL, ""],
    }));
  };

  const removeImageField = (index) => {
    setEditedProduct((prev) => ({
      ...prev,
      listImageURL: prev.listImageURL.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Filter out empty image URLs
      const filteredImages = editedProduct.listImageURL.filter(
        (url) => url.trim() !== ""
      );

      // Find the selected category
      const selectedCategory = productTypes.find(type => type.categoryName === editedProduct.type);

      const formattedProduct = {
        ...editedProduct,
        listImageURL: filteredImages,
        saleStartDate: editedProduct.saleStartDate
          ? new Date(editedProduct.saleStartDate).toISOString()
          : null,
        saleEndDate: editedProduct.saleEndDate
          ? new Date(editedProduct.saleEndDate).toISOString()
          : null,
        price: Number(editedProduct.price),
        quantity: Number(editedProduct.quantity),
        salePrice: editedProduct.salePrice
          ? Number(editedProduct.salePrice)
          : null,
        catergoryId: selectedCategory ? selectedCategory.categoryId : 0
      };

      console.log('Sending product data:', formattedProduct);
      await axios.put(`${EDIT_PRODUCT_URL}/${id}`, formattedProduct);
      setProduct(formattedProduct);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(
        err.response?.data?.message || err.message || "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddOn = async () => {
    if (!selectedAddOn) return;
    setAddOnLoading(true);
    setAddOnError(null);
    try {
      await axios.post(INSERT_ADDON_API_URL, {
        productId: Number(id),
        addOnProductId: Number(selectedAddOn),
      });
      setSelectedAddOn("");
      fetchAddOns();
    } catch (err) {
      setAddOnError("Failed to add add-on product.");
    } finally {
      setAddOnLoading(false);
    }
  };

  const handleDeleteAddOn = async (addOnProductId) => {
    setAddOnLoading(true);
    setAddOnError(null);
    try {
      await axios.post(DELETE_ADDON_API_URL, {
        productId: Number(id),
        addOnProductId: Number(addOnProductId),
      });
      fetchAddOns();
    } catch (err) {
      setAddOnError("Failed to delete add-on product.");
    } finally {
      setAddOnLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Chi Tiết Sản Phẩm</h1>

      <div className="admin-content">
        <div className="detail-header">
          <button
            className="back-btn"
            onClick={() => navigate("/admin/products")}
          >
            Quay Lại Danh Sách Sản Phẩm
          </button>
          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Hủy" : "Chỉnh Sửa"}
          </button>
          {isEditing && (
            <button className="save-btn" onClick={handleSave}>
              Lưu Thay Đổi
            </button>
          )}
        </div>

        <div className="product-detail-grid">
          <div className="product-main-info">
            <div className="form-group">
              <label>Tên:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{product.name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Loại:</label>
              {isEditing ? (
                <select
                  name="type"
                  value={editedProduct.type}
                  onChange={(e) => {
                    const selectedType = productTypes.find(type => type.categoryName === e.target.value);
                    setEditedProduct(prev => ({
                      ...prev,
                      type: e.target.value,
                      catergoryId: selectedType ? selectedType.categoryId : 0
                    }));
                  }}
                  className="form-select"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  {productTypes.map((type) => (
                    <option key={type.categoryId} value={type.categoryName}>
                      {type.categoryName}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{product.type}</span>
              )}
            </div>

            <div className="form-group">
              <label>Mô Tả:</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{product.description}</span>
              )}
            </div>

            <div className="form-group">
              <label>Giá:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="form-group">
              <label>Số Lượng:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="quantity"
                  value={editedProduct.quantity}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{product.quantity}</span>
              )}
            </div>
          </div>

          <div className="product-sale-info">
            <h3>Thông Tin Khuyến Mãi</h3>
            <div className="form-group">
              <label>Giá Khuyến Mãi:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="salePrice"
                  value={editedProduct.salePrice || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <span>
                  {product.salePrice
                    ? formatPrice(product.salePrice)
                    : "Không có khuyến mãi"}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Ngày Bắt Đầu Khuyến Mãi:</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  name="saleStartDate"
                  value={
                    editedProduct.saleStartDate
                      ? editedProduct.saleStartDate.slice(0, 16)
                      : ""
                  }
                  onChange={handleInputChange}
                />
              ) : (
                <span>
                  {product.saleStartDate
                    ? new Date(product.saleStartDate).toLocaleString()
                    : "Chưa thiết lập"}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Ngày Kết Thúc Khuyến Mãi:</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  name="saleEndDate"
                  value={
                    editedProduct.saleEndDate
                      ? editedProduct.saleEndDate.slice(0, 16)
                      : ""
                  }
                  onChange={handleInputChange}
                />
              ) : (
                <span>
                  {product.saleEndDate
                    ? new Date(product.saleEndDate).toLocaleString()
                    : "Chưa thiết lập"}
                </span>
              )}
            </div>
          </div>

          <div className="product-images">
            <h3>Hình Ảnh Sản Phẩm</h3>
            <div className="form-group">
              <label>URL Hình Ảnh Chính:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="imageURL"
                  value={editedProduct.imageURL}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <div className="image-preview">
                  <img src={product.imageURL} alt={product.name} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Hình Ảnh Bổ Sung:</label>
              {isEditing ? (
                <div className="additional-images-container">
                  {editedProduct.listImageURL.map((url, index) => (
                    <div key={index} className="additional-image-input">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) =>
                          handleAdditionalImageChange(index, e.target.value)
                        }
                        placeholder="Nhập URL hình ảnh"
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
                    + Thêm Hình Ảnh
                  </button>
                </div>
              ) : (
                <div className="additional-images">
                  {product.listImageURL.map((url, index) => (
                    <div key={index} className="image-preview">
                      <img src={url} alt={`${product.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add-On Products Section */}
        <div className="addon-section">
          <h2>Sản Phẩm Bổ Sung</h2>
          {/* Add Add-On Product */}
          <div className="add-addon-form">
            <select
              value={selectedAddOn}
              onChange={(e) => setSelectedAddOn(e.target.value)}
              disabled={addOnLoading}
            >
              <option value="">Chọn topping để thêm...</option>
              {toppingProducts
                .filter(
                  (tp) =>
                    !addOns.some((addOn) => addOn.productID === tp.productID)
                )
                .map((tp) => (
                  <option key={tp.productID} value={tp.productID}>
                    {tp.name} ({formatPrice(tp.price)} ₫)
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddAddOn}
              disabled={!selectedAddOn || addOnLoading}
            >
              {addOnLoading ? "Đang Thêm..." : "Thêm"}
            </button>
            {addOnError && <span className="error-msg">{addOnError}</span>}
          </div>
          {addOns.length === 0 ? (
            <div>Không tìm thấy sản phẩm bổ sung.</div>
          ) : (
            <table className="addon-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Giá (VND)</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {addOns.map((addOn, idx) => (
                  <tr key={addOn.productID}>
                    <td>{idx + 1}</td>
                    <td>{addOn.name}</td>
                    <td>{formatPrice(addOn.price)} ₫</td>
                    <td>
                      <button
                        className="delete-addon-btn"
                        onClick={() => handleDeleteAddOn(addOn.productID)}
                        disabled={addOnLoading}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProductDetail;
