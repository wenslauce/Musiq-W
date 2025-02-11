import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useSpotifyApi<T>(
  key: string[],
  apiFn: (token: string, ...args: any[]) => Promise<T>,
  ...args: any[]
) {
  const { token } = useAuth();

  return useQuery({
    queryKey: key,
    queryFn: () => apiFn(token!, ...args),
    enabled: !!token,
  });
} 