import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'advocate' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS: Record<string, User & { password: string }> = {
  'user@lexora.ai': { id: '1', name: 'Rahul Sharma', email: 'user@lexora.ai', role: 'user', password: 'user123' },
  'advocate@lexora.ai': { id: '2', name: 'Adv. Priya Nair', email: 'advocate@lexora.ai', role: 'advocate', password: 'advocate123' },
  'admin@lexora.ai': { id: '3', name: 'Admin Kumar', email: 'admin@lexora.ai', role: 'admin', password: 'admin123' },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    const found = DEMO_USERS[email.toLowerCase()];
    if (found && found.password === password && found.role === role) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
