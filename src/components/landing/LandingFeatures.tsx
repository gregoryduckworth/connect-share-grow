
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, MessageCircle, Video } from "lucide-react";

export const LandingFeatures = () => {
  return (
    <section className="container mx-auto px-4 py-16" data-testid="landing-features-section">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="hover-scale text-left" data-testid="feature-card-communities">
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

        <Card className="hover-scale text-left" data-testid="feature-card-chat">
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

        <Card className="hover-scale text-left" data-testid="feature-card-video">
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
  );
};
