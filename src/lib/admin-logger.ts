export interface AdminLogEntry {
  id: string; // Add unique id for AdminTable compatibility
  timestamp: Date;
  adminId: string;
  action: string;
  details: string;
  targetId: string;
  targetType: string;
}

// In a real application, this would be stored in a database
export const adminLogs: AdminLogEntry[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    adminId: "admin-1",
    action: "community_approved",
    details: "Approved community: Fitness Enthusiasts",
    targetId: "comm-456",
    targetType: "community",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    adminId: "admin-2",
    action: "content_locked",
    details: "Locked post due to inappropriate content",
    targetId: "post-789",
    targetType: "post",
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    adminId: "admin-1",
    action: "user_warned",
    details: "Issued warning to user for violating community guidelines",
    targetId: "user-101",
    targetType: "user",
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    adminId: "admin-3",
    action: "community_rejected",
    details: "Rejected community: Inappropriate content sharing",
    targetId: "comm-202",
    targetType: "community",
  },
  {
    id: "log-5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    adminId: "admin-2",
    action: "user_suspended",
    details: "Suspended user account for repeated violations",
    targetId: "user-303",
    targetType: "user",
  },
];

export interface AdminAction {
  action: string;
  details: string;
  targetId: string;
  targetType: string;
}

export const logAdminAction = (action: AdminAction) => {
  const logEntry: AdminLogEntry = {
    ...action,
    timestamp: new Date(),
    adminId: "admin-1", // In a real app, this would be the current admin's ID
    id: `log-${adminLogs.length + 1}`, // Generate a new id based on the current log count
  };

  adminLogs.unshift(logEntry);
  console.log("Admin action logged:", logEntry);

  return logEntry;
};
