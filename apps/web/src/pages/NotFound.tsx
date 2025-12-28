import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <span className="font-display text-2xl font-bold uppercase tracking-wider">
            V <span className="text-primary">Verify</span>
          </span>
        </div>

        {/* 404 */}
        <h1 className="font-display text-8xl font-bold text-primary text-glow">404</h1>
        
        <p className="text-2xl font-display uppercase tracking-wider text-foreground">
          Page Not Found
        </p>
        
        <p className="text-muted-foreground">
          The investigation leads nowhere. This page doesn't exist.
        </p>

        <Link to="/">
          <Button variant="hero" size="lg" className="mt-4">
            <Home className="h-5 w-5" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
