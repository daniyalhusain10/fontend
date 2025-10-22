// src/api/axiosInstance.js
import axios from "axios";
import { useLoading } from "./LoadingContext.jsx";

export const useAxios = () => {
  const { setLoading } = useLoading();

  const instance = axios.create({ baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` });

  // Show loader on request
  instance.interceptors.request.use(
    (config) => {
      setLoading(true);
      return config;
    },
    (err) => {
      setLoading(false);
      return Promise.reject(err);
    }
  );

  // Hide loader on response
  instance.interceptors.response.use(
    (res) => {
      setLoading(false);
      return res;
    },
    (err) => {
      setLoading(false);
      return Promise.reject(err);
    }
  );

  return instance;
};
