import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Pages
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login triggers the Replit auth flow via the API redirect usually, 
    // but here we redirect to landing page which has the Login button.
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Or a splash screen

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        {user ? <Redirect to="/home" /> : <Landing />}
      </Route>
      
      <Route path="/discover" component={Discover} />
      <Route path="/c/:slug" component={Community} />

      {/* Protected Routes */}
      <Route path="/home">
        <ProtectedRoute component={Home} />
      </Route>
      <Route path="/my-communities">
        <ProtectedRoute component={Home} /> {/* Reusing Home for now, can be separate page */}
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
