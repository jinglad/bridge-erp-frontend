import axios from "axios";
import { getCookie } from "cookies-next";

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

export default authFetch;
