import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://auth-me-backend.onrender.com/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach Bearer token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
