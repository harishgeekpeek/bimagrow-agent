import axiosInstance from "./axiosInstance";

export const getNotifications = async () => {
  const res = await axiosInstance.get("/api/agentparter/getfetchNotifications");
  return res.data;
};
