'use client';

import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="flex-1">
        {/* Mobile menu button could go here */}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-slate-900">{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600 ml-4 transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Login
          </button>
        )}
      </div>
    </header>
  );
}
