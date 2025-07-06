import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Pages
import LandingPage from "@/pages/LandingPage";
import Index from "@/pages/Index";
import CommunitiesPage from "@/pages/CommunitiesPage";
import CommunityDetailPage from "@/pages/CommunityDetailPage";
import PostDetailPage from "@/pages/PostDetailPage";
import ModeratePage from "@/pages/ModeratePage";
import ProfilePage from "@/pages/ProfilePage";
import ChatPage from "@/pages/ChatPage";
import HotTopicsPage from "@/pages/HotTopicsPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";
import ConnectionsPage from "@/pages/ConnectionsPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminCommunitiesPage from "@/pages/admin/AdminCommunitiesPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminRolesPage from "@/pages/admin/AdminRolesPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminLogsPage from "@/pages/admin/AdminLogsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";

import "./App.css";

function App() {
  // Custom component to handle root route logic
  const RootRoute = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) return null; // or a loading spinner
    if (user) {
      return <MainLayout />;
    }
    return <LandingPage />;
  };
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Root route: Landing for logged-out, Main app for logged-in */}
              <Route path="/" element={<RootRoute />}>
                {/* Main app routes for logged-in users */}
                <Route index element={<Index />} />
                <Route path="home" element={<Index />} />
                <Route path="communities" element={<CommunitiesPage />} />
                <Route
                  path="community/:communitySlug"
                  element={<CommunityDetailPage />}
                />
                <Route
                  path="community/:communitySlug/post/:postId"
                  element={<PostDetailPage />}
                />
                <Route
                  path="community/:communitySlug/moderate"
                  element={
                    <ProtectedRoute requireModerator={true}>
                      <ModeratePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="hot-topics" element={<HotTopicsPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="connections" element={<ConnectionsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="communities" element={<AdminCommunitiesPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="roles" element={<AdminRolesPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="logs" element={<AdminLogsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
