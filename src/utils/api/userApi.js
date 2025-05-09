import axios from "axios";
import { variables } from "./variables.js";
import jwtDecode from "jwt-decode";

const API_URL = variables.USER_API;

const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getUser = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

const createUser = async (user) => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

const updateUser = async (userId, user) => {
  const response = await axios.put(`${API_URL}/${userId}`, user);
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/${userId}`);
  return response.data;
};

const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    if (response.data && response.data.token) {
      return response.data;
    }
    throw new Error("Invalid login response");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw error;
  }
};

const userApi = {
  login,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};

export default userApi;
