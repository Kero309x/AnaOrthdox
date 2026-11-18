import {
  AuthSuccessDto,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateProfileDto,
  UserProfileDto,
  UserSessionDto,
} from "@ana-orthodox/shared-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

class ApiClient {
  private accessToken: string | null = null;
  private refreshPromise: Promise<AuthSuccessDto> | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});

    headers.set("Content-Type", "application/json");
    if (this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Required for HttpOnly refresh cookie
    });

    // Automatic token refresh on 401 for authenticated application routes
    if (
      res.status === 401 &&
      !isRetry &&
      !endpoint.startsWith("/auth/login") &&
      !endpoint.startsWith("/auth/register") &&
      !endpoint.startsWith("/auth/refresh") &&
      !endpoint.startsWith("/auth/logout")
    ) {
      try {
        const refreshed = await this.refresh();
        headers.set("Authorization", `Bearer ${refreshed.accessToken}`);
        return this.request<T>(endpoint, { ...options, headers }, true);
      } catch (refreshErr) {
        this.setAccessToken(null);
        throw refreshErr;
      }
    }

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        body?.error?.message ||
        body?.message ||
        (Array.isArray(body?.errors) ? body.errors.join(", ") : null) ||
        `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    return (body.data !== undefined ? body.data : body) as T;
  }

  async register(dto: RegisterRequestDto): Promise<AuthSuccessDto> {
    const result = await this.request<AuthSuccessDto>("/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    this.setAccessToken(result.accessToken);
    return result;
  }

  async login(dto: LoginRequestDto): Promise<AuthSuccessDto> {
    const result = await this.request<AuthSuccessDto>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    this.setAccessToken(result.accessToken);
    return result;
  }

  async refresh(): Promise<AuthSuccessDto> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.request<AuthSuccessDto>("/auth/refresh", {
      method: "POST",
    })
      .then((result) => {
        this.setAccessToken(result.accessToken);
        return result;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      const result = await this.request<{ success: boolean }>("/auth/logout", {
        method: "POST",
      });
      return result;
    } finally {
      this.setAccessToken(null);
    }
  }

  async logoutAll(): Promise<{ success: boolean }> {
    try {
      const result = await this.request<{ success: boolean }>("/auth/logout-all", {
        method: "POST",
      });
      return result;
    } finally {
      this.setAccessToken(null);
    }
  }

  async getMe(): Promise<UserProfileDto> {
    return this.request<UserProfileDto>("/auth/me");
  }

  async updateProfile(dto: UpdateProfileDto): Promise<UserProfileDto> {
    return this.request<UserProfileDto>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
  }

  async getSessions(): Promise<UserSessionDto[]> {
    return this.request<UserSessionDto[]>("/auth/sessions");
  }

  async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/auth/sessions/${sessionId}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
