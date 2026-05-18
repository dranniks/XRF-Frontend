import { axiosClient } from "./axiosClient";
import type { ApiEnvelope, AuthResponseData } from "../types/api";

export interface AuthRequestBody {
  login: string;
  password: string;
}

export interface RegisterRequestBody extends AuthRequestBody {
  full_name: string;
}

export const registerUserAxios = async (payload: RegisterRequestBody): Promise<void> => {
  await axiosClient.post("/users/register", payload);
};

export const authUserAxios = async (payload: AuthRequestBody): Promise<AuthResponseData> => {
  const response = await axiosClient.post<ApiEnvelope<AuthResponseData>>("/users/auth", payload);
  return response.data.data;
};

export const logoutUserAxios = async (token: string): Promise<void> => {
  await axiosClient.post(
    "/users/logout",
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
