
import { logger } from '@/lib/logging/logger';

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
  
  logger.debug('Screen reader announcement', { message, priority });
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  firstFocusable?.focus();
  
  return () => element.removeEventListener('keydown', handleTabKey);
};

export const checkColorContrast = (foreground: string, background: string): boolean => {
  // Simplified contrast check - in production, use a proper contrast library
  const getForegroundLuminance = (color: string) => {
    // Simple luminance calculation for basic colors
    const colorMap: Record<string, number> = {
      white: 1,
      black: 0,
      gray: 0.5,
      blue: 0.3,
      red: 0.4,
      green: 0.6,
    };
    return colorMap[color.toLowerCase()] || 0.5;
  };
  
  const fgLum = getForegroundLuminance(foreground);
  const bgLum = getForegroundLuminance(background);
  
  const contrast = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  
  // WCAG AA standard requires 4.5:1 for normal text
  return contrast >= 4.5;
};
