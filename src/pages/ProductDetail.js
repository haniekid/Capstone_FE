import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../assets/icons/icons";

import { useParams } from "react-router-dom";
import { useCart } from "../utils/hooks/useCart";
import { useProduct } from "../utils/hooks/useProduct";
import { useWishlist } from "../utils/hooks/useWishlist";
import { formatPrice } from "../utils/hooks/useUtil";

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { products, fetchProducts } = useProduct();
    const { wishlistItems, toggleWishlistItem } = useWishlist();
    const [selectedSize, setSelectedSize] = useState(null);
    const [defaultSize, setDefaultSize] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    useEffect(() => {
        console.log("Current ID:", id);
        fetchProducts();
    }, []);

    useEffect(() => {
        if (product) {
            console.log("Product Data:", product);
            console.log("List Image URLs:", product.listImageURL);
            if (!selectedSize) {
                const defaultIndex = product?.sizes.findIndex(
                    (size) => size.price === product.defaultPrice
                );
                setDefaultSize(defaultIndex);
            }
        }
    }, [selectedSize, product]);

    // Inline styles
    const containerStyle = {
        position: 'relative',
        padding: '0 50px'
    };

    const imageContainerStyle = {
        width: '700px',
        height: '500px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
    };

    const buttonStyle = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '45px',
        height: '45px',
        background: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        color: 'white',
        fontSize: '32px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        padding: 0,
        margin: 0,
        lineHeight: '45px',
        opacity: 0.7,
        '&:hover': {
            background: 'rgba(0, 0, 0, 0.7)',
            opacity: 1
        }
    };

    const prevButtonStyle = {
        ...buttonStyle,
        left: '10px'
    };

    const nextButtonStyle = {
        ...buttonStyle,
        right: '10px'
    };

    return (
        <>
            {product && (
                <div className="flex container">
                    <div className="product-detail-img" style={containerStyle}>
                        <div style={imageContainerStyle}>
                            <img
                                src={allImages[currentImageIndex]}
                                alt={`${product.name} view ${currentImageIndex + 1}`}
                                style={imageStyle}
                            />
                            <button
                                style={prevButtonStyle}
                                onClick={previousImage}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <button
                                style={nextButtonStyle}
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                    <div className="product-detail-about flex-1">
                        <h2>{product.brand}</h2>
                        <h1>{product.brand} {product.name}</h1>
                        <p>
                            {selectedSize
                                ? `${formatPrice(selectedSize?.price)}`
                                : `${formatPrice(product.defaultPrice)}`}
                        </p>
                        <div></div>
                        <div className="divider">
                            <button
                                onClick={() =>
                                    addToCart({
                                        product: product,
                                        size: selectedSize?.size || product.sizes[0].size,
                                        price: selectedSize?.price || product.defaultPrice,
                                    })
                                }
                            >
                                ADD TO BASKET
                            </button>
                            <button
                                className="second-button"
                                onClick={() => toggleWishlistItem(product)}
                            >
                                <span>WISHLIST</span>
                                <FontAwesomeIcon
                                    icon={itemExists ? icons.heartFull : icons.heart}
                                />
                            </button>
                        </div>
                        <p>{product.description}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetail;