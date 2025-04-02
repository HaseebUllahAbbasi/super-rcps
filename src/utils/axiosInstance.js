import axios from "axios";

// Create an instance of axios with custom configuration
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 50000,
  responseType: "json"
});
