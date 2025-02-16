import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://auth-me-backend.onrender.com/api",
  withCredentials: true, 
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("Status Code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error in setting up the request:", error.message);
    }
    return Promise.reject(error);
  }
);


export const restoreCSRF = async () => {
  try {
    const response = await axiosInstance.get("/csrf/restore", { withCredentials: true });

    console.log("CSRF Response Data:", response.data); 
    const csrfToken =
      response.data["XSRF-Token"] || response.data.csrfToken || response.data.token;

    if (csrfToken) {
      axiosInstance.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
      console.log("CSRF token set successfully:", csrfToken);
    } else {
      console.warn("CSRF token not found in response data.");
    }
  } catch (error) {
    console.error("Error restoring CSRF token:", error);
  }
};

// Restore CSRF token on startup
restoreCSRF();

export default axiosInstance;
