import { logger } from '@/lib/logging/logger';

export interface CurrentUser {
  id: string;
  role: string;
}

export enum AuditResource {
  User = 'user',
  Admin = 'admin',
  Community = 'community',
  Post = 'post',
  Report = 'report',
  Security = 'security',
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  details: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export type AuditAction =
  // User actions
  | 'user_login'
  | 'user_logout'
  | 'user_register'
  | 'user_profile_update'
  | 'user_password_change'
  | 'user_email_change'
  // Admin actions
  | 'admin_user_suspend'
  | 'admin_user_activate'
  | 'admin_user_role_change'
  | 'admin_user_delete'
  // Community actions
  | 'community_create'
  | 'community_update'
  | 'community_delete'
  | 'community_join'
  | 'community_leave'
  | 'community_approve'
  | 'community_reject'
  | 'community_suspend'
  // Post actions
  | 'post_create'
  | 'post_update'
  | 'post_delete'
  | 'post_lock'
  | 'post_unlock'
  | 'post_pin'
  | 'post_unpin'
  // Report actions
  | 'report_create'
  | 'report_resolve'
  | 'report_delete'
  | 'report_escalate'
  // Moderation actions
  | 'content_moderate'
  | 'user_warn'
  | 'user_mute'
  | 'user_ban'
  // System actions
  | 'system_backup'
  | 'system_maintenance'
  | 'security_breach_detected';

class AuditService {
  private logs: AuditLogEntry[] = [];
  private currentUser: CurrentUser | null = null;

  setCurrentUser(user: CurrentUser | null): void {
    this.currentUser = user;
  }

  private generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private getBrowserInfo(): { ipAddress?: string; userAgent?: string } {
    if (typeof window === 'undefined') return {};
    return {
      ipAddress: '127.0.0.1', // In real app, get from request
      userAgent: navigator.userAgent,
    };
  }

  log(
    action: AuditAction,
    resource: AuditResource,
    resourceId: string,
    details: string,
    metadata?: Record<string, unknown>,
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      userId: this.currentUser?.id || 'anonymous',
      userRole: this.currentUser?.role || 'guest',
      action,
      resource,
      resourceId,
      details,
      metadata,
      ...this.getBrowserInfo(),
    };
    this.logs.unshift(entry);
    if (this.logs.length > 1000) {
      this.logs.splice(1000);
    }
    logger.info('Audit log entry created', {
      action,
      resource,
      resourceId,
      userId: entry.userId,
    });
    if (process.env.NODE_ENV === 'production') {
      this.sendToAuditService(entry);
    }
    return entry;
  }

  private async sendToAuditService(entry: AuditLogEntry): Promise<void> {
    try {
      logger.info('Sending audit log to external service:', entry);
    } catch (error) {
      logger.error('Failed to send audit log to external service', error);
    }
  }

  getLogs(limit = 100): AuditLogEntry[] {
    return this.logs.slice(0, limit);
  }

  getLogsByUser(userId: string, limit = 100): AuditLogEntry[] {
    return this.logs.filter((log) => log.userId === userId).slice(0, limit);
  }

  getLogsByResource(resource: AuditResource, resourceId?: string, limit = 100): AuditLogEntry[] {
    return this.logs
      .filter((log) => {
        if (resourceId) {
          return log.resource === resource && log.resourceId === resourceId;
        }
        return log.resource === resource;
      })
      .slice(0, limit);
  }

  getLogsByAction(action: AuditAction, limit = 100): AuditLogEntry[] {
    return this.logs.filter((log) => log.action === action).slice(0, limit);
  }

  getLogsByTimeRange(startDate: Date, endDate: Date, limit = 100): AuditLogEntry[] {
    return this.logs
      .filter((log) => log.timestamp >= startDate && log.timestamp <= endDate)
      .slice(0, limit);
  }

  clearLogs(): void {
    this.logs = [];
    logger.info('Audit logs cleared');
  }

  logUserAction(
    action: AuditAction,
    details: string,
    metadata?: Record<string, unknown>,
  ): AuditLogEntry {
    return this.log(
      action,
      AuditResource.User,
      this.currentUser?.id || 'anonymous',
      details,
      metadata,
    );
  }

  logAdminAction(
    action: AuditAction,
    targetId: string,
    details: string,
    metadata?: Record<string, unknown>,
  ): AuditLogEntry {
    return this.log(action, AuditResource.Admin, targetId, details, metadata);
  }

  logCommunityAction(
    action: AuditAction,
    communityId: string,
    details: string,
    metadata?: Record<string, unknown>,
  ): AuditLogEntry {
    return this.log(action, AuditResource.Community, communityId, details, metadata);
  }

  logPostAction(
    action: AuditAction,
    postId: string,
    details: string,
    metadata?: Record<string, unknown>,
  ): AuditLogEntry {
    return this.log(action, AuditResource.Post, postId, details, metadata);
  }

  logReportAction(
    action: AuditAction,
    reportId: string,
    details: string,
    metadata?: Record<string, unknown>,
  ): AuditLogEntry {
    return this.log(action, AuditResource.Report, reportId, details, metadata);
  }

  logSecurityEvent(
    action: AuditAction,
    details: string,
    metadata?: Record<string, unknown>,
  ): AuditLogEntry {
    return this.log(action, AuditResource.Security, 'system', details, {
      ...metadata,
      severity: 'high',
      requiresInvestigation: true,
    });
  }
}

export const auditService = new AuditService();

declare global {
  interface Window {
    __auditService?: AuditService;
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.__auditService = auditService;
}
