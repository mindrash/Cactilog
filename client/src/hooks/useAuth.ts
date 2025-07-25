import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // If there's an auth error, assume user is not authenticated
  const isAuthenticated = !!user && !error;
  
  return {
    user,
    isLoading,
    isAuthenticated,
    authError: error,
  };
}
