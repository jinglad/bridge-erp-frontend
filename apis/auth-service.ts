import { ILoginResponse } from "../interfaces/auth";
import { IGetResponse } from "../interfaces/common";
import authFetch from "./http-common";

const login = async (
  email: string,
  password: string
): Promise<IGetResponse<ILoginResponse>> => {
  const result = await authFetch.post("/api/v1/user/login", {
    email,
    password,
  });

  return result.data;
};

export const AuthService = {
  login,
};
