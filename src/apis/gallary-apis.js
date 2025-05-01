import { axiosInstance } from "../utils/axiosInstance";

// ========== TAGS ==========

export const fetchAllTags = async () => {
  try {
    const response = await axiosInstance.get("/api/gallary/tags");
    console.log("Fetched the tags", response?.data)
    return { data: response.data?.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while fetching tags",
    };
  }
};

export const fetchTagById = async (tagId) => {
  try {
    const response = await axiosInstance.get(`/api/gallary/tags/${tagId}`);
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while fetching tag",
    };
  }
};

export const createTag = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/gallary/tags", payload);
    console.log("Getting the create tag", response)
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while creating tag",
    };
  }
};

export const updateTag = async (tagId, payload) => {
  try {
    const response = await axiosInstance.patch(`/api/gallary/tags/${tagId}`, payload);
    return { data: response?.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while updating tag",
    };
  }
};

export const deleteTag = async (tagId) => {
  try {
    const response = await axiosInstance.delete(`/api/gallary/tags/${tagId}`);
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while deleting tag",
    };
  }
};

// ========== IMAGES ==========

export const fetchAllImages = async (tagId) => {
  try {
    const url = tagId ? `/api/gallary/images?tagId=${tagId}` : "/api/gallary/images";
    const response = await axiosInstance.get(url);
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while fetching images",
    };
  }
};

export const fetchImageById = async (imageId) => {
  try {
    const response = await axiosInstance.get(`/api/gallary/images/${imageId}`);
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while fetching image",
    };
  }
};

export const createImage = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/gallary/images", payload);
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while creating image",
    };
  }
};

export const updateImage = async (imageId, payload) => {
  try {
    const response = await axiosInstance.patch(`/api/gallary/images/${imageId}`, payload);
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while updating image",
    };
  }
};

export const deleteImage = async (imageId) => {
  try {
    const response = await axiosInstance.delete(`/api/gallary/images/${imageId}`);
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while deleting image",
    };
  }
};

export const updateImageDisplayOrders = async (imageOrders) => {
  try {
    const response = await axiosInstance.patch("/api/gallary/images", { imageOrders });
    return { data: response.data, error: "" };
  } catch (err) {
    console.error(err);
    return {
      data: null,
      error: err?.response?.data?.message || "Error while updating image order",
    };
  }
};
