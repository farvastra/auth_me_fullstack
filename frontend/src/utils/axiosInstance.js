import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://auth-me-backend.onrender.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
  if (csrfToken) {
    // Use "x-csrf-token" (all lowercase) so that csurf recognizes it
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
}, (error) => Promise.reject(error));



export const restoreCSRF = async () => {
  try {
    const response = await axiosInstance.get("/csrf/restore", { withCredentials: true });
    console.log("CSRF Response Data:", response.data);
    
    // Adjust token extraction based on your backend's response format.
    const csrfToken = response.data["XSRF-Token"] || response.data.csrfToken || response.data.token;
    
    if (csrfToken) {
      // Set the header name to X-XSRF-TOKEN to match common csurf defaults
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
