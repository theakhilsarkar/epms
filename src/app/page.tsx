'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect based on role
        if (user.isAdmin || user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/employee/dashboard');
        }
      } else {
        // User is not logged in, redirect to login
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}
