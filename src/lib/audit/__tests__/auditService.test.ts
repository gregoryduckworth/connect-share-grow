
import { describe, it, expect, beforeEach } from 'vitest'
import { auditService } from '../auditService'

describe('AuditService', () => {
  beforeEach(() => {
    auditService.clearLogs()
    auditService.setCurrentUser({ id: 'test-user', role: 'admin' })
  })

  it('should create audit log entries', () => {
    const entry = auditService.log(
      'user_login',
      'user',
      'test-user',
      'User logged in successfully'
    )

    expect(entry).toBeDefined()
    expect(entry.action).toBe('user_login')
    expect(entry.resource).toBe('user')
    expect(entry.resourceId).toBe('test-user')
    expect(entry.userId).toBe('test-user')
    expect(entry.userRole).toBe('admin')
  })

  it('should retrieve logs by user', () => {
    auditService.logUserAction('user_login', 'User logged in')
    auditService.logUserAction('user_logout', 'User logged out')

    const logs = auditService.getLogsByUser('test-user')
    expect(logs).toHaveLength(2)
  })

  it('should retrieve logs by action', () => {
    auditService.logUserAction('user_login', 'First login')
    auditService.logUserAction('user_login', 'Second login')
    auditService.logUserAction('user_logout', 'Logout')

    const logs = auditService.getLogsByAction('user_login')
    expect(logs).toHaveLength(2)
  })

  it('should retrieve logs by resource', () => {
    auditService.logCommunityAction('community_create', 'comm-1', 'Created community')
    auditService.logCommunityAction('community_update', 'comm-1', 'Updated community')
    auditService.logPostAction('post_create', 'post-1', 'Created post')

    const logs = auditService.getLogsByResource('community')
    expect(logs).toHaveLength(2)

    const specificLogs = auditService.getLogsByResource('community', 'comm-1')
    expect(specificLogs).toHaveLength(2)
  })

  it('should filter logs by time range', () => {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

    auditService.logUserAction('user_login', 'Recent login')
    
    const logs = auditService.getLogsByTimeRange(oneHourAgo, now)
    expect(logs).toHaveLength(1)
  })

  it('should handle security events with high priority', () => {
    const entry = auditService.logSecurityEvent(
      'security_breach_detected',
      'Suspicious login attempt detected'
    )

    expect(entry.metadata?.severity).toBe('high')
    expect(entry.metadata?.requiresInvestigation).toBe(true)
  })
})
