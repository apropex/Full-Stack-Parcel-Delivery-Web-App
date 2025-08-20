import { ENV } from "@/config/env_config";
import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
  withCredentials: true,
});

// request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// response interceptor

interface iPendingQueueProps {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}

let isRefreshing = false;

let pendingQueue: iPendingQueueProps[] = [];

const handlePendingQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(null);
  });

  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { statusCode, message } = error.response.data;

    const originalRequest = error.config as AxiosRequestConfig & { _retry: boolean };

    if (statusCode === 401 && message === "Invalid token" && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((error) => Promise.reject(error));
      }

      try {
        isRefreshing = true;
        await axiosInstance.post("/auth/refresh-token");
        handlePendingQueue(null);
        return axiosInstance(originalRequest);
      } catch (error) {
        handlePendingQueue(error);
      } finally {
        isRefreshing = false;
      }
    }

    // For every request
    return Promise.reject(error);
  }
);
