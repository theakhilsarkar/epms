import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute employeeOnly>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
