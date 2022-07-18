import axios from "axios";

export default axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: typeof window !== "undefined" && `Bearer ${JSON.parse(localStorage.getItem("token")!)}`,
  },
});
