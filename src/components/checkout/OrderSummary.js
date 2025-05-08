import { useCart } from "../../utils/hooks/useCart";

function OrderSummary({ onPaymentComplete }) {
  const buttonStyles = {
    layout: "vertical",
    color: "blue",
    label: "checkout",
  };
  const { subtotal, delivery, discount, defaultTotal, clearCart } = useCart();

  const onApprove = async (data, actions) => {
    const order = await actions.order.capture();
    console.log("Order details:", order);
    const email = order.payer.email_address;
    const transactionId = order.purchase_units[0].payments.captures[0].id;
    clearCart();
    alert(
      `An order confirmation will be sent to email: ${email}. Transaction ID: ${transactionId}.`
    );
    onPaymentComplete();
  };

  return "";
}

export default OrderSummary;
