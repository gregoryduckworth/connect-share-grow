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
import { Eye, EyeOff, Mail, Lock, User, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);
    const newErrors: string[] = [];
    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword ||
      !registerForm.dateOfBirth
    ) {
      newErrors.push("Please fill in all fields");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (registerForm.email && !emailRegex.test(registerForm.email)) {
      newErrors.push("Please enter a valid email address");
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.push("Passwords do not match");
    }
    if (registerForm.password.length < 8) {
      newErrors.push("Password must be at least 8 characters long");
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (registerForm.password && !passwordRegex.test(registerForm.password)) {
      newErrors.push(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }
    if (registerForm.dateOfBirth) {
      const birthDate = new Date(registerForm.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      let actualAge = age;
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        actualAge--;
      }
      if (actualAge < 13) {
        newErrors.push("You must be at least 13 years old to register");
      }
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    // Simulate email verification step
    setVerificationSent(true);
    toast({
      title: "Verification email sent!",
      description:
        "Please check your email and click the verification link before logging in.",
    });
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-social-background p-4 relative">
      <div className="absolute top-6 right-6">
        <Button asChild variant="ghost" className="px-5 py-2">
          <a href="/" data-testid="register-home-top-link">
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
            Create your account to join communities
          </CardDescription>
        </CardHeader>
        <CardContent data-testid="content">
          {verificationSent ? (
            <Alert variant="default" data-testid="verification-alert">
              <AlertDescription>
                Verification email sent! Please check your email and click the
                verification link before logging in.
              </AlertDescription>
            </Alert>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
              data-testid="register-form"
            >
              {errors.length > 0 && (
                <Alert variant="destructive" data-testid="register-error-alert">
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
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    disabled={isLoading}
                    required
                    data-testid="register-name-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-dob">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-dob"
                    type="date"
                    className="pl-10"
                    value={registerForm.dateOfBirth}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        dateOfBirth: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                    data-testid="register-dob-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                    data-testid="register-email-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                    data-testid="register-password-input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    data-testid="register-password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    required
                    data-testid="register-confirm-password-input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    data-testid="register-confirm-password-toggle"
                  >
                    {showConfirmPassword ? (
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
                data-testid="register-submit-btn"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}
          <div className="flex flex-col items-center gap-2 mt-4">
            <span className="text-sm text-social-muted">
              Already have an account?{" "}
              <button
                className="text-social-primary underline"
                onClick={() => navigate("/login")}
                data-testid="register-login-link"
              >
                Login
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

export default RegisterPage;
