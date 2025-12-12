/**
 * Performance Monitoring Utilities
 * 
 * Functions for tracking and monitoring performance metrics
 */

/**
 * Measure and log performance of an async function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }
    
    // Track with Sentry if available
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      const Sentry = require('@sentry/nextjs');
      Sentry.addBreadcrumb({
        category: 'performance',
        message: name,
        level: 'info',
        data: {
          duration,
        },
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    // Log error with duration
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
    }
    
    throw error;
  }
}

/**
 * Get Core Web Vitals metrics
 */
export function getWebVitals() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navigation) {
      return null;
    }

    return {
      // Time to First Byte
      ttfb: navigation.responseStart - navigation.requestStart,
      
      // First Contentful Paint (if available)
      fcp: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      
      // Largest Contentful Paint (if available)
      lcp: 0, // Would need to be measured separately
      
      // Total load time
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      
      // DOM Content Loaded
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      
      // DOM Interactive
      domInteractive: navigation.domInteractive - navigation.fetchStart,
    };
  } catch (error) {
    console.error('Error getting web vitals:', error);
    return null;
  }
}

/**
 * Report performance metrics to analytics
 */
export function reportPerformance(metrics: {
  name: string;
  value: number;
  id?: string;
  delta?: number;
  entries?: PerformanceEntry[];
}) {
  // Report to Google Analytics if available
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metrics.name,
      value: Math.round(metrics.value),
      non_interaction: true,
    });
  }

  // Report to Sentry if available
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = require('@sentry/nextjs');
    Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: metrics.name,
      level: 'info',
      data: {
        value: metrics.value,
        delta: metrics.delta,
      },
    });
  }
}

