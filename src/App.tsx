import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { useAuth } from '@/contexts/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import SuspenseWrapper from '@/components/common/SuspenseWrapper';
import { initializeGlobalErrorHandler } from '@/lib/errors/globalErrorHandler';
import { performanceMonitor } from '@/lib/monitoring/performanceMonitor';
import { BUILD_CONFIG, validateEnvironment, getEnvironmentInfo } from '@/lib/config/buildConfig';
import { setupSecurityHeaders, validateSecurityHeaders } from '@/lib/security/securityHeaders';
import {
  preloadCriticalResources,
  setupImageLazyLoading,
  checkPerformanceBudget,
  monitorMemoryUsage,
} from '@/lib/performance/optimizations';
import { logger } from '@/lib/logging/logger';
import { ChatThreadProvider } from '@/contexts/ChatThreadContext';

// Lazy-loaded pages for code splitting
import * as LazyPages from '@/components/routing/LazyRoutes';

import './App.css';

function App() {
  // Initialize all production systems
  useEffect(() => {
    // Log environment info
    logger.info('Application starting', getEnvironmentInfo());

    // Validate environment configuration
    const envValidation = validateEnvironment();
    if (!envValidation.isValid) {
      logger.warn('Environment validation issues', envValidation.errors);
    }

    // Initialize monitoring and error handling
    initializeGlobalErrorHandler();

    if (BUILD_CONFIG.ENABLE_PERFORMANCE_MONITORING) {
      performanceMonitor.measureWebVitals();

      // Monitor performance periodically
      const performanceInterval = setInterval(() => {
        monitorMemoryUsage();
        checkPerformanceBudget();
      }, 30000); // Every 30 seconds

      return () => clearInterval(performanceInterval);
    }

    // Setup security
    if (BUILD_CONFIG.ENABLE_CSP) {
      setupSecurityHeaders();
      setTimeout(validateSecurityHeaders, 1000);
    }

    // Performance optimizations
    preloadCriticalResources();
    setupImageLazyLoading();

    logger.info('Application initialization complete');
  }, []);

  // Custom component to handle root route logic
  const RootRoute = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) return null; // or a loading spinner
    if (user) {
      return <MainLayout />;
    }
    return (
      <SuspenseWrapper componentName="LandingPage">
        <LazyPages.LandingPage />
      </SuspenseWrapper>
    );
  };

  return (
    <Router>
      <ChatThreadProvider>
        <AuthProvider>
          <QueryProvider>
            <ErrorBoundary>
              <div className="App">
                <Routes>
                  {/* Root route: Landing for logged-out, Main app for logged-in */}
                  <Route path="/" element={<RootRoute />}>
                    {/* Main app routes for logged-in users */}
                    <Route
                      index
                      element={
                        <SuspenseWrapper componentName="Index">
                          <LazyPages.Index />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="home"
                      element={
                        <SuspenseWrapper componentName="Index">
                          <LazyPages.Index />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="communities"
                      element={
                        <SuspenseWrapper componentName="CommunitiesPage">
                          <LazyPages.CommunitiesPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="community/:communitySlug"
                      element={
                        <SuspenseWrapper componentName="CommunityDetailPage">
                          <LazyPages.CommunityDetailPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="community/:communitySlug/post/:postId"
                      element={
                        <SuspenseWrapper componentName="PostDetailPage">
                          <LazyPages.PostDetailPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="community/:communitySlug/moderate"
                      element={
                        <ProtectedRoute requireModerator={true}>
                          <SuspenseWrapper componentName="ModeratePage">
                            <LazyPages.ModeratePage />
                          </SuspenseWrapper>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="hot-topics"
                      element={
                        <SuspenseWrapper componentName="HotTopicsPage">
                          <LazyPages.HotTopicsPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="chat"
                      element={
                        <SuspenseWrapper componentName="ChatPage">
                          <LazyPages.ChatPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="connections"
                      element={
                        <SuspenseWrapper componentName="ConnectionsPage">
                          <LazyPages.ConnectionsPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="profile"
                      element={
                        <SuspenseWrapper componentName="ProfilePage">
                          <LazyPages.ProfilePage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <SuspenseWrapper componentName="SettingsPage">
                          <LazyPages.SettingsPage />
                        </SuspenseWrapper>
                      }
                    />
                  </Route>

                  {/* Public Auth Routes */}
                  <Route
                    path="/login"
                    element={
                      <SuspenseWrapper componentName="LoginPage">
                        <LazyPages.LoginPage />
                      </SuspenseWrapper>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <SuspenseWrapper componentName="RegisterPage">
                        <LazyPages.RegisterPage />
                      </SuspenseWrapper>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <SuspenseWrapper componentName="ForgotPasswordPage">
                        <LazyPages.ForgotPasswordPage />
                      </SuspenseWrapper>
                    }
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={
                        <SuspenseWrapper componentName="AdminDashboard">
                          <LazyPages.AdminDashboard />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="users"
                      element={
                        <SuspenseWrapper componentName="AdminUsersPage">
                          <LazyPages.AdminUsersPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="communities"
                      element={
                        <SuspenseWrapper componentName="AdminCommunitiesPage">
                          <LazyPages.AdminCommunitiesPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="reports"
                      element={
                        <SuspenseWrapper componentName="AdminReportsPage">
                          <LazyPages.AdminReportsPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="roles"
                      element={
                        <SuspenseWrapper componentName="AdminRolesPage">
                          <LazyPages.AdminRolesPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="analytics"
                      element={
                        <SuspenseWrapper componentName="AdminAnalyticsPage">
                          <LazyPages.AdminAnalyticsPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="logs"
                      element={
                        <SuspenseWrapper componentName="AdminLogsPage">
                          <LazyPages.AdminLogsPage />
                        </SuspenseWrapper>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <SuspenseWrapper componentName="AdminSettingsPage">
                          <LazyPages.AdminSettingsPage />
                        </SuspenseWrapper>
                      }
                    />
                  </Route>

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <SuspenseWrapper componentName="NotFound">
                        <LazyPages.NotFound />
                      </SuspenseWrapper>
                    }
                  />
                </Routes>
                <Toaster />
              </div>
            </ErrorBoundary>
          </QueryProvider>
        </AuthProvider>
      </ChatThreadProvider>
    </Router>
  );
}

export default App;
