const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const buildUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
