import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const roleRedirects: Record<string, string> = {
  USER: "/faq",
  RESOLVER: "/resolve",
  ADMIN: "/admin",
};

/** Mirrors backend safeUser() — fields returned from /api/auth/me */
export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  status: string;
}

export const getRoleRedirect = (role: string): string =>
  roleRedirects[role] || "/login";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (creds: { email: string; password: string }) => Promise<AuthUser | null>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const request = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: "Unexpected server response",
  }));

  if (!response.ok) throw payload;
  return payload as { success: boolean; user?: AuthUser };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const payload = await request("/api/auth/me");
      const authUser = payload.user ?? null;
      setUser(authUser);
      return authUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(
    async (creds: { email: string; password: string }) => {
      const payload = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(creds),
      });
      const authUser = payload.user ?? null;
      setUser(authUser);
      return authUser;
    },
    []
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      const response = await request("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response.user ?? null;
    },
    []
  );

  const logout = useCallback(async () => {
    await request("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshSession,
    }),
    [loading, login, logout, refreshSession, register, user]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};