const JWT_STORAGE_KEY = "xrf_jwt_token";

export const saveJwtToken = (token: string): void => {
  localStorage.setItem(JWT_STORAGE_KEY, token);
};

export const readJwtToken = (): string | null => {
  const token = localStorage.getItem(JWT_STORAGE_KEY);
  if (!token || token.trim().length === 0) {
    return null;
  }
  return token.trim();
};

export const clearJwtToken = (): void => {
  localStorage.removeItem(JWT_STORAGE_KEY);
};
