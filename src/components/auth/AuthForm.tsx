
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

type AuthFormProps = {
  mode: "login" | "register" | "reset";
  onModeChange: (mode: "login" | "register" | "reset") => void;
};

const AuthForm = ({ mode, onModeChange }: AuthFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Reset password form
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate login success
      console.log("Login with:", data);
      
      // Show success message
      toast({
        title: "Login successful",
        description: "Welcome back to ConnectSphere!",
      });
      
      // Redirect to home
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate registration
      console.log("Register with:", data);
      
      // Show success message and move to step 2
      toast({
        title: "Registration started",
        description: "Please complete your profile setup.",
      });
      
      navigate("/register/profile", { 
        state: { 
          userData: data 
        }
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (data: ResetFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate password reset email
      console.log("Reset password for:", data);
      
      // Show success message
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      });
      
      // Navigate back to login
      onModeChange("login");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end">
                <Button
                  variant="link"
                  className="text-social-primary p-0"
                  type="button"
                  onClick={() => onModeChange("reset")}
                >
                  Forgot password?
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full bg-social-primary hover:bg-social-secondary"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
              <div className="text-center">
                <span className="text-sm text-social-muted">Don't have an account? </span>
                <Button
                  variant="link"
                  className="text-social-primary p-0"
                  type="button"
                  onClick={() => onModeChange("register")}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </Form>
        );

      case "register":
        return (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={registerForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button
                type="submit"
                className="w-full bg-social-primary hover:bg-social-secondary"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-social-muted">Already have an account? </span>
                <Button
                  variant="link"
                  className="text-social-primary p-0"
                  type="button"
                  onClick={() => onModeChange("login")}
                >
                  Log in
                </Button>
              </div>
            </form>
          </Form>
        );

      case "reset":
        return (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <Mail className="h-6 w-6 text-social-primary" />
                </div>
                <p className="text-sm text-center mt-2 text-social-muted">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              <FormField
                control={resetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button
                type="submit"
                className="w-full bg-social-primary hover:bg-social-secondary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-social-muted">Remember your password? </span>
                <Button
                  variant="link"
                  className="text-social-primary p-0"
                  type="button"
                  onClick={() => onModeChange("login")}
                >
                  Log in
                </Button>
              </div>
            </form>
          </Form>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "Welcome back";
      case "register": return "Create an account";
      case "reset": return "Reset password";
      default: return "";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login": return "Enter your credentials to access your account";
      case "register": return "Fill in your details to get started";
      case "reset": return "We'll send you a link to reset your password";
      default: return "";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{getTitle()}</CardTitle>
        <CardDescription className="text-center">{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderForm()}
      </CardContent>
    </Card>
  );
};

export default AuthForm;
