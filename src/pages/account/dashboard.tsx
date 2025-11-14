import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Redirect /account/dashboard to /account
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account');
  }, [router]);

  return null;
}
