/**
 * Ana Orthodox — Shared Domain Contracts and Standard Envelopes
 */

// ===== API ENVELOPES =====
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    page?: number;
    limit?: number;
    total?: number;
    version?: string;
  };
}

export interface ApiErrorDetail {
  field?: string;
  issue: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    timestamp: string;
    path?: string;
    traceId?: string;
  };
  data?: any;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ===== HEALTH CHECK =====
export interface HealthStatusResponse {
  status: "ok" | "degraded" | "error";
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
  services: {
    database: "connected" | "disconnected";
    redis: "connected" | "disconnected";
  };
  details?: {
    databaseStatusMessage?: string;
    redisStatusMessage?: string;
  };
}

export interface LivenessResponse {
  status: "alive";
  uptime: number;
  timestamp: string;
  pid: number;
}

export interface DependencyStatus {
  status: "up" | "down";
  message: string;
  latencyMs?: number;
}

export interface ReadinessResponse {
  status: "ready" | "degraded" | "unready";
  ready: boolean;
  timestamp: string;
  checks: {
    database: DependencyStatus;
    redis: DependencyStatus;
  };
}

// ===== USER & AUTH =====
export type UserRole = "ANONYMOUS" | "USER" | "EDITOR" | "ADMINISTRATOR";

export interface UserPreferencesDto {
  preferredTheme: string;
  fontSize: number;
  tashkeelEnabled: boolean;
  copticScript: boolean;
  preferredBibleId?: string | null;
}

export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  preferences: UserPreferencesDto;
}

export interface AuthSuccessDto {
  accessToken: string;
  expiresIn: number; // in seconds
  user: UserProfileDto;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  preferredTheme?: string;
  fontSize?: number;
  tashkeelEnabled?: boolean;
  copticScript?: boolean;
  preferredBibleId?: string | null;
}

export interface UserSessionDto {
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  sessionId: string;
  iat?: number;
  exp?: number;
}

// Backward-compatible alias for existing code
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

// ===== LITURGICAL & BIBLE DOMAINS =====
export interface BibleBookSummary {
  id: string;
  code: string;
  nameArabic: string;
  nameEnglish: string;
  testament: "OLD" | "NEW";
  order: number;
  chapterCount: number;
  isStructuralSample?: boolean;
}

// ===== COPTIC CALENDAR DOMAIN =====
export interface CopticDateDto {
  year: number;
  month: number;
  monthCode: string;
  monthNameAr: string;
  monthNameEn: string;
  day: number;
  dayOfYear: number;
  isLeapYear: boolean;
}

export interface GregorianDateDto {
  iso: string; // YYYY-MM-DD
  year: number;
  month: number;
  day: number;
}

export interface CalendarConversionResponseDto {
  coptic: CopticDateDto;
  gregorian: GregorianDateDto;
  formatted: {
    ar: string;
    en: string;
  };
}

export interface LiturgicalDaySummary {
  gregorianDate: string;
  copticDate: {
    day: number;
    month: number;
    monthNameArabic: string;
    year: number;
  };
  fastingStatus: string;
  commemorationsCount: number;
}

// ===== CONTENT PROVENANCE & DATA TRUST =====
export type SourceClass =
  | "OFFICIAL_CHURCH"
  | "OFFICIAL_DIOCESE"
  | "ECCLESIASTICAL_PUBLICATION"
  | "RIGHTS_HOLDER"
  | "ACADEMIC_REFERENCE"
  | "HISTORICAL_PRIMARY_SOURCE"
  | "TECHNICAL_REFERENCE"
  | "SECONDARY_REFERENCE"
  | "UNVERIFIED_THIRD_PARTY";

export type PublicationStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "VERIFIED"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED"
  | "BLOCKED"
  | "ARCHIVED";

export interface SourceRecordDto {
  id: string;
  institution: string;
  officialUrl: string;
  category: SourceClass;
  title: string;
  edition: string;
  publicationDate?: string;
  language: string;
  copyrightOwner: string;
  licenseStatus: string;
  referenceLocation: string;
  dateRetrieved: string;
  verificationStatus: "VERIFIED" | "PENDING" | "UNVERIFIED";
  reviewer: string;
  reviewDate: string;
  checksum?: string;
  notes?: string;
}

export interface ContentProvenanceMetadataDto {
  contentId: string;
  contentType: string;
  sourceIds: string[];
  edition: string;
  exactReference: string;
  language: string;
  publicationRightsStatus: "PUBLIC_DOMAIN" | "LICENSED" | "RESTRICTED" | "BLOCKED";
  verificationState: PublicationStatus;
  editorialReviewer: string;
  ecclesiasticalApprovalState: "APPROVED" | "PENDING" | "NOT_REQUIRED" | "REJECTED";
  lastReviewDate: string;
  checksum?: string;
}
