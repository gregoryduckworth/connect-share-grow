
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireModerator = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isModerator } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-social-primary mx-auto mb-4"></div>
          <p className="text-social-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-social-background">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need administrator privileges to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-social-primary text-white px-4 py-2 rounded hover:bg-social-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (requireModerator && !isModerator()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-social-background">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need moderator privileges to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-social-primary text-white px-4 py-2 rounded hover:bg-social-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
