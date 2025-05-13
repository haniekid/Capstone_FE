import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin.css";

const BASE_URL = "https://localhost:7089/api/ProductCategory";

const ManageCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    categoryId: 0,
    categoryName: "",
    isActive: true
  });
  const [editedCategory, setEditedCategory] = useState({
    categoryId: 0,
    categoryName: "",
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isAdding) {
      setNewCategory(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setEditedCategory(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!newCategory.categoryName) {
        setError("Vui lòng nhập tên danh mục");
        return;
      }

      const response = await axios.post(`${BASE_URL}/AddCategory`, {
        categoryId: 0,
        categoryName: newCategory.categoryName,
        description: newCategory.description || "",
        isActive: true
      });

      if (response.status === 200) {
        setNewCategory({ categoryId: 0, categoryName: "", description: "", isActive: true });
        setIsAdding(false);
        await fetchCategories(); // Load lại danh sách sau khi thêm thành công
      }
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Có lỗi xảy ra khi thêm danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/${editingId}`, editedCategory);
      setEditingId(null);
      setEditedCategory({ categoryId: 0, categoryName: "", isActive: true });
      fetchCategories();
    } catch (err) {
      setError("Failed to update category");
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (category) => {
    if (window.confirm(`Bạn có chắc chắn muốn ${category.isActive ? 'ẩn' : 'hiện'} danh mục này?`)) {
      try {
        setLoading(true);
        if (category.isActive) {
          // Nếu đang hiển thị -> ẩn: gọi API xóa
          await axios.post(`${BASE_URL}/DeleteCategoryById/${category.categoryId}`);
        } else {
          // Nếu đang ẩn -> hiện: gọi API cập nhật với model đầy đủ
          const updatedCategory = {
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            description: category.description || "",
            isActive: true
          };
          await axios.put(`${BASE_URL}/${category.categoryId}`, updatedCategory);
        }
        fetchCategories();
      } catch (err) {
        setError(`Failed to ${category.isActive ? 'hide' : 'show'} category`);
        console.error("Error updating category visibility:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const startEditing = (category) => {
    setEditingId(category.categoryId);
    setEditedCategory(category);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedCategory({ categoryId: 0, categoryName: "", isActive: true });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Quản Lý Danh Mục</h1>

      <div className="admin-content">
        <div className="detail-header">
          <button
            className="add-btn"
            onClick={() => setIsAdding(true)}
          >
            Thêm Danh Mục Mới
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isAdding && (
          <form onSubmit={handleAddCategory} className="category-form">
            <div className="form-group">
              <label>Tên Danh Mục:</label>
              <input
                type="text"
                name="categoryName"
                value={newCategory.categoryName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Thêm
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsAdding(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        <div className="category-list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Danh Mục</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .sort((a, b) => {
                  // Sắp xếp theo isActive (active trước)
                  if (a.isActive !== b.isActive) {
                    return b.isActive ? 1 : -1;
                  }
                  // Nếu cùng trạng thái thì sắp xếp theo ID
                  return a.categoryId - b.categoryId;
                })
                .map((category) => (
                <tr key={category.categoryId} className={!category.isActive ? "hidden-row" : ""}>
                  <td>{category.categoryId}</td>
                  <td>
                    {editingId === category.categoryId ? (
                      <input
                        type="text"
                        name="categoryName"
                        value={editedCategory.categoryName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      category.categoryName
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${category.isActive ? 'visible' : 'hidden'}`}>
                      {category.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td>
                    {editingId === category.categoryId ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={handleEditCategory}
                        >
                          Lưu
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={cancelEditing}
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(category)}
                        >
                          Sửa
                        </button>
                        <button
                          className={category.isActive ? "hide-btn" : "show-btn"}
                          onClick={() => handleToggleVisibility(category)}
                        >
                          {category.isActive ? 'Ẩn' : 'Hiện'}
                        </button>
                      </>
                    )}
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