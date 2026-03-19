import { showAppToast } from "@/utils/toastUtils";
import axiosInstance from "./axiosInstance";

let isLoggingOut = false;

export const setupAxiosInterceptors = (logoutUser: () => Promise<void>, toast: any) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message;

      if (statusCode === 401 && message?.toLowerCase().includes("token expired")) {
        if (!isLoggingOut) {
          isLoggingOut = true;
          try {
            await logoutUser();
          } catch (err) {
            console.error("Error during logout:", err);
          } finally {
            isLoggingOut = false;
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
