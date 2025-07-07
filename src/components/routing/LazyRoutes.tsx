
import { lazy } from 'react';

// Lazy load all page components for code splitting
export const LandingPage = lazy(() => import('@/pages/LandingPage'));
export const Index = lazy(() => import('@/pages/Index'));
export const CommunitiesPage = lazy(() => import('@/pages/CommunitiesPage'));
export const CommunityDetailPage = lazy(() => import('@/pages/CommunityDetailPage'));
export const PostDetailPage = lazy(() => import('@/pages/PostDetailPage'));
export const ModeratePage = lazy(() => import('@/pages/ModeratePage'));
export const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
export const ChatPage = lazy(() => import('@/pages/ChatPage'));
export const HotTopicsPage = lazy(() => import('@/pages/HotTopicsPage'));
export const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
export const LoginPage = lazy(() => import('@/pages/LoginPage'));
export const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
export const NotFound = lazy(() => import('@/pages/NotFound'));
export const ConnectionsPage = lazy(() => import('@/pages/ConnectionsPage'));
export const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));

// Admin Pages
export const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
export const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
export const AdminCommunitiesPage = lazy(() => import('@/pages/admin/AdminCommunitiesPage'));
export const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));
export const AdminRolesPage = lazy(() => import('@/pages/admin/AdminRolesPage'));
export const AdminAnalyticsPage = lazy(() => import('@/pages/admin/AdminAnalyticsPage'));
export const AdminLogsPage = lazy(() => import('@/pages/admin/AdminLogsPage'));
export const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
