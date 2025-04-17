import { createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../utils/api/userApi";

export const getUsers = createAsyncThunk("user/getUsers", async () => {
  const users = await userApi.getUsers();
  return users;
});

export const getUser = createAsyncThunk("user/getUser", async (userId) => {
  const user = await userApi.getUser(userId);
  return user;
});

export const login = createAsyncThunk("user/login", async (loginData) => {
  try {
    const response = await userApi.login(loginData);
    if (response && response.token) {
      return response;
    }
    throw new Error("Invalid login response");
  } catch (error) {
    throw error;
  }
});