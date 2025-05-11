import React, { useState, useEffect } from "react";
import ProductCard from "./ProductItem";
import { useProduct } from "../../utils/hooks/useProduct";
import { useSelector, useDispatch } from "react-redux";
import { filterProducts } from "../../store/reducers/productSlice";

// Hàm chuyển đổi tiếng Việt có dấu thành không dấu
const removeAccents = (str) => {
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
    .sort((a, b) => {
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
      <div className="filter-control">
        <div className="filter-option">
          <div className="filter-row type-filter">
            <label> Loại sản phẩm: </label>{" "}
            <div className="type-buttons">
              <button
                className={`type-button ${selectedType === "" ? "active" : ""}`}
                onClick={() => setSelectedType("")}
              >
                Tất cả{" "}
              </button>{" "}
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  className={`type-button ${
                    selectedType === type ? "active" : ""
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="filter-row search-filter">
            <label> Tìm kiếm: </label>{" "}
            <input
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>{" "}
          <div className="filter-row other-filters">
            <div className="filter-div filter-spec">
              <label> Giá: </label>{" "}
              <div className="price-inputs">
                <input
                  type="number"
                  id="minPrice"
                  placeholder="Tối thiểu"
                  name="minPrice"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />{" "}
                <p> - </p>{" "}
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Tối đa"
                  name="maxPrice"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="filter-div">
              <label> Sắp xếp theo: </label>{" "}
              <select
                id="sort"
                name="sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value=""> Mới nhất </option>{" "}
                <option value="lowToHigh"> Giá tăng dần </option>{" "}
                <option value="highToLow"> Giá giảm dần </option>{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="product-grid">
        {" "}
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard product={product} key={index} />
          ))
        ) : (
          <div className="no-products-message">
            Không tìm thấy sản phẩm nào{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}

export default ProductList;
