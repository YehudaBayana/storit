// src/api/apiClient.ts
import { httpClient, RequestOptions } from "@/core/http/httpClient";
import { ApiError } from "@/core/http/ApiError";

export type { RequestOptions };
export { ApiError };

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  return await httpClient<T>(endpoint, options);
}
