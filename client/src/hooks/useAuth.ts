import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Consider user authenticated only if we have user data
  // 401 errors mean not authenticated, which is expected
  const isAuthenticated = !!user;
  
  // Only consider loading if we haven't gotten a response yet
  const isActuallyLoading = isLoading && !error;
  
  return {
    user,
    isLoading: isActuallyLoading,
    isAuthenticated,
    authError: error,
  };
}
