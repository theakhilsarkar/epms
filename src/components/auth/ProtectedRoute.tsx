'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  employeeOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
  employeeOnly = false,
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
        return;
      }
      // Admin trying to access employee-only route
      if (employeeOnly && isAdmin) {
        router.replace('/admin/dashboard');
        return;
      }
      // Non-admin trying to access admin-only route
      if (adminOnly && !isAdmin) {
        router.replace('/employee/dashboard');
        return;
      }
    }
  }, [user, loading, isAdmin, adminOnly, employeeOnly, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-sm text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
