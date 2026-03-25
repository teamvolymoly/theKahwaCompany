"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "@/utils/api";

const AuthContext = createContext(null);

const extractToken = (payload) =>
  payload?.token ||
  payload?.access_token ||
  payload?.data?.token ||
  payload?.data?.access_token;

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  const setToken = (nextToken) => {
    if (nextToken) {
      localStorage.setItem("auth_token", nextToken);
      setTokenState(nextToken);
    } else {
      localStorage.removeItem("auth_token");
      setTokenState(null);
    }
  };

  const reloadUser = useCallback(async () => {
    const stored = localStorage.getItem("auth_token");
    setTokenState(stored || null);
    if (!stored) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const data =
        (await apiFetch("/api/auth/me")) ??
        (await apiFetch("/api/users/me"));
      setUser(data || null);
      setLoading(false);
      return data;
    } catch (err) {
      if (err?.message === "TOKEN_EXPIRED") {
        setToken(null);
      }
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    reloadUser();
    const handleStorage = () => reloadUser();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [reloadUser]);

  const login = async ({ email, password }) => {
    setAuthLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const nextToken = extractToken(res);
      if (!nextToken) {
        setAuthLoading(false);
        setError("Login succeeded but no token was returned.");
        return { ok: false };
      }
      setToken(nextToken);
      await reloadUser();
      setAuthLoading(false);
      return { ok: true, data: res };
    } catch (err) {
      setAuthLoading(false);
      setError(err?.message || "Login failed");
      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      // ignore logout failure
    }
    setUser(null);
    setToken(null);
    setAuthLoading(false);
  };

  const refresh = async () => {
    setAuthLoading(true);
    try {
      const res = await apiFetch("/api/auth/refresh", { method: "POST" });
      const nextToken = extractToken(res);
      if (nextToken) setToken(nextToken);
      setAuthLoading(false);
      return { ok: true, data: res };
    } catch (err) {
      setAuthLoading(false);
      return { ok: false, error: err };
    }
  };

  const hasRole = (roleName) => user?.roles?.includes(roleName);
  const hasAnyRole = (...roleNames) =>
    user?.roles?.some((r) => roleNames.includes(r));

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authLoading,
      error,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refresh,
      reloadUser,
      setToken,
      hasRole,
      hasAnyRole,
    }),
    [user, token, loading, authLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return ctx;
}
