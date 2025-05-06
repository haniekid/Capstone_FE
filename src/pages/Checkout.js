import React, { useState, useEffect, useRef } from "react";
import Payment from "../components/checkout/Payment";
import LogIn from "../components/checkout/LogIn";
import Shipping from "../components/checkout/Shipping";
import Confirmation from "../components/checkout/Confirmation";
import Complete from "../components/checkout/Complete";
import axios from "axios";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../store/reducers/userSlice";
import { useSelector } from "react-redux";

const tabs = ["Log In", "Shipping", "Payment", "Done"];

function Checkout() {
  const [activeTab, setActiveTab] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [totalAmount, setTotalAmount] = useState(0);
  const currentUser = useSelector(selectCurrentUser);
  const paymentRef = useRef(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // Get cart data from Redux store
  const cartItems = useSelector((state) => state.cart.items) || [];
  const cartTotal = useSelector((state) => state.cart.total) || 0;

  useEffect(() => {
    if (currentUser) {
      setActiveTab(1);
    }
  }, [currentUser]);

  useEffect(() => {
    // Calculate total from cartItems
    const total = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity, 10),
      0
    );
    setTotalAmount(total);
    console.log("Calculated total from cartItems:", total);
  }, [cartItems]);

  // Check payment status periodically when in processing state
  useEffect(() => {
    let interval;
    if (paymentStatus === "processing") {
      interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [paymentStatus]);

  const checkPaymentStatus = async () => {
    try {
      // Get the current URL parameters
      const urlParams = new URLSearchParams(window.location.search);

      // If we have payment parameters in the URL, use them
      if (
        urlParams.has("vnp_ResponseCode") &&
        urlParams.get("vnp_ResponseCode") === "00"
      ) {
        console.log(
          "Payment successful from URL parameters, moving to confirmation tab"
        );
        setPaymentStatus("success");
        handlePaymentStatusChange("success");
        setActiveTab(3); // Move to confirmation tab
        return;
      }

      // Otherwise check with the backend
      const response = await axios.get(
        "https://localhost:7089/api/pay/confirm"
      );
      console.log("Payment confirmation response:", response.data);

      if (response.data && response.data.includes("Thanh toán thành công")) {
        console.log(
          "Payment successful from backend, moving to confirmation tab"
        );
        setPaymentStatus("success");
        handlePaymentStatusChange("success");
        setActiveTab(3); // Move to confirmation tab
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  useEffect(() => {
    if (paymentStatus === "success") {
      setActiveTab(4);
    }
  }, [paymentStatus]);

  useEffect(() => {
    let interval;
    if (activeTab === 2 && paymentStatus === "processing" && createdOrderId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(
            `https://localhost:7089/api/Order/GetOrderById/${createdOrderId}`
          );
          if (
            res.data &&
            (res.data.status === "Paid" || res.data.status === 5)
          ) {
            setPaymentStatus("success");
            setActiveTab(3); // Move to Confirm tab
          }
        } catch (err) {
          console.error("Error polling order status:", err);
        }
      }, 10000); // every 10 seconds
    }
    return () => clearInterval(interval);
  }, [activeTab, paymentStatus, createdOrderId]);

  const isLastTab = activeTab === tabs.length - 1;
  const isSecondLastTab = activeTab === tabs.length - 2;

  const onPaymentComplete = () => {
    setActiveTab(4);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentStatusChange = (status) => {
    setPaymentStatus(status);
  };

  const handleNext = async () => {
    if (activeTab === 2) {
      // Prepare the OrderDTO payload
      const orderPayload = {
        order: {
          dateTime: new Date().toISOString(),
          totalPrice: totalAmount,
          status: 0, // e.g., 0 = pending
          userID: parseInt(currentUser.userID, 10),
        },
        orderItems: cartItems.map((item) => ({
          quantity: item.quantity,
          orderID: 0, // backend will set this
          ProductPriceID: item.product.productID,
        })),
      };
      console.log("Order payload:", orderPayload);

      if (paymentMethod === "online") {
        try {
          const response = await axios.post(
            "https://localhost:7089/api/Pay/CreatePaymentUrl",
            orderPayload,
            {
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
            }
          );

          if (
            response.data &&
            response.data.paymentUrl &&
            response.data.orderId !== undefined
          ) {
            setCreatedOrderId(response.data.orderId); // Save orderId for polling
            console.log("Opening payment URL:", response.data.paymentUrl);
            window.open(
              response.data.paymentUrl,
              "_blank",
              "width=800,height=600"
            );
            setPaymentStatus("processing");
            handlePaymentStatusChange("processing");
          }
        } catch (error) {
          console.error("Error creating payment URL:", error);
          alert("Failed to create payment URL. Please try again.");
        }
        return;
      } else {
        // For cash or other methods, you may want to create the order as well
        try {
          await axios.post(
            "https://localhost:7089/api/Pay/CreatePaymentUrl",
            orderPayload,
            {
              headers: {
                "Content-Type": "application/json",
                accept: "text/plain",
              },
            }
          );
          setActiveTab(3); // Go directly to Done tab
        } catch (error) {
          alert("Failed to create order. Please try again.");
          console.error(error);
        }
        return;
      }
    }
    setActiveTab(activeTab + 1);
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <nav className="checkout-nav">
          {" "}
          {tabs.map((tab, index) => (
            <React.Fragment key={tab}>
              <div
                className={`checkout-tab ${
                  index === activeTab ? "active" : ""
                }`}
              >
                <span className={index < activeTab ? "completed" : ""}>
                  {" "}
                  {index + 1}{" "}
                </span>{" "}
                <p> {tab} </p>{" "}
              </div>{" "}
              {index < tabs.length - 1 && (
                <div
                  className={`checkout-tab-line ${
                    index < activeTab ? "completed" : ""
                  }`}
                />
              )}{" "}
            </React.Fragment>
          ))}{" "}
        </nav>{" "}
        <div className="checkout-content">
          {" "}
          {activeTab === 0 && <LogIn />} {activeTab === 1 && <Shipping />}{" "}
          {activeTab === 2 && (
            <Payment
              ref={paymentRef}
              onPaymentMethodChange={handlePaymentMethodChange}
              onPaymentStatusChange={handlePaymentStatusChange}
              totalAmount={totalAmount}
            />
          )}{" "}
          {activeTab === 3 && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <h2> Cảm ơn bạn đã đặt hàng </h2>{" "}
              <Link to="/account">
                <button style={{ marginTop: "1rem" }}>
                  {" "}
                  Đến Trang Cá Nhân{" "}
                </button>{" "}
              </Link>{" "}
            </div>
          )}{" "}
        </div>{" "}
        <div className="checkout-bottom">
          {" "}
          {!isLastTab ? (
            activeTab === 0 ? (
              <Link to="/cart">
                <button className="second-button"> Quay Lại </button>{" "}
              </Link>
            ) : (
              <button
                className="second-button"
                onClick={() => setActiveTab(activeTab - 1)}
              >
                Quay Lại{" "}
              </button>
            )
          ) : null}{" "}
          {currentUser && activeTab < tabs.length - 1 && (
            <button onClick={handleNext}> Tiếp Tục </button>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

export default Checkout;
