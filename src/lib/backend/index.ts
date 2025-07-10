import { userService } from './services/userService';
import { postService } from './services/postService';
import { communityService } from './services/communityService';
import { reportService } from './services/reportService';
import { notificationService } from './services/notificationService';
import { adminService, mockPendingModeratorRoleChanges } from './services/adminService';

// Re-export mock data for backward compatibility
export { USERS_DATA as mockUsers } from './data/users';

// Unified API interface
export const api = {
  // User methods
  getUsers: userService.getUsers,
  getUserById: userService.getUserById,
  getUserByEmail: userService.getUserByEmail,
  createUser: userService.createUser,
  updateUser: userService.updateUser,
  getUserCommunities: userService.getUserCommunities,
  getUserCommunityMemberships: userService.getUserCommunityMemberships, // <-- add this
  removeUserCommunityMembership: userService.removeUserCommunityMembership,

  // Post methods
  getPosts: postService.getPosts,
  getPostDetail: postService.getPostDetail,
  getHotPosts: postService.getHotPosts,
  getCommunityPosts: postService.getCommunityPosts,
  createPost: postService.createPost,
  likePost: postService.likePost,
  unlikePost: postService.unlikePost,
  getUserLikedPosts: postService.getUserLikedPosts, // <-- exposed for use in the UI

  // Community methods
  getCommunities: communityService.getCommunities,
  getCommunityDetail: communityService.getCommunityDetail,

  // Report methods
  getReports: reportService.getReports,
  submitReport: reportService.submitReport,

  // Notification methods
  getNotifications: notificationService.getUserNotifications,
  markNotificationAsRead: notificationService.markUserNotificationAsRead,

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
