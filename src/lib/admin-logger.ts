import { auditService, AuditAction } from './audit/auditService';
import { logger } from '@/lib/logging/logger';

export interface AdminLogEntry {
  id: string;
  timestamp: Date;
  adminId: string;
  action: string;
  details: string;
  targetId: string;
  targetType: string;
}

// Legacy mock data - keeping for compatibility
export const adminLogs: AdminLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    adminId: 'admin-1',
    action: 'community_approved',
    details: 'Approved community: Fitness Enthusiasts',
    targetId: 'comm-456',
    targetType: 'community',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    adminId: 'admin-2',
    action: 'content_locked',
    details: 'Locked post due to inappropriate content',
    targetId: 'post-789',
    targetType: 'post',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    adminId: 'admin-1',
    action: 'user_warned',
    details: 'Issued warning to user for violating community guidelines',
    targetId: 'user-101',
    targetType: 'user',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    adminId: 'admin-3',
    action: 'community_rejected',
    details: 'Rejected community: Inappropriate content sharing',
    targetId: 'comm-202',
    targetType: 'community',
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    adminId: 'admin-2',
    action: 'user_suspended',
    details: 'Suspended user account for repeated violations',
    targetId: 'user-303',
    targetType: 'user',
  },
];

export interface AdminAction {
  action: string;
  details: string;
  targetId: string;
  targetType: string;
}

// Enhanced logging function that uses the audit service
export const logAdminAction = (action: AdminAction) => {
  // Create legacy log entry for compatibility
  const logEntry: AdminLogEntry = {
    ...action,
    timestamp: new Date(),
    adminId: 'admin-1', // In a real app, this would be the current admin's ID
    id: `log-${adminLogs.length + 1}`,
  };

  adminLogs.unshift(logEntry);
  logger.info('Admin action logged:', logEntry);

  // Also log to the new audit service
  const auditAction = mapToAuditAction(action.action);
  auditService.log(auditAction, action.targetType, action.targetId, action.details, {
    adminAction: true,
    originalAction: action.action,
  });

  return logEntry;
};

// Map legacy action strings to audit action types
function mapToAuditAction(action: string): AuditAction {
  const actionMap: Record<string, AuditAction> = {
    community_approved: 'community_approve',
    community_rejected: 'community_reject',
    community_suspended: 'community_suspend',
    content_locked: 'post_lock',
    user_warned: 'user_warn',
    user_suspended: 'admin_user_suspend',
    user_activated: 'admin_user_activate',
    report_resolved: 'report_resolve',
    report_deleted: 'report_delete',
    role_changed: 'admin_user_role_change',
  };

  return actionMap[action] || 'content_moderate';
}

// Initialize audit service with admin user context
auditService.setCurrentUser({ id: 'admin-1', role: 'admin' });
