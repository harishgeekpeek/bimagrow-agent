// src/api/authApi.ts
import axiosInstance from "./axiosInstance";

export const getUserProfile = async () => {
  const res = await axiosInstance.get("/api/user");
  https: return res.data;
};
