/**
 * Error Boundary Component
 * 
 * Catches React errors and displays a friendly error message.
 * Also reports errors to Sentry.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry (if available)
    try {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Dynamically import Sentry to avoid issues if not configured
        import('@sentry/nextjs').then((Sentry) => {
          Sentry.captureException(error, {
            contexts: {
              react: {
                componentStack: errorInfo.componentStack,
              },
            },
          });
        }).catch(() => {
          // Silently fail if Sentry isn't available
        });
      }
    } catch (sentryError) {
      // Silently fail if Sentry isn't available
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="bg-cream-light min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="bg-white rounded-2xl shadow-soft p-12 md:p-16">
              {/* Error Icon */}
              <div className="mb-6">
                <svg
                  className="w-24 h-24 mx-auto text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-4">
                Something Went Wrong
              </h1>
              <p className="text-lg text-coffee mb-8 max-w-md mx-auto">
                We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.href = '/';
                  }}
                  className="inline-block bg-coffee hover:bg-coffee-light text-cream-light px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-soft hover:shadow-warm"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-block border-2 border-coffee text-coffee hover:bg-coffee hover:text-cream-light px-8 py-4 rounded-full font-semibold transition-all duration-300"
                >
                  Try Again
                </button>
              </div>

              {/* Helpful Information */}
              <div className="mt-12 pt-8 border-t border-cream">
                <p className="text-sm text-coffee mb-4">
                  If this problem persists, please contact us:
                </p>
                <Link
                  href="/contact"
                  className="text-coffee-light hover:text-coffee-dark underline font-semibold"
                >
                  Contact Support
                </Link>
              </div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-semibold text-red-800 mb-2">Error Details (Development Only):</p>
                  <pre className="text-xs text-red-700 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

