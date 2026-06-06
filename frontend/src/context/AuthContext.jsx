import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth as authApi } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("eventku_token");
    const cached = localStorage.getItem("eventku_user");
    if (token && cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  const persist = useCallback((token, u) => {
    localStorage.setItem("eventku_token", token);
    localStorage.setItem("eventku_user", JSON.stringify(u));
    setUser(u);
  }, []);

  const login = useCallback(
    async (payload) => {
      const res = await authApi.login(payload);
      persist(res.token, res.data);
      return res.data;
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      const res = await authApi.register(payload);
      persist(res.token, res.data);
      return res.data;
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("eventku_token");
    localStorage.removeItem("eventku_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus di dalam AuthProvider");
  return ctx;
}
