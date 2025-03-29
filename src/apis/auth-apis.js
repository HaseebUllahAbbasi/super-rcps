import { axiosInstance } from "../utils/axiosInstance";

export const loginAdmin = async payload => {
  try {
    const response = await axiosInstance.post("/api/auth/login", payload);
    return { data: response.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while login please try again" };
  }
};
