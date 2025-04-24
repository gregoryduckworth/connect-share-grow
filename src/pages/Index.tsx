
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, Video, User } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <section className="text-center py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-social-primary mb-2">Welcome to ConnectSphere</h1>
        <p className="text-lg text-social-secondary mb-6">Connect with friends and communities that share your interests</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-social-primary hover:bg-social-secondary">
            <Users className="mr-2 h-4 w-4" /> Find Communities
          </Button>
          <Button variant="outline" className="border-social-primary text-social-primary hover:bg-social-accent/20">
            <MessageCircle className="mr-2 h-4 w-4" /> Start Chatting
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-social-primary">
              <Users /> Communities
            </CardTitle>
            <CardDescription>Join groups based on your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find and connect with people who share your passions. Discover communities for gaming, art, tech, sports, and more.</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-social-primary">
              <MessageCircle /> Chat
            </CardTitle>
            <CardDescription>Message your friends anytime</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Stay connected with friends through our intuitive messaging platform. Share updates, photos, and memories.</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-social-primary">
              <Video /> Video Calls
            </CardTitle>
            <CardDescription>Face-to-face conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Connect on a personal level with video calls. Schedule group calls with your communities or chat one-on-one.</p>
          </CardContent>
        </Card>

        <Card className="hover-scale md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-social-primary">
              <User /> Personalized Profile
            </CardTitle>
            <CardDescription>Express yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Customize your profile with your details and interests. Control your privacy settings and decide what information to share with others.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
