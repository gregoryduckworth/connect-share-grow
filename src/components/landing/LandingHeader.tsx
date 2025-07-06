
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LandingHeader = () => {
  return (
    <header className="container mx-auto px-4 py-6" data-testid="landing-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" data-testid="landing-logo">
          <div className="w-8 h-8 bg-social-primary rounded-full" />
          <h1 className="text-xl font-bold text-social-primary">
            ConnectSphere
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" data-testid="sign-in-btn">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button data-testid="get-started-btn">Register</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
