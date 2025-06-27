import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { t } from "@/lib/i18n";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "moderator" | "admin";
  isEmailVerified: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  language: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    language: string
  ) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  canPost: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuspensionDialog, setShowSuspensionDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("auth_user");
    const sessionExpiry = localStorage.getItem("auth_expiry");

    if (storedUser && sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      if (expiryDate > new Date()) {
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_expiry");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - replace with Supabase auth
      const mockUsers = {
        "admin@example.com": {
          id: "admin-1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin" as const,
          isEmailVerified: true,
          isSuspended: false,
          language: "en",
        },
        "user@example.com": {
          id: "user-1",
          email: "user@example.com",
          name: "Regular User",
          role: "user" as const,
          isEmailVerified: true,
          isSuspended: false,
          language: "en",
        },
        "suspended@example.com": {
          id: "user-suspended",
          email: "suspended@example.com",
          name: "Suspended User",
          role: "user" as const,
          isEmailVerified: true,
          isSuspended: true,
          suspensionReason: "Violation of community guidelines",
          language: "en",
        },
        "unverified@example.com": {
          id: "user-unverified",
          email: "unverified@example.com",
          name: "Unverified User",
          role: "user" as const,
          isEmailVerified: false,
          isSuspended: false,
          language: "en",
        },
      };

      const userData = mockUsers[email as keyof typeof mockUsers];

      if (userData && password === "password123") {
        const user: User = userData;
        setUser(user);

        // Set session with 24-hour expiry
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        localStorage.setItem("auth_user", JSON.stringify(user));
        localStorage.setItem("auth_expiry", expiryDate.toISOString());

        // Show suspension dialog if user is suspended
        if (user.isSuspended) {
          setShowSuspensionDialog(true);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    language: string
  ): Promise<boolean> => {
    try {
      // Mock registration - in real app, this would call Supabase
      const userId = `user-${Date.now()}`;

      // Simulate email verification requirement
      toast({
        title: t("auth.verificationSent"),
        description:
          "Please check your email and click the verification link before logging in.",
      });

      console.log("User registered:", { email, name, language });
      console.log("Verification email would be sent to:", email);

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expiry");

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    navigate("/login");
  };

  const isAdmin = () => user?.role === "admin";
  const isModerator = () =>
    user?.role === "moderator" || user?.role === "admin";
  const canPost = () => user && user.isEmailVerified && !user.isSuspended;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isModerator,
        canPost,
      }}
    >
      {children}

      {/* Suspension Dialog */}
      <Dialog
        open={showSuspensionDialog}
        onOpenChange={setShowSuspensionDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("auth.accountSuspended")}
            </DialogTitle>
            <DialogDescription className="text-left">
              {t("auth.suspendedMessage")}
            </DialogDescription>
          </DialogHeader>
          {user?.suspensionReason && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Reason:</strong> {user.suspensionReason}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
};
