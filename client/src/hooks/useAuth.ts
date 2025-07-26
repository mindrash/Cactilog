import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Consider user authenticated only if we have user data
  // 401 errors mean not authenticated, which is expected
  const isAuthenticated = !!user;
  
  // For faster loading, consider not loading if we get a 401 error
  const isActuallyLoading = isLoading && !error && !user;
  
  return {
    user,
    isLoading: isActuallyLoading,
    isAuthenticated,
    authError: error,
  };
}

// Hook for public pages that don't need auth checks
export function useAuthOptional() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: false, // Don't run the query automatically
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    user,
    isLoading: false, // Never loading for public pages
    isAuthenticated: !!user,
    authError: error,
  };
}
