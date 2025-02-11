
import { loginUrl } from "@/lib/spotify";

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 spotify-text-gradient">Musiq Wave</h1>
        <a
          href={loginUrl}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Login with Spotify
        </a>
      </div>
    </div>
  );
};

export default Login;
