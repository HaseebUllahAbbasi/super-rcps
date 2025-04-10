import axios from "axios";
import { getAuthToken } from "../utils/token-handler";

// Create an instance of axios with custom configuration
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 50000,
  responseType: "json",
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = await getAuthToken();
  console.log("second time token of auth", accessToken.token?.value);
  if (accessToken?.token?.value) {
    config.headers["Authorization"] = `Bearer ${accessToken?.token?.value}`;
  }
  return config; // not run
});
