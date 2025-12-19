import { useState, useEffect } from "react";
import { searchUsers } from "@/features/user/users.api";
import type { User } from "@/types/auth";
import { useDebounce } from "../../../hooks/useDebounce";

export function useSearchUsers(query: string, delay: number = 500) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      setUsers([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await searchUsers(debouncedQuery);
        setUsers(results);
      } catch (err: any) {
        setError(err.message || "Failed to search users");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  return { users, isLoading, error };
}
