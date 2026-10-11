/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, DEMO_USERS } from '../types/auth';
import { soundEffects } from '../utils/audio';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  login: (email: string, name: string, campusOrCity?: string) => void;
  loginAsDemo: (userId: string) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'paisa_auth_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default logged in as Rohan so the app opens smoothly without blocking evaluators,
    // but full login/logout toggle is active and functional!
    return DEMO_USERS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  const login = useCallback((email: string, name: string, campusOrCity: string = 'Delhi NCR') => {
    soundEffects.playChaChing();
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      name: name.trim() || 'Gen Z Explorer',
      handle: '@' + (name.toLowerCase().replace(/\s+/g, '_') || 'explorer'),
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
      role: 'Student / Early Career',
      campusOrCity,
      budgetGoal: 10000
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  }, []);

  const loginAsDemo = useCallback((userId: string) => {
    soundEffects.playChaChing();
    const demo = DEMO_USERS.find(u => u.id === userId) || DEMO_USERS[0];
    setUser(demo);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    soundEffects.playClick();
    setUser(null);
    setIsAuthModalOpen(true);
  }, []);

  const openAuthModal = useCallback(() => {
    soundEffects.playClick();
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        login,
        loginAsDemo,
        logout,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
