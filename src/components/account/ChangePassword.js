import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword({ currentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        'https://localhost:7089/api/User/change-password',
        {
          userId: currentUser.userID,
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/authentication');
        }, 2000);
      }
    } catch (err) {
      let errorMessage = 'Có lỗi xảy ra khi thay đổi mật khẩu';
      if (err.response && err.response.data) {
        errorMessage = err.response.data;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h1> Thay Đổi Mật Khẩu </h1>{' '}
      {error && <div className="error-message"> {error} </div>}{' '}
      {success && (
        <div className="success-message">
          Thay đổi mật khẩu thành công!Bạn sẽ được chuyển đến trang đăng
          nhập...{' '}
        </div>
      )}{' '}
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label>
            Mật khẩu hiện tại{' '}
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </label>{' '}
        </div>{' '}
        <div className="form-group">
          <label>
            Mật khẩu mới{' '}
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </label>{' '}
        </div>{' '}
        <div className="form-group">
          <label>
            Xác nhận mật khẩu mới{' '}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>{' '}
        </div>{' '}
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {' '}
            {isLoading ? 'ĐANG XỬ LÝ...' : 'THAY ĐỔI MẬT KHẨU'}{' '}
          </button>{' '}
        </div>{' '}
      </form>{' '}
    </div>
  );
}

export default ChangePassword;
