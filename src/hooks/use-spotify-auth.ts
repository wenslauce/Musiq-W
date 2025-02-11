import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenFromUrl } from "@/lib/spotify";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/spotify";

interface SpotifyError {
  status: number;
  message: string;
}

function isSpotifyError(error: unknown): error is SpotifyError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as SpotifyError).status === 'number'
  );
}

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("spotify_token"));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validate token on mount and when token changes
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        await api.getCurrentUser(token);
      } catch (error) {
        console.error('Token validation failed:', error);
        // Token is invalid, clear it
        localStorage.removeItem("spotify_token");
        setToken(null);
        
        if (isSpotifyError(error)) {
          toast({
            title: "Session Expired",
            description: error.status === 401 
              ? "Your session has expired. Please log in again."
              : "There was an error with your session. Please log in again.",
            variant: "destructive"
          });
        }
        
        navigate("/login");
      }
    };

    validateToken();
  }, [token, navigate, toast]);

  useEffect(() => {
    const handleCallback = () => {
      const hash = getTokenFromUrl();
      const _token = hash.access_token;
      const _error = hash.error;

      if (_token) {
        localStorage.setItem("spotify_token", _token);
        setToken(_token);
        window.location.hash = "";
        navigate("/callback/success");
        toast({
          title: "Successfully logged in!",
          description: "Welcome to Musiq Wave",
        });
      } else if (_error) {
        setError(_error);
        navigate("/callback/error");
        toast({
          title: "Login Failed",
          description: "There was an error logging in. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (window.location.hash) {
      handleCallback();
    }
  }, [navigate, toast]);

  const logout = () => {
    localStorage.removeItem("spotify_token");
    setToken(null);
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return { token, error, logout };
} 