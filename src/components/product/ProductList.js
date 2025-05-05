import React, { useState, useEffect } from "react";
import ProductCard from "./ProductItem";
import { useProduct } from "../../utils/hooks/useProduct";
import { useSelector, useDispatch } from "react-redux";
import { icons } from "../../assets/icons/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useToggle from "../../utils/hooks/useUtil";
import { filterProducts } from "../../store/reducers/productSlice";

function ProductList() {
  const dispatch = useDispatch();
  const { toggle, isToggled } = useToggle();
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    dispatch(
      filterProducts({
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        types: selectedType === "" ? [] : [selectedType],
      })
    );
  }, [minPrice, maxPrice, selectedType, dispatch]);

  // Filter out deleted products and then sort
  const filteredProducts = [...products]
    .filter((product) => product.isDeleted === false) // Only show non-deleted products
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
        <div className="filter-div toggle">
          <a onClick={() => toggle()}>
            <FontAwesomeIcon icon={icons.filter} />{" "}
          </a>{" "}
        </div>{" "}
        {isToggled() && (
          <div className="filter-option">
            <div className="filter-div">
              <label htmlFor="type"> Type: </label>{" "}
              <select
                id="type"
                name="type"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
              >
                <option value=""> All </option>{" "}
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {" "}
                    {type}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            <div className="filter-div filter-spec">
              <label htmlFor="price"> Price: </label>{" "}
              <input
                type="number"
                id="minPrice"
                placeholder="min"
                name="minPrice"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />{" "}
              <p> - </p>{" "}
              <input
                type="number"
                id="maxPrice"
                placeholder="max"
                name="maxPrice"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />{" "}
            </div>{" "}
            <div className="filter-div">
              <label> Sort by: </label>{" "}
              <select
                id="sort"
                name="sort"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value=""> Newest </option>{" "}
                <option value="lowToHigh"> Lowest to Highest </option>{" "}
                <option value="highToLow"> Highest to Lowest </option>{" "}
              </select>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div className="product-grid">
        {" "}
        {filteredProducts.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}{" "}
      </div>{" "}
    </div>
  );
}

export default ProductList;
