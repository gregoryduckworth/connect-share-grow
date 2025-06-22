
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'moderator' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isModerator: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    const sessionExpiry = localStorage.getItem('auth_expiry');
    
    if (storedUser && sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      if (expiryDate > new Date()) {
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_expiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - replace with Supabase auth
      if (email === "admin@example.com" && password === "password123") {
        const adminUser: User = {
          id: "admin-1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin"
        };
        setUser(adminUser);
        
        // Set session with 24-hour expiry
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        localStorage.setItem('auth_expiry', expiryDate.toISOString());
        
        return true;
      } else if (email === "user@example.com" && password === "password123") {
        const regularUser: User = {
          id: "user-1",
          email: "user@example.com",
          name: "Regular User",
          role: "user"
        };
        setUser(regularUser);
        
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        
        localStorage.setItem('auth_user', JSON.stringify(regularUser));
        localStorage.setItem('auth_expiry', expiryDate.toISOString());
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expiry');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate('/login');
  };

  const isAdmin = () => user?.role === 'admin';
  const isModerator = () => user?.role === 'moderator' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAdmin,
      isModerator
    }}>
      {children}
    </AuthContext.Provider>
  );
};
