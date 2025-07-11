type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId: string;
}

class Logger {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId: this.userId,
      sessionId: this.sessionId,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const logLevels = ['debug', 'info', 'warn', 'error'];
    const currentLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
    return logLevels.indexOf(level) >= logLevels.indexOf(currentLevel);
  }

  private formatMessage(entry: LogEntry): string {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.sessionId}]`;
    const userInfo = entry.userId ? ` [User: ${entry.userId}]` : '';
    return `${prefix}${userInfo} ${entry.message}`;
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog('debug')) return;

    const entry = this.createLogEntry('debug', message, data);
    console.debug(this.formatMessage(entry), data || '');
  }

  info(message: string, data?: any) {
    if (!this.shouldLog('info')) return;

    const entry = this.createLogEntry('info', message, data);
    console.info(this.formatMessage(entry), data || '');
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog('warn')) return;

    const entry = this.createLogEntry('warn', message, data);
    console.warn(this.formatMessage(entry), data || '');
  }

  error(message: string, error?: Error | any) {
    if (!this.shouldLog('error')) return;

    const entry = this.createLogEntry('error', message, error);
    console.error(this.formatMessage(entry), error || '');

    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // This would integrate with services like Sentry, LogRocket, etc.
    // For now, we'll just store in sessionStorage for debugging
    try {
      const logs = JSON.parse(sessionStorage.getItem('app_logs') || '[]');
      logs.push(entry);
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      sessionStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store log entry:', error);
    }
  }

  // Get logs for debugging (development only)
  getLogs(): LogEntry[] {
    if (process.env.NODE_ENV !== 'development') return [];

    try {
      return JSON.parse(sessionStorage.getItem('app_logs') || '[]');
    } catch {
      return [];
    }
  }

  clearLogs() {
    sessionStorage.removeItem('app_logs');
  }
}

export const logger = new Logger();
