
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingHero = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-left" data-testid="landing-hero-section">
      <div className="max-w-4xl">
        <h1
          className="text-4xl md:text-6xl font-bold text-social-primary mb-6"
          data-testid="landing-hero-title"
        >
          Connect. Share. Grow.
        </h1>
        <p
          className="text-xl text-social-secondary mb-8 max-w-2xl"
          data-testid="landing-hero-description"
        >
          Join communities that share your passions. Engage in meaningful
          conversations. Build lasting connections with people who understand
          your interests.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register">
            <Button
              size="lg"
              className="bg-social-primary hover:bg-social-secondary"
              data-testid="join-communities-btn"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Communities
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-social-primary text-social-primary hover:bg-social-accent/20"
              data-testid="start-chatting-btn"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chatting
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
