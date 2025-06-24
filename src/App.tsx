import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";

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
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Landing Page - Public Route */}
            <Route path="/landing" element={<LandingPage />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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

            {/* Protected Main App Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Index />} />
              <Route path="home" element={<Index />} />
              <Route path="communities" element={<CommunitiesPage />} />
              <Route
                path="community/:communityId"
                element={<CommunityDetailPage />}
              />
              <Route
                path="community/:communityId/post/:postId"
                element={<PostDetailPage />}
              />
              <Route
                path="community/:communityId/moderate"
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

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
