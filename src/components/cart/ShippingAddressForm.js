import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";

const GHN_TOKEN = "7aae38b4-2b1d-11f0-afab-c2dd849a5f98";
const GHN_API_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const HANOI_PROVINCE_ID = 201; // ID của Hà Nội
const HO_TAY_DISTRICT_ID = 1542; // ID của quận Tây Hồ
const HO_TAY_WARD_CODE = "20314"; // ID của phường Xuân La

function ShippingAddressForm({
  hideTitle,
  onShippingFeeChange,
  shippingMethod,
  onAddressChange,
}) {
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [error, setError] = useState(null);

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
        console.error("Error fetching districts:", error);
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
        console.error("Error fetching wards:", error);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  // Calculate shipping fee when ward is selected
  useEffect(() => {
    const calculateShippingFee = async () => {
      if (!selectedDistrict || !selectedWard) {
        setShippingFee(null);
        if (onShippingFeeChange) onShippingFeeChange(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${GHN_API_URL}/v2/shipping-order/fee`,
          {
            headers: {
              token: GHN_TOKEN,
            },
            params: {
              service_type_id: 2, // Standard delivery
              insurance_value: 500000, // Giá trị hàng hóa
              from_district_id: HO_TAY_DISTRICT_ID,
              to_district_id: selectedDistrict,
              to_ward_code: selectedWard,
              height: 15,
              length: 15,
              weight: 1000,
              width: 15,
            },
          }
        );

        if (response.data.code === 200) {
          const fee = response.data.data.service_fee;
          setShippingFee(fee);
          if (onShippingFeeChange) onShippingFeeChange(fee);
        } else {
          setError("Không thể tính phí vận chuyển");
          if (onShippingFeeChange) onShippingFeeChange(0);
        }
      } catch (error) {
        console.error("Error calculating shipping fee:", error);
        setError("Có lỗi xảy ra khi tính phí vận chuyển");
        if (onShippingFeeChange) onShippingFeeChange(0);
      } finally {
        setLoading(false);
      }
    };

    calculateShippingFee();
  }, [selectedDistrict, selectedWard]);

  // Khi shippingMethod chuyển sang 'home', gửi lại phí hiện tại lên cha
  useEffect(() => {
    if (shippingMethod === "home" && shippingFee) {
      if (onShippingFeeChange) onShippingFeeChange(shippingFee);
    }
  }, [shippingMethod]);

  // Gửi địa chỉ lên cha khi district, ward, address thay đổi
  useEffect(() => {
    if (onAddressChange) {
      const districtObj = districts.find(
        (d) => d.DistrictID == selectedDistrict
      );
      const wardObj = wards.find((w) => w.WardCode == selectedWard);
      onAddressChange({
        districtId: selectedDistrict,
        districtName: districtObj ? districtObj.DistrictName : "",
        wardCode: selectedWard,
        wardName: wardObj ? wardObj.WardName : "",
        addressDetail: address,
      });
    }
  }, [selectedDistrict, selectedWard, address, districts, wards]);

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard("");
    setWards([]);
    setShippingFee(null);
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  return (
    <div className="shipping-address-form">
      {!hideTitle && <h3>Địa Chỉ Giao Hàng</h3>}
      <div className="form-group">
        <label className="input-label">
          Tỉnh/Thành phố
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.location} className="input-icon" />
            <input
              type="text"
              value="Hà Nội"
              disabled
              className="styled-input"
            />
          </div>
        </label>
      </div>

      <div className="form-group">
        <label className="input-label">
          Quận/Huyện
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.location} className="input-icon" />
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="styled-select"
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div className="form-group">
        <label className="input-label">
          Phường/Xã
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.location} className="input-icon" />
            <select
              value={selectedWard}
              onChange={handleWardChange}
              className="styled-select"
              disabled={!selectedDistrict}
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div className="form-group">
        <label className="input-label">
          Địa chỉ chi tiết
          <div className="input-wrapper">
            <FontAwesomeIcon icon={icons.home} className="input-icon" />
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Nhập địa chỉ chi tiết"
              className="styled-input"
            />
          </div>
        </label>
      </div>

      {loading && <p className="loading">Đang tính phí vận chuyển...</p>}
      {error && <p className="error-message">{error}</p>}
      {shippingFee && (
        <div className="shipping-fee">
          <p>Phí vận chuyển: {shippingFee.toLocaleString("vi-VN")}đ</p>
        </div>
      )}
    </div>
  );
}

export default ShippingAddressForm;
