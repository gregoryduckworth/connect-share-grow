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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, Calendar, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
}

const SecureAuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const from = location.state?.from?.pathname || "/";

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    // Input validation
    if (!loginForm.email || !loginForm.password) {
      setErrors(["Please fill in all fields"]);
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginForm.email)) {
      setErrors(["Please enter a valid email address"]);
      setIsLoading(false);
      return;
    }

    // Password length validation
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
        navigate(from, { replace: true });
      } else {
        setErrors(["Invalid email or password"]);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors(["An error occurred during login. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const newErrors: string[] = [];

    // Required field validation
    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword ||
      !registerForm.dateOfBirth
    ) {
      newErrors.push("Please fill in all fields");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (registerForm.email && !emailRegex.test(registerForm.email)) {
      newErrors.push("Please enter a valid email address");
    }

    // Password validation
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    if (registerForm.password.length < 8) {
      newErrors.push("Password must be at least 8 characters long");
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (registerForm.password && !passwordRegex.test(registerForm.password)) {
      newErrors.push(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    // Age validation
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

    // Mock registration success
    toast({
      title: "Account created!",
      description:
        "Welcome to ConnectSphere! Please log in with your new account.",
    });
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-social-background p-4"
      data-testid="secure-auth-root"
    >
      <Card className="w-full max-w-md" data-testid="secure-auth-card">
        <CardHeader className="text-center" data-testid="secure-auth-header">
          <CardTitle
            className="text-2xl font-bold text-social-primary flex items-center justify-center gap-2"
            data-testid="secure-auth-title"
          >
            <Shield className="h-6 w-6" />
            ConnectSphere
          </CardTitle>
          <CardDescription data-testid="secure-auth-description">
            Secure login to join communities and connect
          </CardDescription>
        </CardHeader>

        <CardContent data-testid="secure-auth-content">
          <Tabs
            defaultValue="login"
            className="w-full"
            data-testid="secure-auth-tabs"
          >
            <TabsList
              className="grid w-full grid-cols-2"
              data-testid="secure-auth-tabs-list"
            >
              <TabsTrigger value="login" data-testid="secure-auth-tab-login">
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                data-testid="secure-auth-tab-register"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="login"
              data-testid="secure-auth-tab-content-login"
            >
              <form
                onSubmit={handleLoginSubmit}
                className="space-y-4"
                data-testid="secure-auth-login-form"
              >
                {errors.length > 0 && (
                  <Alert
                    variant="destructive"
                    data-testid="secure-auth-login-error-alert"
                  >
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
                      data-testid="secure-auth-login-email-input"
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
                      data-testid="secure-auth-login-password-input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      data-testid="secure-auth-login-password-toggle"
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
                  data-testid="secure-auth-login-submit-btn"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent
              value="register"
              data-testid="secure-auth-tab-content-register"
            >
              <form
                onSubmit={handleRegisterSubmit}
                className="space-y-4"
                data-testid="secure-auth-register-form"
              >
                {errors.length > 0 && (
                  <Alert
                    variant="destructive"
                    data-testid="secure-auth-register-error-alert"
                  >
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
                        setRegisterForm({
                          ...registerForm,
                          name: e.target.value,
                        })
                      }
                      disabled={isLoading}
                      required
                      data-testid="secure-auth-register-name-input"
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
                      data-testid="secure-auth-register-dob-input"
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
                      data-testid="secure-auth-register-email-input"
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
                      data-testid="secure-auth-register-password-input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      data-testid="secure-auth-register-password-toggle"
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
                      data-testid="secure-auth-register-confirm-password-input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                      data-testid="secure-auth-register-confirm-password-toggle"
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
                  data-testid="secure-auth-register-submit-btn"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="text-center" data-testid="secure-auth-footer">
          <div className="w-full" data-testid="secure-auth-demo-credentials">
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

export default SecureAuthForm;
