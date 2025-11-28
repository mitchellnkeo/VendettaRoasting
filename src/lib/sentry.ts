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
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Wrap an async function with Sentry error tracking
 */
export function withSentry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: any[]) => {
    const transaction = Sentry.startTransaction({
      name: context || fn.name || 'function',
      op: 'function',
    });

    try {
      const result = await fn(...args);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      Sentry.captureException(error as Error, {
        tags: {
          function: context || fn.name || 'unknown',
        },
      });
      throw error;
    } finally {
      transaction.finish();
    }
  }) as T;
}

