import api from "@/lib/axios";
import type { User } from "@/types/auth";

export interface SearchUsersResponse {
  statusCode: number;
  message: string;
  data: User[];
}

export async function searchUsers(query: string): Promise<User[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const response = await api.get<SearchUsersResponse>(
    `/users/search?q=${encodeURIComponent(query)}`
  );

  return response.data.data || [];
}
