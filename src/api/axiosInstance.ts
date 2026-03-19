import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config/config";
const axiosInstance = axios.create({
  baseURL:  config.baseURL,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
