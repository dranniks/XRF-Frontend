import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const maybeResponse = error as { response?: { data?: { message?: string } } };
    const message = maybeResponse.response?.data?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message.trim();
    }

    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string" && maybeError.message.trim().length > 0) {
      return maybeError.message.trim();
    }
  }

  return fallback;
};
