import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProduct } from "../../utils/hooks/useProduct";
import { deleteProduct } from "../../store/reducers/productSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";

function AdminProducts() {
  const dispatch = useDispatch();
  const { products, fetchProducts } = useProduct();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId));
        // Refresh the products list after deletion
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (isLoading) {
    return <div> Loading... </div>;
  }

  return (
    <div className="admin-products">
      <h1> Product Management </h1>{" "}
      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th> ID </th> <th> Name </th> <th> Type </th> <th> Price </th>{" "}
              <th> Description </th> <th> Actions </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {products.map((product) => (
              <tr key={product.productID}>
                <td> {product.productID} </td> <td> {product.name} </td>{" "}
                <td> {product.type} </td>{" "}
                <td>
                  {" "}
                  {product.defaultPrice}
                  kr{" "}
                </td>{" "}
                <td> {product.description} </td>{" "}
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.productID)}
                  >
                    <FontAwesomeIcon icon={icons.trash} />{" "}
                  </button>{" "}
                </td>{" "}
              </tr>
            ))}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
}

export default AdminProducts;
