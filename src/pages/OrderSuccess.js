import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

function OrderSuccess() {
  const navigate = useNavigate();
  const handleTrackOrder = () => {
    // Chuyển sang /account, có thể truyền state nếu muốn mở đúng tab
    navigate("/account", { state: { tab: "orders" } });
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e0f7fa 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(37,99,235,0.08)",
          padding: "40px 32px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faCircleCheck}
          style={{
            color: "#22c55e",
            fontSize: 90,
            marginBottom: 24,
            animation: "pop 0.5s",
          }}
        />
        <h2 style={{ color: "#2563eb", marginBottom: 12, fontWeight: 700 }}>
          Đặt hàng thành công!
        </h2>
        <p style={{ marginBottom: 32, color: "#444", fontSize: 17 }}>
          Cảm ơn bạn đã đặt hàng.
          <br />
          Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
        </p>
        <button
          style={{
            background: "linear-gradient(90deg, #2563eb 0%, #22c55e 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 36px",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
            transition: "background 0.2s",
          }}
          onClick={handleTrackOrder}
        >
          Theo dõi đơn hàng
        </button>
      </div>
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.7);}
            80% { transform: scale(1.1);}
            100% { transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
}

export default OrderSuccess;
