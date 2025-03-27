import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/actions/manageProductActions";

function AdminManageProduct() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.manageProduct?.products || []);
  const loading = useSelector((state) => state.manageProduct?.loading);
  const error = useSelector((state) => state.manageProduct?.error);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    description: "",
    imageURL: "",
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCreate = () => {
    dispatch(addProduct(newProduct));
    setNewProduct({ name: "", type: "", description: "", imageURL: "" });
  };

  const handleUpdate = (id, updatedProduct) => {
    dispatch(updateProduct({ id, product: updatedProduct }));
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <div>
      <h1>Manage Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.productID}>
            <img src={product.imageURL} alt={product.name} width="100" />
            <h3>{product.name}</h3>
            <p>Type: {product.type}</p>
            <p>{product.description}</p>
            <button
              onClick={() => handleUpdate(product.productID, { ...product })}
            >
              Update
            </button>
            <button onClick={() => handleDelete(product.productID)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Type"
        value={newProduct.type}
        onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newProduct.description}
        onChange={(e) =>
          setNewProduct({ ...newProduct, description: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Image URL"
        value={newProduct.imageURL}
        onChange={(e) =>
          setNewProduct({ ...newProduct, imageURL: e.target.value })
        }
      />
      <button onClick={handleCreate}>Add Product</button>
    </div>
  );
}

export default AdminManageProduct;
