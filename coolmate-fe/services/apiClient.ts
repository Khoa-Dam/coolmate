import { getAccessToken, removeAccessToken } from "@/utils/authStorage";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const hasBody = options.body !== undefined;
  if (hasBody) headers.set("Content-Type", "application/json");

  const token = getAccessToken();
  if (token && options.auth !== false) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiEnvelope<T>) : null;

  if (!response.ok) {
    if (response.status === 401) removeAccessToken();
    throw new ApiError(payload?.message ?? `Request failed: ${response.status}`, response.status);
  }

  return payload?.data as T;
}
