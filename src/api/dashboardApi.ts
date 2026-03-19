import axiosInstance from "./axiosInstance";

export const getDashboardDataApi = async () => {
  const res = await axiosInstance.get("/api/agentparter/agentdashboarddata");
  return res.data;
};
