import { Api as GeneratedApi } from "./generated/Api";

const rawBaseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const generatedBaseURL = rawBaseURL.replace(/\/api\/?$/, "") || "/";

export interface GeneratedSecurityData {
  token: string | null;
}

export const xrfGeneratedApi = new GeneratedApi<GeneratedSecurityData>({
  baseURL: generatedBaseURL,
  securityWorker: (securityData) => {
    if (!securityData?.token) {
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${securityData.token}`
      }
    };
  }
});

export const setGeneratedApiToken = (token: string | null): void => {
  xrfGeneratedApi.setSecurityData({ token });
};
