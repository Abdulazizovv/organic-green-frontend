'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // wait until auth state resolved

    // If not logged in redirect to login with next param
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname || '/admin/dashboard')}`);
      return;
    }

    // If logged in but not admin redirect home
    if (!isAdmin) {
      router.push('/');
    }
  }, [loading, isAuthenticated, isAdmin, router, pathname]);

  if (loading || (!isAdmin && isAuthenticated)) {
    return (
      fallback || (
        <div className="w-full flex items-center justify-center py-20 text-gray-500">
          <div className="animate-pulse">Loading admin panel...</div>
        </div>
      )
    );
  }

  if (!isAdmin) return null; // redirect in effect

  return <>{children}</>;
}

export default AdminGuard;
