import axios from "axios";
import { getCsrfTokenFromCookie } from "./getCsrfToken"


const axiosInstance = axios.create({
    baseURL: "https://auth-me-backend.onrender.com/api",
    withCredentials: true,
});
axiosInstance.interceptors.request.use((config) => {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
  });
  
export const restoreCSRF = async () => {
    try {
      const response = await axiosInstance.get("/csrf/restore", { withCredentials: true });
      console.log("CSRF Response Data:", response.data);
   
      const csrfToken =
        response.data["XSRF-Token"] ||
        response.data.csrfToken ||
        response.data.token;
      
      console.log("Extracted CSRF Token:", csrfToken);
      
      if (csrfToken) {
 
        axiosInstance.defaults.headers.common["x-csrf-token"] = csrfToken;
        console.log("CSRF token set successfully:", csrfToken);
      } else {
        console.warn("CSRF token not found in response data.");
      }
    } catch (error) {
      console.error("Error restoring CSRF token:", error);
    }
  };

  await restoreCSRF();

export default axiosInstance;
