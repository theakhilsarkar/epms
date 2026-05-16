'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  branchId?: string;
  isAdmin: boolean;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true on first load to check localStorage

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const userData: User = res.data;

    // Persist user object in localStorage for session restoration
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Role-based redirect
    if (userData.role === 'admin' || userData.isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/employee/dashboard');
    }
  };

  const logout = () => {
    authService.logout(); // Clears token from localStorage
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.isAdmin === true || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
