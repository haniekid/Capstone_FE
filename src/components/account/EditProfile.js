import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GHN_TOKEN = '7aae38b4-2b1d-11f0-afab-c2dd849a5f98';
const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api';
const HANOI_PROVINCE_ID = 201; // ID của Hà Nội

function EditProfile({ currentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '000084',
    password: '',
    roleName: 'Customer',
    isActivated: true,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for address form
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [address, setAddress] = useState('');

  // Load user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7089/api/User/${currentUser.userID}`
        );
        if (response.status === 200) {
          const userData = response.data;
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.addressDetail || '',
            city: '',
            postalCode: '000084',
            password: userData.password || '',
            roleName: userData.roleName || 'Customer',
            isActivated: userData.isActivated || true,
          });
          setSelectedDistrict(
            userData.districtID ? userData.districtID.toString() : ''
          );
          setSelectedWard(
            userData.wardCode ? userData.wardCode.toString() : ''
          );
          setAddress(userData.addressDetail || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại.');
      }
    };

    fetchUserData();
  }, [currentUser.userID]);

  // Fetch districts of Hanoi when component mounts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          `${GHN_API_URL}/master-data/district`,
          {
            headers: {
              token: GHN_TOKEN,
            },
            params: {
              province_id: HANOI_PROVINCE_ID,
            },
          }
        );
        if (response.data.code === 200) {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!selectedDistrict) return;
      try {
        const response = await axios.get(`${GHN_API_URL}/master-data/ward`, {
          headers: {
            token: GHN_TOKEN,
          },
          params: {
            district_id: selectedDistrict,
          },
        });
        if (response.data.code === 200) {
          setWards(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard('');
    setWards([]);
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const districtObj = districts.find(
        (d) => d.DistrictID == selectedDistrict
      );
      const wardObj = wards.find((w) => w.WardCode == selectedWard);

      console.log('Selected Ward:', selectedWard);
      console.log('Ward Object:', wardObj);

      const dataToUpdate = {
        userID: currentUser.userID,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || '',
        roleName: formData.roleName,
        isActivated: formData.isActivated,
        activationToken: currentUser.activationToken || '',
        resetPasswordToken: currentUser.resetPasswordToken || '',
        resetTokenExpiry:
          currentUser.resetTokenExpiry || new Date().toISOString(),
        districtID: parseInt(selectedDistrict) || 0,
        wardCode: wardObj ? wardObj.WardCode : 0,
        addressDetail: address,
      };

      console.log('Data to update:', dataToUpdate);

      const response = await axios.put(
        `https://localhost:7089/api/User/update-user`,
        dataToUpdate
      );

      if (response.status === 200) {
        alert('Cập nhật thông tin thành công!');
        navigate('/account');
      }
    } catch (err) {
      setError('Cập nhật thông tin thất bại. Vui lòng thử lại.');
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
      <h1> Chỉnh Sửa Thông Tin </h1>{' '}
      {error && <div className="error-message"> {error} </div>}{' '}
      <div className="profile-form">
        <div className="divider">
          <label>
            Tên{' '}
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />{' '}
          </label>{' '}
          <label>
            Họ{' '}
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />{' '}
          </label>{' '}
        </div>{' '}
        <label>
          Email{' '}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />{' '}
        </label>{' '}
        <label>
          Số Điện Thoại{' '}
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />{' '}
        </label>{' '}
        <h2> Địa Chỉ Giao Hàng </h2>{' '}
        <div className="shipping-address-form">
          <div className="form-group">
            <label className="input-label">
              Tỉnh / Thành phố{' '}
              <div className="input-wrapper">
                <input
                  type="text"
                  value="Hà Nội"
                  disabled
                  className="styled-input"
                />
              </div>{' '}
            </label>{' '}
          </div>{' '}
          <div className="form-group">
            <label className="input-label">
              Quận / Huyện{' '}
              <div className="input-wrapper">
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="styled-select"
                >
                  <option value=""> Chọn Quận / Huyện </option>{' '}
                  {districts.map((district) => (
                    <option
                      key={district.DistrictID}
                      value={district.DistrictID}
                    >
                      {' '}
                      {district.DistrictName}{' '}
                    </option>
                  ))}{' '}
                </select>{' '}
              </div>{' '}
            </label>{' '}
          </div>{' '}
          <div className="form-group">
            <label className="input-label">
              Phường / Xã{' '}
              <div className="input-wrapper">
                <select
                  value={selectedWard}
                  onChange={handleWardChange}
                  className="styled-select"
                  disabled={!selectedDistrict}
                >
                  <option value=""> Chọn Phường / Xã </option>{' '}
                  {wards.map((ward) => (
                    <option key={ward.WardCode} value={ward.WardCode}>
                      {' '}
                      {ward.WardName}{' '}
                    </option>
                  ))}{' '}
                </select>{' '}
              </div>{' '}
            </label>{' '}
          </div>{' '}
          <div className="form-group">
            <label className="input-label">
              Địa chỉ chi tiết{' '}
              <div className="input-wrapper">
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Nhập địa chỉ chi tiết"
                  className="styled-input"
                />
              </div>{' '}
            </label>{' '}
          </div>{' '}
        </div>{' '}
        <div className="divider">
          <button
            className="second-button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            HỦY{' '}
          </button>{' '}
          <button onClick={handleSave} disabled={isLoading}>
            {' '}
            {isLoading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}{' '}
          </button>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}

export default EditProfile;
