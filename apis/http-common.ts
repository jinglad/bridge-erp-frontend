import axios from "axios";

const jwtToken = typeof window !== "undefined" && localStorage.getItem("token")!;

const authFetch = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

authFetch.interceptors.request.use((config) => {
  if (jwtToken) {
    config.headers!.Authorization = `Bearer ${JSON.parse(jwtToken)}`;
  }
  return config;
});

export default authFetch;
