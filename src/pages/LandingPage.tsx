import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, MessageCircle, Video, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-social-background to-white p-4"
      data-testid="landing-page"
    >
      {/* Header */}
      <header
        className="container mx-auto px-4 py-6"
        data-testid="landing-header"
      >
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

      {/* Hero Section */}
      <section
        className="container mx-auto px-4 py-20 text-left"
        data-testid="landing-hero-section"
      >
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

      {/* Features Section */}
      <section
        className="container mx-auto px-4 py-16"
        data-testid="landing-features-section"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            className="hover-scale text-left"
            data-testid="feature-card-communities"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-social-primary">
                <Users /> Communities
              </CardTitle>
              <CardDescription>
                Join groups based on your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Find and connect with people who share your passions. Discover
                communities for gaming, art, tech, sports, and more.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover-scale text-left"
            data-testid="feature-card-chat"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-social-primary">
                <MessageCircle /> Chat
              </CardTitle>
              <CardDescription>Message your friends anytime</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Stay connected with friends through our intuitive messaging
                platform. Share updates, photos, and memories.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover-scale text-left"
            data-testid="feature-card-video"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-social-primary">
                <Video /> Video Calls
              </CardTitle>
              <CardDescription>Face-to-face conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Connect on a personal level with video calls. Schedule group
                calls with your communities or chat one-on-one.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="bg-social-primary text-white py-16"
        data-testid="landing-cta-section"
      >
        <div className="container mx-auto px-4 text-left">
          <div className="max-w-2xl">
            <h2
              className="text-3xl font-bold mb-4"
              data-testid="landing-cta-title"
            >
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

      {/* Footer */}
      <footer className="bg-gray-50 py-8" data-testid="landing-footer">
        <div className="container mx-auto px-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-social-primary rounded-full" />
              <span className="text-sm text-gray-600">
                © 2024 ConnectSphere. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
