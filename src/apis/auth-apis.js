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


export const addNewAdmin=async (payload)=>{
  try {
    const response = await axiosInstance.post("/api/admins/add-admin", payload);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}


export const editAdmin = async (payload)=>{
  try {
    const response = await axiosInstance.post("/api/admins/update-admin-profile", payload);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const changePassword = async (payload)=>{
  try {
    const response = await axiosInstance.post("/api/admins/change-password", payload);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const fetchAllComplaintStatuses=async()=>{
  try {
    const response = await axiosInstance.get("/api/admins/statuses",);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const updateStatusLabelByAdmin=async(statusId,updatedInfo)=>{
  try {
    const response = await axiosInstance.post(`/api/admins/update-status/${statusId}`,updatedInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const addNewDivision=async(divisionInfo)=>{
  try {
    const response = await axiosInstance.post("/api/admins/add-division",divisionInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}
  
export const updateDivisionById=async(divisionId,divisionInfo)=>{
  try {
    const response = await axiosInstance.post(`/api/admins/update-division/${divisionId}`,divisionInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}