import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api/manageProductApi";

export const fetchProducts = createAsyncThunk(
    "manageProduct/fetch",
    async() => {
        const response = await api.getProductsForAdminDashboard();
        return response;
    }
);

export const addProduct = createAsyncThunk(
    "manageProduct/add",
    async(product) => {
        return await api.createProduct(product);
    }
);

export const updateProduct = createAsyncThunk(
    "manageProduct/update",
    async({ id, product }) => {
        return await api.updateProduct(id, product);
    }
);

export const deleteProduct = createAsyncThunk(
    "manageProduct/delete",
    async(id) => {
        await api.deleteProduct(id);
        return id;
    }
);