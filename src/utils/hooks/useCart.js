import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  calculateSubtotal,
  getTotal,
  applyDiscount,
  clearCart,
} from "../../store/reducers/cartSlice";
import { formatPrice } from "./useUtil";

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const delivery = useSelector((state) => state.cart.delivery);
  const discount = useSelector((state) => state.cart.discount);
  const total = useSelector((state) => state.cart.total);
  const quantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = useSelector((state) => state.cart.discountAmount);

  useEffect(() => {
    dispatch(calculateSubtotal());
  }, [items, dispatch, quantity]);

  useEffect(() => {
    dispatch(getTotal());
  }, [subtotal, delivery, dispatch, discountAmount]);

  const addToCartHandler = (item) => {
    dispatch(addToCart(item));
  };

  const removeFromCartHandler = (itemId, size) => {
    const item = items.find(
      (item) => item.product.productID === itemId && item.size === size
    );
    if (item) {
      dispatch(removeFromCart({ productId: item.product.productID, size }));
    }
  };

  const updateQuantityHandler = (productId, size, newQuantity) => {
    const item = items.find(
      (item) => item.product.productID === productId && item.size === size
    );
    if (!item) return;
    const maxQuantity = item.product.quantity;
    if (newQuantity === 0) {
      dispatch(removeFromCart({ product: item.product, size }));
    } else if (newQuantity <= maxQuantity) {
      dispatch(updateQuantity({ productId, size, quantity: newQuantity }));
    }
  };

  const clearCartHandler = () => {
    dispatch(clearCart());
  };

  const applyDiscountHandler = (discountCode, discountAmount) => {
    dispatch(applyDiscount({ discountCode, discountAmount }));
  };

  return {
    addToCart: addToCartHandler,
    removeFromCart: removeFromCartHandler,
    updateQuantity: updateQuantityHandler,
    clearCart: clearCartHandler,
    applyDiscount: applyDiscountHandler,
    items,
    defaultSubtotal: subtotal,
    defaultTotal: total,
    subtotal: formatPrice(subtotal),
    delivery: formatPrice(delivery),
    total: formatPrice(total),
    quantity,
    discount,
  };
};
