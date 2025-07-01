import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      toast({
        title: "Password reset email sent!",
        description: "Please check your inbox for a reset link.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-social-background p-4 relative">
      <div className="absolute top-6 right-6">
        <Button asChild variant="ghost" className="px-5 py-2">
          <a href="/" data-testid="forgot-home-top-link">
            Home
          </a>
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-social-primary flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" /> ConnectSphere
          </CardTitle>
          <CardDescription>Reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <Alert variant="default">
              <AlertDescription>
                If an account exists for{" "}
                <span className="font-semibold">{email}</span>, a password reset
                link has been sent.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-social-primary hover:bg-social-secondary"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
          <div className="flex flex-col items-center gap-2 mt-4">
            <span className="text-sm text-social-muted">
              Remembered your password?{" "}
              <button
                className="text-social-primary underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
