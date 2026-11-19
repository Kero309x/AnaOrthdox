/**
 * Integration boundary for authentication. The UI only talks to this interface.
 * Today the only implementation is the DEMO adapter below: it contacts no server,
 * stores no credentials and fabricates no session. Swap `authPort` for a real
 * adapter (same shapes) when the API is connected.
 */
export type AuthErrorCode = "invalid_credentials" | "email_taken" | "network" | "rate_limited" | "token_expired";
export type AuthResult = { ok: true } | { ok: false; code: AuthErrorCode };

/**
 * Contract status, derived from apps/api auth.controller (19 Nov 2026):
 *  - EXISTS: POST /auth/register {email,password,fullName}, POST /auth/login, /auth/refresh,
 *    /auth/logout, /auth/logout-all, GET /auth/me, GET /auth/sessions, DELETE /auth/sessions/:id.
 *  - NOT in the backend yet (provisional shapes, contract unresolved): email verification,
 *    password reset request, password reset with token.
 * Session expiry is surfaced by the UI when a call returns 401 and refresh fails.
 */
export interface DemoSession { id: string; device: string; lastActive: string; isCurrent: boolean }

export interface AuthPort {
  verifyEmail(input: { token: string }): Promise<AuthResult>;
  resetPassword(input: { token: string; password: string }): Promise<AuthResult>;
  listSessions(): Promise<{ ok: true; sessions: DemoSession[] } | { ok: false; code: AuthErrorCode }>;
  revokeSession(input: { id: string }): Promise<AuthResult>;
  logoutAll(): Promise<AuthResult>;
  signIn(input: { email: string; password: string }): Promise<AuthResult>;
  register(input: { name: string; email: string; password: string }): Promise<AuthResult>;
  requestPasswordReset(input: { email: string }): Promise<AuthResult>;
}

export type DemoScenario = "ok" | "slow" | "invalid" | "network";
export const DEMO_SCENARIOS: Record<DemoScenario, string> = {
  ok: "ينجح",
  slow: "بطيء (٢ ثانية)",
  invalid: "بيانات غلط",
  network: "انقطاع الشبكة",
};

let scenario: DemoScenario = "ok";
export const setDemoScenario = (s: DemoScenario) => { scenario = s; };

async function run(kind: "in" | "up" | "reset"): Promise<AuthResult> {
  if (scenario === "slow") await new Promise((r) => setTimeout(r, 2000));
  if (scenario === "network") return { ok: false, code: "network" };
  if (scenario === "invalid") return { ok: false, code: kind === "up" ? "email_taken" : kind === "in" ? "invalid_credentials" : "rate_limited" };
  return { ok: true };
}

export const authPort: AuthPort = {
  signIn: () => run("in"),
  register: () => run("up"),
  requestPasswordReset: () => run("reset"),
  verifyEmail: async ({ token }) => {
    if (token === "expired") return { ok: false, code: "token_expired" };
    return run("in");
  },
  resetPassword: async ({ token }) => {
    if (token === "expired") return { ok: false, code: "token_expired" };
    return run("in");
  },
  listSessions: async () => {
    const r = await run("in");
    if (!r.ok) return r;
    return { ok: true, sessions: [
      { id: "s1", device: "الجهاز ده (عينة تجريبية)", lastActive: "دلوقتي", isCurrent: true },
      { id: "s2", device: "جهاز تاني (عينة تجريبية)", lastActive: "من ٣ أيام", isCurrent: false },
    ] };
  },
  revokeSession: () => run("in"),
  logoutAll: () => run("in"),
};

export const AUTH_ERRORS: Record<AuthErrorCode, string> = {
  invalid_credentials: "البريد أو كلمة المرور مش مظبوطين. راجعهم وجرّب تاني.",
  email_taken: "البريد ده مستخدم قبل كده. جرّب تسجيل الدخول أو استرجاع كلمة المرور.",
  network: "حصل انقطاع في الاتصال. بياناتك لسه مكتوبة، جرّب تاني.",
  rate_limited: "محاولات كتير. استنى شوية وجرّب تاني.",
  token_expired: "الرابط ده انتهت صلاحيته. اطلب رابط جديد.",
};
