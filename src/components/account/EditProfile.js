import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile({ currentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    address: currentUser.address || '',
    city: currentUser.city || '',
    postalCode: '000084', // Fixed postal code value
    password: '', // Hidden password field
    roleName: currentUser.roleName || 'User',
    isActivated: currentUser.isActivated || true
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `https://localhost:7089/api/User/${currentUser.userID}`,
        {
          ...formData,
          userID: currentUser.userID,
          activationToken: currentUser.activationToken || '',
          postalCode: '000084' // Ensure postal code is always 000084
        }
      );
      
      if (response.status === 200) {
        // Success - navigate back to account page
        navigate('/account');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/account');
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="profile-form">
        <div className="divider">
          <label>
            First Name
            <input 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>
          <label>
            Last Name
            <input 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>
        </div>
        <label>
          Email
          <input 
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone Number
          <input 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <h2>Shipping Details</h2>
        <label>
          Address
          <input 
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          City
          <input 
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </label>
        <div className="divider">
          <button 
            className='second-button' 
            onClick={handleCancel}
            disabled={isLoading}
          >
            CANCEL
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
