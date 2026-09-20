import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/authService";

import {
  clearToken,
  getToken,
  saveToken,
} from "../utils/auth";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      
const response =
  await authService.getCurrentUser();
      setUser(response.data);

      return response.data;
    } catch (error) {
      clearToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((token, userData) => {
    saveToken(token);
    setUser(userData || null);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    window.location.replace("/login");
  }, []);

  useEffect(() => {
    refreshUser().catch(() => {
      // Already handled inside refreshUser.
    });
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user && getToken()),
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}