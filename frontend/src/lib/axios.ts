import axios from "axios";
import useAuthStore from "@/stores/useAuthStore";

const instanceApi = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// set access token to header before request is sent
instanceApi.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  console.log("Axios Interceptor - Access Token:", accessToken);
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

// auto refresh token on 401 response
instanceApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // ignore if the request is to refresh token endpoint
    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }
    originalRequest._retry = originalRequest._retry || 0;
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest._retry < 4
    ) {
      originalRequest._retry += 1;
      console.log("retry attempt:", originalRequest._retry);
      try {
        console.log(
          "Axios Interceptor - 401 detected, attempting to refresh token",
        );
        const { refreshToken } = useAuthStore.getState();
        await refreshToken();
        return instanceApi(originalRequest);
      } catch (refreshError) {
        console.error(
          "Axios Interceptor - Token refresh failed:",
          refreshError,
        );
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default instanceApi;
