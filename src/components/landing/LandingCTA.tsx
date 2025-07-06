
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingCTA = () => {
  return (
    <section className="bg-social-primary text-white py-16" data-testid="landing-cta-section">
      <div className="container mx-auto px-4 text-left">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4" data-testid="landing-cta-title">
            Ready to Connect?
          </h2>
          <p
            className="text-lg mb-8 opacity-90"
            data-testid="landing-cta-description"
          >
            Join thousands of users who are already building meaningful
            connections on ConnectSphere.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              variant="secondary"
              data-testid="create-profile-btn"
            >
              <User className="mr-2 h-5 w-5" />
              Create Your Profile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
