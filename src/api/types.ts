/**
 * TypeScript interfaces for API request/response types
 * Replaces usage of "any" types for compile-time safety
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface SendOTPRequest {
  mobile: string;
  type: string;
}

export interface SendOTPResponse {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface VerifyOTPRequest {
  mobile: string;
  otp: string;
}

export interface User {
  id?: string;
  token?: string;
  mobile?: string;
  name?: string;
  email?: string;
  role_id?: string;
  [key: string]: unknown;
}

export interface VerifyOTPResponse {
  status: boolean;
  message: string;
  user?: User;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ContactSupportItem {
  type: string;
  mobile_number?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ContactSupportResponse {
  status: boolean;
  message: string;
  data?: ContactSupportItem[];
  [key: string]: unknown;
}

// ============================================================================
// POLICY TYPES
// ============================================================================

export interface PolicySearchRequest {
  search: string;
  offset: number;
  limit: number;
  is_pagination_required?: boolean;
}

export interface Policy {
  id?: string;
  policyNumber?: string;
  policyType?: string;
  status?: string;
  premiumAmount?: number;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface PolicyListResponse {
  status: boolean;
  message: string;
  count?: number;
  data?: Policy[];
  total?: number;
  offset?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface PolicyCopyRequest {
  path: string;
}

export interface PolicyCopyResponse {
  status: boolean;
  message: string;
  url?: string;
  temp_url?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

// ============================================================================
// RENEWAL TYPES
// ============================================================================

export interface RenewalSearchRequest {
  search: string;
  offset: number;
  limit: number;
  is_pagination_required?: boolean;
}

export interface Renewal {
  id?: string;
  renewalNumber?: string;
  renewalType?: string;
  status?: string;
  dueDate?: string;
  renewalDate?: string;
  [key: string]: unknown;
}

export interface RenewalListResponse {
  status: boolean;
  message: string;
  count?: number;
  data?: Renewal[];
  total?: number;
  offset?: number;
  limit?: number;
  [key: string]: unknown;
}

// ============================================================================
// ADVISOR TYPES
// ============================================================================

export interface AdvisorSearchRequest {
  search: string;
  offset: number;
  limit: number;
  is_pagination_required?: boolean;
}

export interface Advisor {
  id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  specialization?: string;
  rating?: number;
  [key: string]: unknown;
}

export interface AdvisorListResponse {
  status: boolean;
  message: string;
  count?: number;
  data?: Advisor[];
  total?: number;
  offset?: number;
  limit?: number;
  [key: string]: unknown;
}

// ============================================================================
// RATING TYPES
// ============================================================================

export interface AdvisorRatingResponse {
  status: boolean;
  message: string;
  data?: Rating | Rating[];
  [key: string]: unknown;
}

export interface Rating {
  id?: string;
  advisorId?: string;
  rating?: number;
  review?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface SubmitRatingRequest {
  advisorId?: string;
  rating?: number;
  review?: string;
  [key: string]: unknown;
}

export interface SubmitRatingResponse {
  status: boolean;
  message: string;
  data?: Rating;
  [key: string]: unknown;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardData {
  advisortotal?: number;
  policytotal?: number;
  renewaltotal?: number;
  totalPolicies?: number;
  totalRenewals?: number;
  pendingRenewals?: number;
  upcomingExpiry?: Policy[];
  recentActivity?: Activity[];
  [key: string]: unknown;
}

export interface Activity {
  id?: string;
  type?: string;
  description?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface DashboardDataResponse {
  status: boolean;
  message: string;
  data?: DashboardData;
  [key: string]: unknown;
}

// ============================================================================
// GENERIC API RESPONSE
// ============================================================================

export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  statusCode: number;
  data?: Record<string, unknown>;
}
