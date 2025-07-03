import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const from = location.state?.from?.pathname || "/";

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);
    if (!loginForm.email || !loginForm.password) {
      setErrors(["Please fill in all fields"]);
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginForm.email)) {
      setErrors(["Please enter a valid email address"]);
      setIsLoading(false);
      return;
    }
    if (loginForm.password.length < 6) {
      setErrors(["Password must be at least 6 characters long"]);
      setIsLoading(false);
      return;
    }
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        if (user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setErrors(["Invalid email or password"]);
      }
    } catch (error) {
      setErrors(["An error occurred during login. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-social-background p-4 relative"
      data-testid="root"
    >
      <div className="absolute top-6 right-6">
        <Button asChild variant="ghost" className="px-5 py-2">
          <a href="/" data-testid="login-home-top-link">
            Home
          </a>
        </Button>
      </div>
      <Card className="w-full max-w-md" data-testid="card">
        <CardHeader className="text-center" data-testid="header">
          <CardTitle
            className="text-2xl font-bold text-social-primary flex items-center justify-center gap-2"
            data-testid="title"
          >
            <Shield className="h-6 w-6" /> ConnectSphere
          </CardTitle>
          <CardDescription data-testid="description">
            Secure login to join communities and connect
          </CardDescription>
        </CardHeader>
        <CardContent data-testid="content">
          <form
            onSubmit={handleLoginSubmit}
            className="space-y-4"
            data-testid="login-form"
          >
            {errors.length > 0 && (
              <Alert variant="destructive" data-testid="login-error-alert">
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  disabled={isLoading}
                  required
                  data-testid="login-email-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  disabled={isLoading}
                  required
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  data-testid="login-password-toggle"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-social-primary hover:bg-social-secondary"
              disabled={isLoading}
              data-testid="login-submit-btn"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="flex flex-col items-center gap-2 mt-4">
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate("/forgot-password")}
              data-testid="forgot-password-link"
            >
              Forgotten password?
            </Button>
            <span className="text-sm text-social-muted">
              Don't have an account?{" "}
              <button
                className="text-social-primary underline"
                onClick={() => navigate("/register")}
                data-testid="login-register-link"
              >
                Register
              </button>
            </span>
          </div>
        </CardContent>
        <CardFooter className="text-center" data-testid="footer">
          <div className="w-full" data-testid="demo-credentials">
            <p className="text-sm text-social-muted mb-2">Demo Credentials:</p>
            <p className="text-xs text-social-muted">
              Admin: admin@example.com / password123
            </p>
            <p className="text-xs text-social-muted">
              User: user@example.com / password123
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
