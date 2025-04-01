import React from "react";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../store/reducers/productSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../assets/icons/icons";

function ProductsTable({ products, onDelete }) {
  const dispatch = useDispatch();

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId));
        onDelete(); // Refresh the products list after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
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
    </div>
  );
}

export default ProductsTable;
