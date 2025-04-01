import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from '../actions/productActions';

const initialState = {
    products: [],
    originalProducts: [],
    loading: false,
    error: null,
    status: 'idle',
    filter: {
        minPrice: null,
        maxPrice: null,
        types: [],
    },
};

const productSlice = createSlice({
    name: 'product',
    status: "idle",
    initialState,
    reducers: {
        filterProducts: (state, action) => {
            const { minPrice, maxPrice, types } = action.payload;
            state.products = state.originalProducts.filter(product => {
                const isInPriceRange = (minPrice === null || product.defaultPrice >= minPrice) && (maxPrice === null || product.defaultPrice <= maxPrice);
                const hasType = types.length === 0 || types.includes(product.type);
                return isInPriceRange && hasType;
            });
        },
        searchProducts: (state, action) => {
            const query = action.payload.toLowerCase();
            const originalProducts = state.originalProducts || state.products;
            const filteredProducts = originalProducts.filter(product => {
                return (
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query)
                );
            });
            state.products = filteredProducts;
            if (query.length === 0) {
                state.products = state.originalProducts;
            }
        },
        setLoad: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteProduct: (state, action) => {
            const productId = action.payload;
            state.products = state.products.filter(product => product.productID !== productId);
            state.originalProducts = state.originalProducts.filter(product => product.productID !== productId);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
                state.originalProducts = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const {
    loadProducts,
    filterProducts,
    searchProducts,
    setLoad,
    setError,
    removeSelectedProduct,
    selectedProduct,
    setProduct,
    deleteProduct,
} = productSlice.actions;

export default productSlice.reducer;