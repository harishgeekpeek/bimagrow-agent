// src/api/authApi.ts
import axiosInstance from "./axiosInstance";

export const sendOTPApi = async (mobile: any, type:any) => {
  const res = await axiosInstance.post("/api/agentparter/sendotp", { mobile, type });
  return res.data;
};

export const verifyOtpApi = async (mobile: string, otp: string) => {
  const res = await axiosInstance.post("/api/agentparter/verifyotp", { mobile, otp });
  return res.data;
};

export const getcontactsupportApi = async () => {
  const res = await axiosInstance.get("/api/newapp/getcontactsupport")
  return res.data;
}
