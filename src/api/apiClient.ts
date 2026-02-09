import axios, { AxiosError, AxiosInstance } from "axios";

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
});

// Request interceptor: inject admin password
apiClient.interceptors.request.use(
  (config) => {
    const adminPassword = localStorage.getItem("adminPassword");
    if (adminPassword) {
      config.headers["x-admin-password"] = adminPassword;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = "Unexpected error";

    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = "Invalid request";
          break;
        case 401:
          message = "Unauthorized — please log in";
          break;
        case 403:
          message = "Forbidden — access denied";
          break;
        case 500:
          message = "Server error — try again later";
          break;
      }
    } else if (error.code === "ECONNABORTED") {
      message = "Request timed out";
    }

    // TODO: integrate with your toast system
    console.error(message);

    return Promise.reject(error);
  }
);

export default apiClient;
