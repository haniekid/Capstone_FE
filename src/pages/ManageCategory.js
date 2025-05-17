import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import AccountMenu from "../components/account/AccountMenu";

const API_URL = "https://localhost:7089/api/ProductCategory";
const ADD_CATEGORY_URL = `${API_URL}/AddCategory`;
const UPDATE_CATEGORY_URL = `${API_URL}`;
const DELETE_CATEGORY_URL = `${API_URL}/DeleteCategoryById`;

const ManageCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
    isActive: true
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      // Sắp xếp danh mục: isActive = true trước, sau đó sắp xếp theo categoryId
      const sortedCategories = response.data.sort((a, b) => {
        // Sắp xếp theo isActive (true trước, false sau)
        if (a.isActive !== b.isActive) {
          return b.isActive ? 1 : -1;
        }
        // Nếu isActive giống nhau thì sắp xếp theo categoryId
        return a.categoryId - b.categoryId;
      });
      setCategories(sortedCategories);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(ADD_CATEGORY_URL, newCategory);
      setNewCategory({ categoryName: "", description: "", isActive: true });
      setShowAddForm(false);
      setError(null);
      await fetchCategories();
    } catch (err) {
      setError("Failed to add category: " + err.message);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${UPDATE_CATEGORY_URL}/${editingCategory.categoryId}`, editingCategory);
      setEditingCategory(null);
      setError(null);
      await fetchCategories();
    } catch (err) {
      setError("Failed to update category: " + err.message);
    }
  };

  const handleToggleCategory = async (categoryId, currentStatus) => {
    try {
      await axios.post(`${DELETE_CATEGORY_URL}/${categoryId}`);
      setCategories(categories.map(cat => 
        cat.categoryId === categoryId 
          ? { ...cat, isActive: !currentStatus }
          : cat
      ));
      setError(null);
    } catch (err) {
      setError("Failed to toggle category status: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, [name]: value });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container account">
      <AccountMenu />
      <div className="admin-categories">
        <div className="category-header">
          <h1 className="category-title">Quản Lý Danh Mục</h1>
          <button 
            className="add-category-btn"
            onClick={() => setShowAddForm(true)}
          >
            +Thêm Danh Mục Mới
          </button>
        </div>

        {showAddForm && (
          <div className="category-form">
            <h2>Thêm Danh Mục Mới</h2>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label htmlFor="categoryName">Tên Danh Mục:</label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={newCategory.categoryName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Mô Tả:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategory({ categoryName: "", description: "", isActive: true });
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="save-btn">
                  Thêm Mới
                </button>
              </div>
            </form>
          </div>
        )}

        {editingCategory && (
          <div className="category-form">
            <h2>Chỉnh Sửa Danh Mục</h2>
            <form onSubmit={handleUpdateCategory}>
              <div className="form-group">
                <label htmlFor="categoryName">Tên Danh Mục:</label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={editingCategory.categoryName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Mô Tả:</label>
                <textarea
                  id="description"
                  name="description"
                  value={editingCategory.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingCategory(null)}
                >
                  Hủy
                </button>
                <button type="submit" className="save-btn">
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="category-list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Danh Mục</th>
                <th>Mô Tả</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryId} className={!category.isActive ? "hidden-row" : ""}>
                  <td>{category.categoryId}</td>
                  <td>{category.categoryName}</td>
                  <td>{category.description}</td>
                  <td>
                    <span className={`status-badge ${category.isActive ? "visible" : "hidden"}`}>
                      {category.isActive ? "Đang hiển thị" : "Đã ẩn"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => setEditingCategory(category)}
                    >
                      Sửa
                    </button>
                    <button
                      className={category.isActive ? "hide-btn" : "show-btn"}
                      onClick={() => handleToggleCategory(category.categoryId, category.isActive)}
                    >
                      {category.isActive ? "Ẩn" : "Hiện"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategory; 