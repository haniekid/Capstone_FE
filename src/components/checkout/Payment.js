import React, { useState, useEffect } from "react";
import axios from "axios";

function Payment({
  onPaymentMethodChange,
  totalAmount,
  onPaymentStatusChange,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, success, failed
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);

  useEffect(() => {
    // Check payment status every 5 seconds if processing
    let interval;
    if (paymentStatus === "processing") {
      interval = setInterval(checkPaymentStatus, 5000);
    }
    return () => clearInterval(interval);
  }, [paymentStatus]);

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7089/api/vnpay/confirm"
      );
      if (response.data === "success") {
        setPaymentStatus("success");
        onPaymentStatusChange("success");
        setIsPaymentWindowOpen(false);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);
    onPaymentMethodChange(method);
  };

  const handleOnlinePayment = async () => {
    try {
      setPaymentStatus("processing");
      onPaymentStatusChange("processing");
      setIsPaymentWindowOpen(true);

      const response = await axios.get(
        `https://localhost:7089/api/Pay/CreatePaymentUrl?moneyToPay=${totalAmount}&description=Pay%20for%20food`,
        {
          headers: {
            accept: "text/plain",
          },
        }
      );

      if (response.data) {
        setPaymentUrl(response.data);
        window.open(response.data, "_blank", "width=800,height=600");
      }
    } catch (error) {
      console.error("Error creating payment URL:", error);
      setPaymentStatus("failed");
      onPaymentStatusChange("failed");
      setIsPaymentWindowOpen(false);
      alert("Failed to create payment URL. Please try again.");
    }
  };

  const renderPaymentStatus = () => {
    if (isPaymentWindowOpen) {
      return (
        <div className="payment-status processing">
          <h2> Waiting for Payment </h2>{" "}
          <p> Please complete your payment in the new window. </p>{" "}
          <p> Do not close this window until payment is complete. </p>{" "}
          <div className="payment-spinner"> </div>{" "}
        </div>
      );
    }

    switch (paymentStatus) {
      case "processing":
        return (
          <div className="payment-status">
            <p> Waiting for payment completion... </p>{" "}
            <p> Please complete the payment in the new window. </p>{" "}
          </div>
        );
      case "success":
        return (
          <div className="payment-status success">
            <p> Payment successful! </p>{" "}
            <p> You will be redirected to complete your order. </p>{" "}
          </div>
        );
      case "failed":
        return (
          <div className="payment-status error">
            <p> Payment failed.Please try again. </p>{" "}
          </div>
        );
      default:
        return (
          <div className="payment-options">
            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={handlePaymentMethodChange}
                />
                Cash{" "}
              </label>{" "}
              <p> You will pay in cash upon delivery or pickup. </p>{" "}
            </div>{" "}
            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={handlePaymentMethodChange}
                />
                Online Payment{" "}
              </label>{" "}
              <p> Pay securely with your credit card or bank transfer. </p>{" "}
            </div>{" "}
          </div>
        );
    }
  };

  console.log("Payment.js received totalAmount:", totalAmount);
  return (
    <div className="checkout-payment">
      <h1> PAYMENT OPTIONS </h1> <div className="line-divider"> </div>{" "}
      <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>
        Total to pay: {totalAmount.toLocaleString()}
        VND{" "}
      </div>{" "}
      {renderPaymentStatus()}{" "}
    </div>
  );
}

export default Payment;
