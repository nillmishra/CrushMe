// utils/authUtils.js
import axios from "axios";
import { setUser } from "./userSlice";

export const loginUser = (userData) => {
  if (userData.token) {
    localStorage.setItem('authToken', userData.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  }
  return setUser(userData);
};

export const setupAuthInterceptors = () => {
  // Make sure these match EXACTLY what was in your App.js
  axios.interceptors.response.use(
    response => {
      // Check if response contains auth token and store it
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response;
    },
    error => {
      // Handle 401 errors by clearing auth
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
      }
      return Promise.reject(error);
    }
  );
};