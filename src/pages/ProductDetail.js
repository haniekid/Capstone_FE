import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../assets/icons/icons";
import { useParams } from "react-router-dom";
import { useCart } from "../utils/hooks/useCart";
import { useProduct } from "../utils/hooks/useProduct";
import { useWishlist } from "../utils/hooks/useWishlist";
import { formatPrice } from "../utils/hooks/useUtil";
import "../styles/productDetail.scss";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, fetchProducts } = useProduct();
  const { wishlistItems, toggleWishlistItem } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(null);
  const [defaultSize, setDefaultSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addOnProducts, setAddOnProducts] = useState([]);

  const product = products.find((product) => product?.productID === Number(id));
  const itemExists = wishlistItems.find(
    (item) => item?.productID === product?.productID
  );

  const allImages = product
    ? [product.imageURL, ...(product.listImageURL || [])]
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const fetchAddOnProducts = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7089/api/Product/GetAddOnProductByProductId/${id}`
      );
      setAddOnProducts(response.data);
    } catch (error) {
      console.error("Error fetching add-on products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAddOnProducts();
  }, [id]);

  useEffect(() => {
    if (product) {
      if (!selectedSize) {
        const defaultIndex = product?.sizes.findIndex(
          (size) => size.price === product.defaultPrice
        );
        setDefaultSize(defaultIndex);
      }
    }
  }, [selectedSize, product]);

  const handleAddAddOnToCart = (addOnProduct) => {
    addToCart({
      product: addOnProduct,
      price: addOnProduct.price,
      quantity: 1,
    });
  };

  return (
    <>
      {product && (
        <div className="product-detail-page">
          {/* Hero Section */}
          <section
            className="product-hero"
            style={{ backgroundImage: `url('${product.imageURL}')` }}
          >
            <div className="product-hero-overlay">
              <h1>{product.name}</h1>
            </div>
          </section>

          {/* Main Card Container */}
          <div className="product-detail-card">
            <div className="product-detail-img">
              <div className="image-slider">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${product.name} view ${currentImageIndex + 1}`}
                  className="main-image"
                />
                <button
                  className="slider-btn prev"
                  onClick={previousImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="slider-btn next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="product-detail-info">
              <h2>{product.name}</h2>
              <div className="brand">{product.brand}</div>
              {product.salePrice ? (
                <>
                  <div className="price sale-price">{formatPrice(product.salePrice)}</div>
                  <div className="price original-price">{formatPrice(product.defaultPrice)}</div>
                </>
              ) : (
                <div className="price">{formatPrice(product.defaultPrice)}</div>
              )}
              <div className="action-row">
                <button
                  className="add-to-cart-btn"
                  onClick={() =>
                    addToCart({
                      product,
                      price: product.salePrice || product.defaultPrice,
                      quantity: 1,
                    })
                  }
                >
                  Add to Basket
                </button>
                <button
                  className={`wishlist-btn${itemExists ? " active" : ""}`}
                  onClick={() => toggleWishlistItem(product)}
                >
                  <FontAwesomeIcon icon={icons.heart} />
                </button>
              </div>
              <div className="description">{product.description}</div>
            </div>
          </div>

          {/* Add-ons Section */}
          {addOnProducts.length > 0 && (
            <div className="add-ons-section">
              <h3>Add-ons</h3>
              <div className="add-ons-list">
                {addOnProducts.map((addOn) => (
                  <div className="add-on-card" key={addOn.productID}>
                    <div className="add-on-info">
                      <div className="add-on-name">{addOn.name}</div>
                      <div className="add-on-price">
                        {formatPrice(addOn.price)}
                      </div>
                    </div>
                    <button
                      className="add-on-btn"
                      onClick={() => handleAddAddOnToCart(addOn)}
                    >
                      Add to Basket
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ProductDetail;
