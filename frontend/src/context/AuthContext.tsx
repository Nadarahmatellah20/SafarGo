import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, type User } from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  useEffect(() => {
    if (token) {
      authApi
        .getUser()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const adminLogin = async (email: string, password: string) => {
    const res = await authApi.adminLogin(email, password);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (payload: Parameters<typeof authApi.register>[0]) => {
    const res = await authApi.register(payload);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const logoutAll = async () => {
    try {
      await authApi.logoutAll();
    } catch (_) {}
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const u = await authApi.getUser();
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuth: !!user,
        loading,
        login,
        adminLogin,
        register,
        logout,
        logoutAll,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
