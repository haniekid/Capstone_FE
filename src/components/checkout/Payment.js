import React, { useState } from "react";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  return (
    <div className="checkout-payment">
      <h1>PAYMENT OPTIONS</h1>
      <div className="line-divider"></div>
      <div className="payment-option">
        <label>
          <input type="radio" value="cash" checked={true} readOnly />
          Cash
        </label>
      </div>
      <p>You will pay in cash upon delivery or pickup.</p>
    </div>
  );
}

export default Payment;
