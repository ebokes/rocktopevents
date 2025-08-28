import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getAuthHeaders,
  hasValidToken,
} from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/admin/user"],
    queryFn: async () => {
      const token = getStoredToken();
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/admin/user", {
        headers: getAuthHeaders(),
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        // If token is invalid, remove it
        if (response.status === 401 || response.status === 403) {
          removeStoredToken();
        }
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    retry: false,
    enabled: hasValidToken(), // Only run if we have a token
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store the JWT token in localStorage
      if (data.token) {
        setStoredToken(data.token);
      }
      // Cache user data
      queryClient.setQueryData(["/api/admin/user"], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      // Remove token from localStorage
      removeStoredToken();
      // Clear user data from cache
      queryClient.setQueryData(["/api/admin/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginMutation,
    logoutMutation,
  };
}
