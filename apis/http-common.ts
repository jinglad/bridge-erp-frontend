import axios from "axios";

const authFetch = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

authFetch.interceptors.request.use((config) => {
  config.headers!.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export default authFetch;
