import React from "react";

function OrderTable({ user, selectedOrder }) {
  const handleStatusChange = (event) => {
    const newStatus = parseInt(event.target.value);
  };

  return (
    <>
      <div className="divider">
        <label>
          Tên
          <input value={user?.firstName || ""} readOnly />
        </label>
        <label>
          Họ
          <input value={user?.lastName || ""} readOnly />
        </label>
      </div>
      <label>
        Email
        <input value={user?.email || ""} readOnly />
      </label>
      <label>
        Số Điện Thoại
        <input value={user?.phone || ""} readOnly />
      </label>
      <div className="divider">
        <label>
          Mã Bưu Điện
          <input value={user?.postalCode || ""} readOnly />
        </label>
        <label>
          Thành Phố
          <input value={user?.city || ""} readOnly />
        </label>
      </div>
      <label>
        Địa Chỉ
        <input value={user?.address || ""} readOnly />
      </label>
      <div className="divider">
        <label>
          Cập Nhật Trạng Thái
          <select
            name="status"
            value={selectedOrder?.status}
            onChange={(e) => handleStatusChange(e)}
          >
            <option value={0} disabled={selectedOrder?.status === 0}>
              Chờ Xử Lý
            </option>
            <option value={1} disabled={selectedOrder?.status === 1}>
              Đang Xử Lý
            </option>
            <option value={2} disabled={selectedOrder?.status === 2}>
              Đang Giao Hàng
            </option>
            <option value={3} disabled={selectedOrder?.status === 3}>
              Đã Giao Hàng
            </option>
            <option value={4} disabled={selectedOrder?.status === 4}>
              Đã Hủy
            </option>
          </select>
        </label>

        <label>
          Tổng Tiền
          <input value={selectedOrder?.totalPrice || ""} readOnly />
        </label>
      </div>
    </>
  );
}

export default OrderTable;
