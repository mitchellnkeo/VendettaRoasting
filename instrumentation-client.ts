/**
 * Next.js Client-Side Instrumentation File
 * 
 * This file configures Sentry for client-side (browser) initialization.
 * It replaces the deprecated sentry.client.config.ts file.
 * 
 * Note: This file is automatically loaded by Next.js for client-side code.
 */

import * as Sentry from "@sentry/nextjs";

// Prevent double initialization
if (typeof window !== 'undefined' && !(window as any).__SENTRY_INITIALIZED__) {
  (window as any).__SENTRY_INITIALIZED__ = true;

  Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Set environment
  environment: process.env.NODE_ENV || "development",

  // Filter out certain errors
  beforeSend(event, hint) {
    // Don't send errors in development unless explicitly enabled
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SENTRY_DEBUG) {
      return null;
    }

    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = String(error.message);
        
        // Ignore common browser extension errors
        if (
          errorMessage.includes("chrome-extension://") ||
          errorMessage.includes("moz-extension://") ||
          errorMessage.includes("ResizeObserver loop limit exceeded")
        ) {
          return null;
        }
      }
    }

    return event;
  },
  });
}

// Export router transition hook for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

