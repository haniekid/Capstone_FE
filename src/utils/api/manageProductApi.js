import { variables } from "./variables.js";

const API_BASE_URL = variables.PRODUCT_API; // Change this to match your API

const api = {
  getProducts: async () => {
    const response = await fetch(API_BASE_URL);
    return response.json();
  },

  createProduct: async (product) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  updateProduct: async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  deleteProduct: async (id) => {
    await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
  },
};

export default api;
