import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else {
        setIsChecking(false);
      }
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="bg-cream-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-coffee-light rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-coffee-light rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-coffee-light rounded w-3/4"></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-coffee-light rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-coffee-light rounded w-3/4"></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-coffee-light rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-coffee-light rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
