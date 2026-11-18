"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  UserProfileDto,
  UserSessionDto,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateProfileDto,
} from "@ana-orthodox/shared-types";
import { apiClient } from "../lib/api-client";

interface AuthContextType {
  user: UserProfileDto | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  sessions: UserSessionDto[];
  login: (credentials: LoginRequestDto) => Promise<void>;
  register: (data: RegisterRequestDto) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateProfile: (dto: UpdateProfileDto) => Promise<void>;
  refreshSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshSessions = useCallback(async () => {
    try {
      const list = await apiClient.getSessions();
      setSessions(list);
    } catch {
      // Non-fatal if session listing fails
    }
  }, []);

  // Silent session restore on initial page load using HttpOnly refresh cookie
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const result = await apiClient.refresh();
        if (isMounted) {
          setUser(result.user);
          setAccessToken(result.accessToken);
          apiClient
            .getSessions()
            .then((s) => isMounted && setSessions(s))
            .catch(() => {});
        }
      } catch {
        // Unauthenticated or expired refresh cookie — expected for guests
        if (isMounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginRequestDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.login(credentials);
      setUser(result.user);
      setAccessToken(result.accessToken);
      await refreshSessions();
    } catch (err: any) {
      setError(err?.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequestDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.register(data);
      setUser(result.user);
      setAccessToken(result.accessToken);
      await refreshSessions();
    } catch (err: any) {
      setError(err?.message || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
    } catch {
      // Ignored
    } finally {
      setUser(null);
      setAccessToken(null);
      setSessions([]);
      setIsLoading(false);
    }
  };

  const logoutAll = async () => {
    setIsLoading(true);
    try {
      await apiClient.logoutAll();
    } catch {
      // Ignored
    } finally {
      setUser(null);
      setAccessToken(null);
      setSessions([]);
      setIsLoading(false);
    }
  };

  const updateProfile = async (dto: UpdateProfileDto) => {
    setError(null);
    try {
      const updated = await apiClient.updateProfile(dto);
      setUser(updated);
    } catch (err: any) {
      setError(err?.message || "فشل تحديث البيانات الشخصية.");
      throw err;
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await apiClient.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err: any) {
      setError(err?.message || "فشل إنهاء الجلسة.");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        error,
        sessions,
        login,
        register,
        logout,
        logoutAll,
        updateProfile,
        refreshSessions,
        revokeSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
