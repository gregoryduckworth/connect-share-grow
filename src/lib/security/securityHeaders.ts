import { BUILD_CONFIG } from '@/lib/config/buildConfig';
import { logger } from '@/lib/logging/logger';

export const SECURITY_HEADERS = {
  // Content Security Policy
  CSP_HEADER: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:",
  
  // Other security headers
  X_FRAME_OPTIONS: 'DENY',
  X_CONTENT_TYPE_OPTIONS: 'nosniff',
  X_XSS_PROTECTION: '1; mode=block',
  REFERRER_POLICY: 'strict-origin-when-cross-origin',
  PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=()',
} as const;

export const setupSecurityHeaders = () => {
  if (!BUILD_CONFIG.ENABLE_CSP) {
    logger.info('CSP is disabled');
    return;
  }

  // Set meta tags for security headers (client-side implementation)
  const setMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[http-equiv="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('http-equiv', name);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Apply security headers via meta tags
  setMetaTag('Content-Security-Policy', SECURITY_HEADERS.CSP_HEADER);
  setMetaTag('X-Frame-Options', SECURITY_HEADERS.X_FRAME_OPTIONS);
  setMetaTag('X-Content-Type-Options', SECURITY_HEADERS.X_CONTENT_TYPE_OPTIONS);
  setMetaTag('X-XSS-Protection', SECURITY_HEADERS.X_XSS_PROTECTION);
  setMetaTag('Referrer-Policy', SECURITY_HEADERS.REFERRER_POLICY);
  setMetaTag('Permissions-Policy', SECURITY_HEADERS.PERMISSIONS_POLICY);

  logger.info('Security headers configured');
};

export const validateSecurityHeaders = () => {
  const checks = [
    {
      name: 'CSP Header',
      check: () => !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
    },
    {
      name: 'X-Frame-Options',
      check: () => !!document.querySelector('meta[http-equiv="X-Frame-Options"]'),
    },
    {
      name: 'HTTPS',
      check: () => location.protocol === 'https:' || location.hostname === 'localhost',
    },
  ];

  const results = checks.map(({ name, check }) => ({
    name,
    passed: check(),
  }));

  const failedChecks = results.filter(r => !r.passed);
  
  if (failedChecks.length > 0) {
    logger.warn('Security validation failed', { failedChecks });
  } else {
    logger.info('Security validation passed');
  }

  return {
    passed: failedChecks.length === 0,
    results,
  };
};
