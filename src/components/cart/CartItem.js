import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../utils/hooks/useCart";
import { formatPrice } from "../../utils/hooks/useUtil";

function CartItem() {
  const { removeFromCart, updateQuantity, items } = useCart();

  return (
    <>
      {items.map((item) => {
        const maxQuantity = item.product.quantity;
        return (
          <div
            className="cart-item"
            key={`${item.product.productID}-${item.size}`}
          >
            <Link to={`/${item.product.productID}`}>
              <div className="cart-item-img">
                <img src={item.product.imageURL} alt={item.product.name} />
              </div>
            </Link>
            <div className="cart-item-about">
              <div className="cart-item-left">
                <Link to={`/${item.product.productID}`}>
                  <p>{item.product.name}</p>
                </Link>
                <p>Số lượng: {item.quantity}</p>
                <a
                  onClick={() =>
                    removeFromCart(item.product.productID, item.size)
                  }
                >
                  Xóa
                </a>
              </div>
              <div className="cart-item-right">
                <p className="price">{formatPrice(item.price)}</p>
                {item.salePrice && (
                  <p className="sale-price">{formatPrice(item.salePrice)}</p>
                )}
                <div className="cart-item-quantity">
                  <a
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQuantity(
                        item.product.productID,
                        item.size,
                        item.quantity - 1
                      )
                    }
                  >
                    -
                  </a>
                  <input
                    type="number"
                    min={1}
                    max={maxQuantity}
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      if (
                        !isNaN(newQuantity) &&
                        newQuantity > 0 &&
                        newQuantity <= maxQuantity
                      ) {
                        updateQuantity(
                          item.product.productID,
                          item.size,
                          newQuantity
                        );
                      }
                    }}
                  />
                  <a
                    onClick={() =>
                      item.quantity < maxQuantity &&
                      updateQuantity(
                        item.product.productID,
                        item.size,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default CartItem;
