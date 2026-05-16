import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
