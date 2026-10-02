import { API_BASE_URL, buildApiUrl } from '@/config/api';

export { API_BASE_URL, buildApiUrl };

// ==========================================
// Cookie Auth Helpers
// ==========================================

export const COOKIE_TOKEN_KEY = 'Token';

export const getCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : '';
};

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
};

export const getStoredToken = (): string => {
  if (typeof document === 'undefined') return '';
  // Check cookie (Token per backend Set-Cookie or lowercase token)
  const token = getCookie(COOKIE_TOKEN_KEY) || getCookie('token');
  return token ? token.trim() : '';
};

export const storeTokenCookie = (token: string) => {
  setCookie(COOKIE_TOKEN_KEY, token, 7);
  setCookie('token', token, 7);
};

export const removeTokenCookie = () => {
  deleteCookie(COOKIE_TOKEN_KEY);
  deleteCookie('token');
};

// ==========================================
// Base Request Handler
// ==========================================

export async function requestJson<T>(endpoint: string, options: RequestInit = {}, skipAuth = false): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  const hasBody = typeof options.body !== 'undefined';

  if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('x-access-token', token);
      headers.set('auth-token', token);
    }
  }

  const response = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });

  const text = await response.text();
  let payload: Record<string, unknown> | null = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    console.error("API returned non-JSON response:", text);
  }

  if (!response.ok) {
    console.error(`API Error ${response.status}:`, text);
    const message =
      (payload?.message as string | undefined) ??
      (payload?.msg as string | undefined) ??
      `Request failed (${response.status}: ${response.statusText})`;
    throw new Error(message);
  }

  return payload as unknown as T;
}

// ==========================================
// TypeScript Interfaces (per Apis.pdf)
// ==========================================

export interface UpcomingEventImage {
  url: string;
  publicId?: string;
}

export interface UpcomingEvent {
  [key: string]: unknown;
  _id?: string;
  id?: string;
  postId: string;
  eventName: string;
  title: string;
  date: string;
  lastDate: string;
  venue?: string;
  overview: string;
  image?: UpcomingEventImage | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpcomingEventsResponse {
  success: boolean;
  count?: number;
  posts: UpcomingEvent[];
}

export interface DepartmentPostImage {
  url: string;
  publicId?: string;
}

export interface DepartmentPost {
  [key: string]: unknown;
  _id?: string;
  id?: string;
  postId?: string;
  title: string;
  category: string;
  branch: string;
  date: string;
  time?: string;
  venue: string;
  organizedBy: string;
  reportAuthor?: string;
  overview: string;
  description: string;
  keyDiscussion?: string[] | string;
  studentsPresent?: string[] | string;
  image?: DepartmentPostImage | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificateApplication {
  [key: string]: unknown;
  _id?: string;
  certificateId?: string;
  name: string;
  email: string;
  branch: string;
  eventName?: string;
  event?: string;
  date: string;
  position?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportTicket {
  [key: string]: unknown;
  _id: string;
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  description?: string;
  message?: string;
  solvedStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// Admin API Methods
// ==========================================

export const adminApi = {
  // 1. Auth & OTP
  login: async ({ email, password }: { email: string; password: string }) =>
    requestJson<{
      success: boolean;
      msg?: string;
      message?: string;
      token?: string;
      user?: { id: string; email: string };
    }>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      true,
    ),

  logout: async () =>
    requestJson<{ success: boolean; message?: string }>(
      '/api/v1/auth/logout',
      {
        method: 'POST',
      },
      true,
    ),

  // 2. Dashboard Analytics
  getDashboardDepartmentCounts: () =>
    requestJson<{ success: boolean; data: Record<string, number> }>(
      '/api/v1/dashboard/departmentposts/getall',
    ),

  getDashboardEvents: () =>
    requestJson<{ success: boolean; data: Array<{ eventName: string; lastDate: string }> }>(
      '/api/v1/dashboard/events/getall',
    ),

  getDashboardSupportSummary: () =>
    requestJson<{ success: boolean; data: Record<string, number> }>(
      '/api/v1/dashboard/contactus/getall',
    ),

  getDashboardCertificateSummary: () =>
    requestJson<{ success: boolean; data: Record<string, number> }>(
      '/api/v1/dashboard/certificates/getall',
    ),

  // 3. Certificates
  getCertificateApplications: () =>
    requestJson<{ success: boolean; count?: number; data?: CertificateApplication[] }>(
      '/api/v1/certificate/all',
    ),

  approveCertificate: (id: string) =>
    requestJson<{
      success: boolean;
      message: string;
      data?: CertificateApplication;
      email?: { messageId?: string };
    }>(`/api/v1/certificate/approved/${id}`, { method: 'PATCH' }),

  rejectCertificate: (id: string) =>
    requestJson<{ success: boolean; message: string; data?: CertificateApplication }>(
      `/api/v1/certificate/rejected/${id}`,
      {
        method: 'PATCH',
      },
    ),

  createManualCertificate: (payload: Record<string, unknown>) =>
    requestJson<{
      success: boolean;
      message: string;
      data?: CertificateApplication;
      email?: { messageId?: string };
    }>('/api/v1/certificate/adminApply', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // 4. Support Tickets
  getSupportTickets: () =>
    requestJson<{ success: boolean; count?: number; tickets?: SupportTicket[] }>(
      '/api/v1/support/allticket',
    ),

  closeSupportTicket: (id: string) =>
    requestJson<{ success: boolean; message: string; ticket?: SupportTicket }>(
      `/api/v1/support/closeTicket/${id}`,
      {
        method: 'PATCH',
      },
    ),

  rejectSupportTicket: (id: string) =>
    requestJson<{ success: boolean; message: string; ticket?: SupportTicket }>(
      `/api/v1/support/Reject/${id}`,
      {
        method: 'PATCH',
      },
    ),

  // 5. Upcoming Events Module (Direct MongoDB Integration per Apis.pdf)
  getUpcomingEvents: () =>
    requestJson<UpcomingEventsResponse>('/api/v1/upcomingevents/all', {}, true),

  getUpcomingEventById: (id: string) =>
    requestJson<{ success: boolean; post?: UpcomingEvent }>(
      `/api/v1/upcomingevents/post/${id}`,
      {},
      true,
    ),

  createUpcomingEvent: (formData: FormData) =>
    requestJson<{ success: boolean; message: string; post?: UpcomingEvent }>(
      '/api/v1/upcomingevents/create',
      {
        method: 'POST',
        body: formData,
      },
    ),

  updateUpcomingEvent: (id: string, formData: FormData | Record<string, unknown>) =>
    requestJson<{ success: boolean; message: string; post?: Partial<UpcomingEvent> }>(
      `/api/v1/upcomingevents/edit/${id}`,
      {
        method: 'PATCH',
        body: formData instanceof FormData ? formData : JSON.stringify(formData),
      },
    ),

  deleteUpcomingEvent: (id: string) =>
    requestJson<{ success: boolean; message: string }>(
      `/api/v1/upcomingevents/delete/${id}`,
      {
        method: 'DELETE',
      },
    ),

  // 6. Department Posts
  getDepartmentPosts: (dep?: string) => {
    const query = dep ? `?dep=${encodeURIComponent(dep)}` : '';
    return requestJson<{
      success: boolean;
      count?: number;
      posts?: DepartmentPost[];
    }>(`/api/v1/department/all${query}`, {}, true);
  },

  getDepartmentPostById: (id: string) =>
    requestJson<{ success: boolean; post?: DepartmentPost }>(
      `/api/v1/department/post/${id}`,
      {},
      true,
    ),

  createDepartmentPost: (formData: FormData) =>
    requestJson<{ success: boolean; message: string; post?: DepartmentPost }>(
      '/api/v1/department/create',
      {
        method: 'POST',
        body: formData,
      },
    ),

  updateDepartmentPost: (id: string, formData: FormData | Record<string, unknown>) =>
    requestJson<{ success: boolean; message: string; post?: DepartmentPost }>(
      `/api/v1/department/edit/${id}`,
      {
        method: 'PATCH',
        body: formData instanceof FormData ? formData : JSON.stringify(formData),
      },
    ),

  deleteDepartmentPost: (id: string) =>
    requestJson<{ success: boolean; message: string }>(`/api/v1/department/delete/${id}`, {
      method: 'DELETE',
    }),
};

export const api = adminApi;
export default adminApi;
