import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";
import axios from "axios";
import { filterProducts } from "../../store/reducers/productSlice";
import { useProduct } from "../../utils/hooks/useProduct";
import ProductCard from "./ProductItem";
import "./_product.scss";

const BASE_URL = "https://localhost:7089/api/ProductCategory";

// Helper function to remove accents from Vietnamese text
const removeAccents = (str) => {
    if (!str) return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
};

function ProductList() {
    const dispatch = useDispatch();
    const { products, fetchProducts } = useProduct();
    const {
        minPrice: filterMinPrice,
        maxPrice: filterMaxPrice,
        types: filterTypes,
    } = useSelector((state) => state.product.filter);
    const originalProducts = useSelector(
        (state) => state.product.originalProducts
    );

    const [minPrice, setMinPrice] = useState(filterMinPrice || "");
    const [maxPrice, setMaxPrice] = useState(filterMaxPrice || "");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedType, setSelectedType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOnlySale, setShowOnlySale] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(BASE_URL);
            // Lọc chỉ lấy các danh mục có isActive = true
            const activeCategories = response.data.filter(category => category.isActive);
            setCategories(activeCategories);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dispatch(
            filterProducts({
                minPrice: minPrice ? parseFloat(minPrice) : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
                types: selectedType === "" ? [] : [selectedType],
                searchQuery: searchQuery,
            })
        );
    }, [minPrice, maxPrice, selectedType, searchQuery, dispatch]);

    // Filter out deleted products and then sort
    const filteredProducts = [...products]
        .filter((product) => product.isDeleted === false)
        .filter((product) => {
            if (!searchQuery) return true;

            const searchLower = removeAccents(searchQuery);
            const name = removeAccents(product.name || "");
            const brand = removeAccents(product.brand || "");

            // Tìm kiếm chính xác
            if (name.includes(searchLower) || brand.includes(searchLower)) {
                return true;
            }

            // Tìm kiếm mềm - kiểm tra từng từ trong chuỗi tìm kiếm
            const searchWords = searchLower
                .split(/\s+/)
                .filter((word) => word.length > 0);
            return searchWords.every(
                (word) => name.includes(word) || brand.includes(word)
            );
        })
        .filter((product) => {
            if (!showOnlySale) return true;
            return product.salePrice > 0;
        })
        .sort((a, b) => {
            // Sắp xếp sản phẩm hết hàng xuống cuối
            if (a.quantity === 0 && b.quantity > 0) return 1;
            if (a.quantity > 0 && b.quantity === 0) return -1;
            
            // Sắp xếp theo giá
            if (sortOrder === "lowToHigh") {
                return a.defaultPrice - b.defaultPrice;
            } else if (sortOrder === "highToLow") {
                return b.defaultPrice - a.defaultPrice;
            } else {
                return 0;
            }
        });

    // Get unique types from non-deleted original products
    const uniqueTypes = [
        ...new Set(
            originalProducts
            .filter((product) => product.isDeleted === false)
            .map((product) => product.type)
        ),
    ];

    return (
        <div className="shop">
            <div className="search-bar-row">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Nhập tên sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">
                        <FontAwesomeIcon icon={icons.faSearch} />
                    </span>
                </div>
            </div>
            <div className="filter-control">
                <div className="filter-option">
                    <div className="filter-row">
                        <button
                            className={`sale-filter-button ${showOnlySale ? 'active' : ''}`}
                            onClick={() => setShowOnlySale(!showOnlySale)}
                        >
                            <FontAwesomeIcon icon={icons.faTag} />
                            Sản phẩm giảm giá
                        </button>
                    </div>
                    <div className="filter-row type-filter">
                        <label>Loại sản phẩm:</label>
                        <div className="type-buttons">
                            <button
                                className={`type-button ${selectedType === "" ? "active" : ""}`}
                                onClick={() => setSelectedType("")}
                            >
                                Tất cả
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.categoryId}
                                    className={`type-button ${
                                        selectedType === category.categoryName ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedType(category.categoryName)}
                                >
                                    {category.categoryName}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-row other-filters">
                        <div className="filter-div filter-spec">
                            <label>Giá:</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    id="minPrice"
                                    placeholder="Tối thiểu"
                                    name="minPrice"
                                    value={minPrice}
                                    onChange={(event) => setMinPrice(event.target.value)}
                                />
                                <p>-</p>
                                <input
                                    type="number"
                                    id="maxPrice"
                                    placeholder="Tối đa"
                                    name="maxPrice"
                                    value={maxPrice}
                                    onChange={(event) => setMaxPrice(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="filter-div">
                            <label>Sắp xếp theo:</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="sort-select"
                            >
                                <option value="asc">Mặc định</option>
                                <option value="lowToHigh">Giá tăng dần</option>
                                <option value="highToLow">Giá giảm dần</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-grid">
                {filteredProducts.length === 0 ? (
                    <div className="no-products-message">
                        Không tìm thấy sản phẩm nào.
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard 
                            key={product.productID} 
                            product={product} 
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default ProductList;