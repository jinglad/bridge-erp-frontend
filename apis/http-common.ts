import axios from "axios";
import { getCookie } from "cookies-next";
import useUserStore from "../store/userStore";
import { toast } from "react-toastify";

const authFetch = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

authFetch.interceptors.request.use((config) => {
  const token = getCookie("token");
  config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

// log out if token is expired
authFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      useUserStore.getState().logout();
      // toast.error("Your session has expired, please login again");
    }
    return Promise.reject(error);
  }
);

export default authFetch;
