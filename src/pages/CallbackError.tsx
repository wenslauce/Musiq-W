
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CallbackError = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Login Failed",
      description: "There was an error logging in. Please try again.",
      variant: "destructive",
    });
    
    // Redirect to login page after 3 seconds
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate, toast]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mb-6 animate-bounce">
        <XCircle className="w-8 h-8 text-destructive-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Login Failed</h1>
      <p className="text-muted-foreground">Redirecting you back to login...</p>
    </div>
  );
};

export default CallbackError;
