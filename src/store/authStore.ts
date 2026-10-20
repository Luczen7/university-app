import { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockDatabase';

const AUTH_STORAGE_KEY = 'ustp_auth_session_v2';

interface StoredSession {
  userId: string;
  role: UserRole;
}

export function useAuthSession() {
  const [session, setSession] = useState<StoredSession | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Erreur stockage session:', e);
    }
  }, [session]);

  const login = (user: User): boolean => {
    setSession({
      userId: user.id,
      role: user.role,
    });
    return true;
  };

  const logout = () => {
    setSession(null);
  };

  return {
    session,
    isAuthenticated: !!session,
    currentAuthUserId: session?.userId || null,
    currentAuthRole: session?.role || null,
    login,
    logout,
  };
}
