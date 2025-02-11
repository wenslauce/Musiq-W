
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CallbackSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Successfully logged in!",
      description: "Welcome to Musiq Wave",
    });
    
    // Redirect to home page after 2 seconds
    const timeout = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate, toast]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 animate-bounce">
        <Check className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Login Successful!</h1>
      <p className="text-muted-foreground">Redirecting you to the app...</p>
    </div>
  );
};

export default CallbackSuccess;
