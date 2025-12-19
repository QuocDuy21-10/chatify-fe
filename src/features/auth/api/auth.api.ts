import api from "@/lib/axios";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string | null;
  data: {
    access_token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
      bio?: string;
    };
  };
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function refreshToken(
  refresh_token: string
): Promise<{ access_token: string }> {
  const response = await api.post<{ access_token: string }>(
    "/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    }
  );
  return response.data;
}
