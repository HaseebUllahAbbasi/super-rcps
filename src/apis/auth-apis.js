import { axiosInstance } from "../utils/axiosInstance";

export const loginAdmin = async payload => {
  try {
    const response = await axiosInstance.post("/api/admins/superAdminLogin", payload);
    return { data: response.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while login please try again" };
  }
};


export const addNewAdmin = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/admins/add-admin", payload);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}


export const editAdmin = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/admins/update-admin-profile", payload);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const changePassword = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/admins/change-password", payload);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const fetchAllComplaintStatuses = async () => {
  try {
    const response = await axiosInstance.get("/api/admins/statuses",);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const updateStatusLabelByAdmin = async (statusId, updatedInfo) => {
  try {
    const response = await axiosInstance.post(`/api/admins/update-status/${statusId}`, updatedInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const updateUrgencyLevelByAdmin = async (statusId, updatedInfo) => {
  try {
    const response = await axiosInstance.post(`/api/admins/update-urgency/${statusId}`, updatedInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const addNewUrgencyLevelByAdmin = async (urgencyLevelInfo) => {
  try {
    const response = await axiosInstance.post(`/api/admins/add-urgencylevel`, urgencyLevelInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const addNewDivision = async (divisionInfo) => {
  try {
    const response = await axiosInstance.post("/api/admins/add-division", divisionInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const updateDivisionById = async (divisionId, divisionInfo) => {
  try {
    const response = await axiosInstance.post(`/api/admins/update-division/${divisionId}`, divisionInfo);
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.log(err)
    return { data: null, error: err?.response?.data.message || "Errror while adding new admin please try again" };
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/me");
    return { data: response.data?.data, success: response.data?.success, message: response.data?.message, error: null };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error while fetching current user details"
    return { error: error?.response, success: false, message: errorMessage, data: null }
  }
}

export const fetchDivisionDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admins/getDivisionById/${id}`);
    return { data: response.data?.data, error: null };
  } catch (error) {
    return { error: error?.response?.data?.message || "Failed to fetch details" };
  }
};

export const deleteDivisionById = async (divisionId, moveToDivisionId) => {
  try {
    const response = await axiosInstance.delete(`/api/admins/deleteDivisionById`, {
      data:{
        divisionId, moveToDivisionId
      }
    }
    );
    return { data: response.data?.data, error: null };
  } catch (error) {
    return { error: error?.response?.data?.message || "Failed to delete division" };
  }
};
