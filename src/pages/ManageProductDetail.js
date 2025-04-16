import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin.css";

const BASE_URL = "https://localhost:7089/api/Product";
const TYPES_API_URL = `${BASE_URL}/GetProductTypesForAdminDashboard`;
const GET_PRODUCT_URL = `${BASE_URL}/GetProductsForAdminDashboard`;
const EDIT_PRODUCT_URL = `${BASE_URL}/EditProductsForAdminDashboard`;

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
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    fetchProductDetails();
    fetchProductTypes();
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
    setEditedProduct(prev => ({
      ...prev,
      listImageURL: updatedImages
    }));
  };

  const addImageField = () => {
    setEditedProduct(prev => ({
      ...prev,
      listImageURL: [...prev.listImageURL, ""]
    }));
  };

  const removeImageField = (index) => {
    setEditedProduct(prev => ({
      ...prev,
      listImageURL: prev.listImageURL.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Filter out empty image URLs
      const filteredImages = editedProduct.listImageURL.filter(url => url.trim() !== "");
      
      const formattedProduct = {
        ...editedProduct,
        listImageURL: filteredImages,
        saleStartDate: editedProduct.saleStartDate ? new Date(editedProduct.saleStartDate).toISOString() : null,
        saleEndDate: editedProduct.saleEndDate ? new Date(editedProduct.saleEndDate).toISOString() : null,
        price: Number(editedProduct.price),
        quantity: Number(editedProduct.quantity),
        salePrice: editedProduct.salePrice ? Number(editedProduct.salePrice) : null
      };

      await axios.put(`${EDIT_PRODUCT_URL}/${id}`, formattedProduct);
      setProduct(formattedProduct);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Product Details</h1>
      
      <div className="admin-content">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate("/admin/products")}>
            Back to Products
          </button>
          <button
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>

        <div className="product-detail-grid">
          <div className="product-main-info">
            <div className="form-group">
              <label>Name:</label>
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
              <label>Type:</label>
              {isEditing ? (
                <select
                  name="type"
                  value={editedProduct.type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select a type</option>
                  {productTypes.map((type, index) => (
                    <option key={index} value={type.type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{product.type}</span>
              )}
            </div>

            <div className="form-group">
              <label>Description:</label>
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
              <label>Price:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                />
              ) : (
                <span>${product.price}</span>
              )}
            </div>

            <div className="form-group">
              <label>Quantity:</label>
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
            <h3>Sale Information</h3>
            <div className="form-group">
              <label>Sale Price:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="salePrice"
                  value={editedProduct.salePrice || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{product.salePrice ? `$${product.salePrice}` : "No sale price"}</span>
              )}
            </div>

            <div className="form-group">
              <label>Sale Start Date:</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  name="saleStartDate"
                  value={editedProduct.saleStartDate ? editedProduct.saleStartDate.slice(0, 16) : ""}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{product.saleStartDate ? new Date(product.saleStartDate).toLocaleString() : "Not set"}</span>
              )}
            </div>

            <div className="form-group">
              <label>Sale End Date:</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  name="saleEndDate"
                  value={editedProduct.saleEndDate ? editedProduct.saleEndDate.slice(0, 16) : ""}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{product.saleEndDate ? new Date(product.saleEndDate).toLocaleString() : "Not set"}</span>
              )}
            </div>
          </div>

          <div className="product-images">
            <h3>Product Images</h3>
            <div className="form-group">
              <label>Main Image URL:</label>
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
              <label>Additional Images:</label>
              {isEditing ? (
                <div className="additional-images-container">
                  {editedProduct.listImageURL.map((url, index) => (
                    <div key={index} className="additional-image-input">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleAdditionalImageChange(index, e.target.value)}
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
      </div>
    </div>
  );
};

export default ManageProductDetail; 