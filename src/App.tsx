import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useIsMobile } from "@/hooks/use-mobile";
import { Seo } from "@/components/Seo";
import Home from "@/pages/Home";
import { Search } from "@/pages/Search";
import { Artist } from "@/pages/Artist";
import { Album } from "@/pages/Album";
import { Playlist } from "@/pages/Playlist";
import { Library } from "@/pages/Library";
import Genre from "@/pages/Genre";
import Login from "@/pages/Login";
import CallbackSuccess from "@/pages/CallbackSuccess";
import CallbackError from "@/pages/CallbackError";
import { PlaybackProvider } from "@/contexts/PlaybackContext";
import { Profile } from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { NowPlaying } from "@/components/layout/NowPlaying";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const isMobile = useIsMobile();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ErrorBoundary>
          {isMobile && <MobileNav />}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </ErrorBoundary>
        <NowPlaying />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <AuthProvider>
            <PlaybackProvider>
              <Seo />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/callback/success" element={<CallbackSuccess />} />
                <Route path="/callback/error" element={<CallbackError />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                <Route path="/artist/:id" element={<ProtectedRoute><Artist /></ProtectedRoute>} />
                <Route path="/album/:id" element={<ProtectedRoute><Album /></ProtectedRoute>} />
                <Route path="/playlist/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
                <Route path="/genre/:id" element={<ProtectedRoute><Genre /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PlaybackProvider>
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
