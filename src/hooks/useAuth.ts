import { useState, useEffect } from 'react';

// Placeholder hook for authentication state
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    // Check local storage for token on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
      // Ideally, decode token or fetch profile here to set user
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({ name: 'Admin User', role: 'admin' });
    }
  }, []);

  return { isAuthenticated, user };
}
