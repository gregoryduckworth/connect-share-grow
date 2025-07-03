import { userService } from "./services/userService";
import { postService } from "./services/postService";
import { communityService } from "./services/communityService";
import { reportService } from "./services/reportService";
import { notificationService } from "./services/notificationService";
import {
  adminService,
  mockPendingModeratorRoleChanges,
} from "./services/adminService";

// Re-export mock data for backward compatibility
export { USERS_DATA as mockUsers } from "./data/users";

// Unified API interface
export const api = {
  // User methods
  getUsers: userService.getUsers,
  getUserById: userService.getUserById,
  getUserByEmail: userService.getUserByEmail,
  createUser: userService.createUser,
  updateUser: userService.updateUser,

  // Post methods
  getPosts: postService.getPosts,
  getPostDetail: postService.getPostDetail,
  getHotPosts: postService.getHotPosts,
  getCommunityPosts: postService.getCommunityPosts,
  createPost: postService.createPost,

  // Community methods
  getCommunities: communityService.getCommunities,
  getCommunityDetail: communityService.getCommunityDetail,

  // Report methods
  getReports: reportService.getReports,
  submitReport: reportService.submitReport,

  // Notification methods
  getNotifications: notificationService.getNotifications,
  markNotificationAsRead: notificationService.markNotificationAsRead,

  // Admin methods
  getAdminRoles: adminService.getAdminRoles,
  getPendingAdminRoleChanges: adminService.getPendingAdminRoleChanges,
  getAnalyticsCommunities: adminService.getAnalyticsCommunities,
  getPlatformStats: adminService.getPlatformStats,
  getActivityData: adminService.getActivityData,
  getSizeDistribution: adminService.getSizeDistribution,
};

// Export specific functions for backward compatibility
export const getMockFlaggedReports = reportService.getFlaggedReports;
export { mockPendingModeratorRoleChanges };
