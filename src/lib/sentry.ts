/**
 * Sentry Utility Functions
 * 
 * Helper functions for Sentry error tracking and performance monitoring
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception with context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture a message (non-error)
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, category?: string, level: Sentry.SeverityLevel = 'info', data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id?: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Start a transaction for performance monitoring
 * @deprecated This function is deprecated. startTransaction was removed in Sentry v7+
 * Use Sentry.startSpan() or Sentry.startInactiveSpan() directly instead.
 * This function is kept for backwards compatibility but returns a no-op.
 */
export function startTransaction(name: string, op: string) {
  // Return a no-op object that matches the old transaction interface
  // This prevents TypeScript errors while maintaining backwards compatibility
  return {
    setStatus: (_status: string) => {},
    finish: () => {},
    setTag: (_key: string, _value: string) => {},
    setData: (_key: string, _value: any) => {},
    startChild: (_options: any) => ({
      setStatus: () => {},
      finish: () => {},
      setTag: () => {},
      setData: () => {},
    }),
  };
}

/**
 * Wrap an async function with Sentry error tracking
 * Note: This function wraps the function with error tracking but doesn't use transactions
 * (which were deprecated in Sentry v7+)
 */
export function withSentry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      Sentry.captureException(error as Error, {
        tags: {
          function: context || fn.name || 'unknown',
        },
      });
      throw error;
    }
  }) as T;
}

