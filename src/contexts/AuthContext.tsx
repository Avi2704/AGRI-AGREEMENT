import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import type { UserProfile, UserRole } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  login: (payload: { phone: string; otp: string; role: UserRole; name: string; language?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(authService.currentUser());

  const value = useMemo(
    () => ({
      user,
      login: async (payload: { phone: string; otp: string; role: UserRole; name: string; language?: string }) => {
        const profile = await authService.verifyOtp(
          payload.phone,
          payload.otp,
          payload.role,
          payload.name,
          payload.language,
        );
        setUser(profile);
      },
      logout: () => {
        authService.logout();
        setUser(null);
      },
      refreshUser: () => setUser(authService.currentUser()),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
