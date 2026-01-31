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

export default instanceApi;
