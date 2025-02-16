import axios from "axios";

// Create Axios instance with credentials enabled
const axiosInstance = axios.create({
  baseURL: "https://auth-me-backend.onrender.com/api",
  withCredentials: true,
});

// Response interceptor for logging errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("🚨 API Error Response:", error.response.data);
      console.error("⚠️ Status Code:", error.response.status);
      console.error("📢 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("⚠️ No response received:", error.request);
    } else {
      console.error("❌ Error in setting up the request:", error.message);
    }
    return Promise.reject(error);
  }
);

// Function to restore CSRF token
export const restoreCSRF = async () => {
  try {
    console.log("🔄 Requesting CSRF token...");
    const response = await axiosInstance.get("/csrf/restore");

    // Try multiple possible locations for the CSRF token
    const csrfToken =
      response.data["XSRF-Token"] || response.headers["xsrf-token"];

    if (csrfToken) {
      // Store in default Axios headers
      axiosInstance.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;

      // Store in localStorage for persistence
      localStorage.setItem("csrfToken", csrfToken);

      console.log("✅ CSRF token set successfully:", csrfToken);
    } else {
      console.warn("⚠️ CSRF token not found in response.");
    }
  } catch (error) {
    console.error("❌ Error restoring CSRF token:", error);
  }
};

// Restore CSRF token on initial load
restoreCSRF();

export default axiosInstance;
