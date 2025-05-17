import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./MiniCart.scss";

const MiniCart = ({ open, onClose, cartItems = [], onUpdateQty, onRemove }) => {
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="minicart-backdrop" onClick={onClose}>
      <div className="minicart-popup" onClick={(e) => e.stopPropagation()}>
        <h2 className="minicart-title">Giỏ hàng của bạn</h2>
        <div className="minicart-table-wrapper">
          <table className="minicart-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Xoá</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                cartItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <b>{item.price.toLocaleString()}đ</b>
                    </td>
                    <td>
                      <div className="minicart-qty">
                        <button
                          onClick={() =>
                            onUpdateQty(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateQty(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <b>{(item.price * item.quantity).toLocaleString()}đ</b>
                    </td>
                    <td>
                      <button
                        className="minicart-remove"
                        onClick={() => onRemove(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="minicart-summary">
          <div className="minicart-total-row">
            <span>
              <b>Tạm tính</b>
            </span>
            <span>
              <b>{getTotal().toLocaleString()}đ</b>
            </span>
          </div>
        </div>
        <div className="minicart-actions">
          <button className="minicart-continue" onClick={onClose}>
            TIẾP TỤC MUA HÀNG
          </button>
          <button
            className="minicart-checkout"
            onClick={() => {
              onClose();
              navigate("/cart");
            }}
          >
            TIẾN HÀNH THANH TOÁN
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;
