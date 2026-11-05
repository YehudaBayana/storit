import { clientApiUrl, serverApiUrl } from "@/config/constants";
import { ApiError } from "./ApiError";
import { getCsrfToken } from "./csrf";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  skipCsrf?: boolean;
}

export async function httpClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, skipCsrf, ...customConfig } = options;

  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? serverApiUrl : clientApiUrl || window.location.origin;

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url =
    endpoint.startsWith("http://") || endpoint.startsWith("https://")
      ? new URL(endpoint)
      : new URL(`${baseUrl}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const method = customConfig.method?.toUpperCase() || (customConfig.body ? "POST" : "GET");
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  const reqHeaders: HeadersInit = {
    ...headers,
  };

  if (
    customConfig.body &&
    !(customConfig.body instanceof FormData) &&
    !Object.keys(reqHeaders).some((h) => h.toLowerCase() === "content-type")
  ) {
    (reqHeaders as Record<string, string>)["Content-Type"] = "application/json";
  }

  if (isMutating && !skipCsrf) {
    const csrf = getCsrfToken();
    if (csrf) {
      (reqHeaders as Record<string, string>)["X-CSRF-Token"] = csrf;
    }
  }

  const config: RequestInit = {
    method,
    credentials: "include",
    headers: reqHeaders,
    ...customConfig,
  };

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.message || `HTTP error! status: ${response.status}`;
    throw new ApiError(response.status, message, errorData?.code, errorData);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
