import { createSlice } from "@reduxjs/toolkit";
import { login } from "../actions/userActions";

const initialState = {
    currentUser: null,
    token: localStorage.getItem("token") || "",
    isLoading: false,
    error: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state.currentUser = null;
            state.token = "";
        },
        setUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload && action.payload.token) {
                    const token = action.payload.token;
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    const user = {
                        userID: decodedToken.nameid,
                        firstName: decodedToken.unique_name,
                        lastName: decodedToken.family_name,
                        email: decodedToken.email,
                        phone: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
                        address: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/streetaddress'],
                        city: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality'],
                        postalCode: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/postalcode'],
                        roleName: decodedToken.role,
                        token: token
                    };
                    state.token = token;
                    state.currentUser = user;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.token = "";
                state.currentUser = null;
            });
    },
});

export const { logout } = userSlice.actions;

export const selectToken = (state) => state.user.token;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;

export const { setUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;