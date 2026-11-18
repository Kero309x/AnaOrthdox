import { ApiResponse, HealthStatusResponse, BibleBookSummary } from "@ana-orthodox/shared-types";

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  fetchFn?: typeof fetch;
}

export class AnaOrthodoxApiClient {
  private readonly baseUrl: string;
  private readonly getAccessToken?: () => string | null | Promise<string | null>;
  private readonly fetch: typeof fetch;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.getAccessToken = config.getAccessToken;
    this.fetch =
      config.fetchFn || (typeof window !== "undefined" ? window.fetch.bind(window) : fetch);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": "ar",
      ...(options.headers as Record<string, string>),
    };

    if (this.getAccessToken) {
      const token = await this.getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      const response = await this.fetch(url, { ...options, headers });
      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (err) {
      return {
        success: false,
        error: {
          code: "ANA-CLIENT-NETWORK",
          message: err instanceof Error ? err.message : "Network failure or API unreachable",
          timestamp: new Date().toISOString(),
          path: endpoint,
        },
      };
    }
  }

  /**
   * Check backend service health and connectivity
   */
  async getHealth(): Promise<ApiResponse<HealthStatusResponse>> {
    return this.request<HealthStatusResponse>("/api/v1/health");
  }

  /**
   * Fetch canonical Bible book listings
   */
  async getBibleBooks(): Promise<ApiResponse<BibleBookSummary[]>> {
    return this.request<BibleBookSummary[]>("/api/v1/bible/books");
  }
}
