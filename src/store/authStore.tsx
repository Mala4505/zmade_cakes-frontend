import React, { useEffect, useState, createContext, useContext } from 'react';
import { authApi } from '../services/api';
import { env } from '../config/env';

interface User {
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

interface AuthContextType extends AuthState {
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null
  });
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem(env.TOKEN_KEY);
    const userStr = localStorage.getItem(`${env.TOKEN_KEY}_user`);

    if (token && userStr) {
      try {
        setState({
          isAuthenticated: true,
          token,
          user: JSON.parse(userStr)
        });
      } catch (e) {
        logout();
      }
    } else {
      setState({
        isAuthenticated: false,
        token: null,
        user: null
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const data = await authApi.login(username, password);
      setState({
        isAuthenticated: true,
        token: data.access,
        user: { username: data.username }
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setState({
      isAuthenticated: false,
      token: null,
      user: null
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loading,
        login,
        logout,
        checkAuth
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
