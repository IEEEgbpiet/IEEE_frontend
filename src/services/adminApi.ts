export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export const buildApiUrl = (endpoint: string) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!API_BASE_URL) {
    return normalizedEndpoint;
  }

  return `${API_BASE_URL}${normalizedEndpoint}`;
};

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem('ieee_admin_token') ?? '';
};

async function requestJson<T>(endpoint: string, options: RequestInit = {}, skipAuth = false): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  const hasBody = typeof options.body !== 'undefined';

  if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('auth-token', token);
    }
  }

  const response = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("API returned non-JSON response:", text);
  }

  if (!response.ok) {
    console.error(`API Error ${response.status}:`, text);
    const message = payload?.message ?? payload?.msg ?? `Request failed (${response.status}: ${response.statusText})`;
    throw new Error(message);
  }

  return payload as T;
}

export const adminApi = {
  login: async ({ email, password }: { email: string; password: string }) =>
    requestJson<{ success: boolean; msg?: string; message?: string; token?: string; user?: { id: string; email: string } }>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      true,
    ),

  logout: async () =>
    requestJson<{ success: boolean; message?: string }>('/api/v1/auth/logout', {
      method: 'POST',
    }, true),

  getDashboardDepartmentCounts: () =>
    requestJson<{ success: boolean; data: Record<string, number> }>('/api/v1/dashboard/departmentposts/getall'),

  getDashboardEvents: () =>
    requestJson<{ success: boolean; data: Array<{ eventName: string; lastDate: string }> }>('/api/v1/dashboard/events/getall'),

  getDashboardSupportSummary: () =>
    requestJson<{ success: boolean; data: Record<string, number> }>('/api/v1/dashboard/contactus/getall'),

  getDashboardCertificateSummary: () =>
    requestJson<{ success: boolean; data: Record<string, number> }>('/api/v1/dashboard/certificates/getall'),

  getCertificateApplications: () =>
    requestJson<{ success: boolean; count?: number; data?: Array<Record<string, unknown>> }>('/api/v1/certificate/all'),

  approveCertificate: (id: string) =>
    requestJson<{ success: boolean; message: string; data?: Record<string, unknown>; email?: { messageId?: string } }>(
      `/api/v1/certificate/approved/${id}`,
      { method: 'PATCH' },
    ),

  rejectCertificate: (id: string) =>
    requestJson<{ success: boolean; message: string; data?: Record<string, unknown> }>(`/api/v1/certificate/rejected/${id}`, {
      method: 'PATCH',
    }),

  createManualCertificate: (payload: Record<string, unknown>) =>
    requestJson<{ success: boolean; message: string; data?: Record<string, unknown>; email?: { messageId?: string } }>(
      '/api/v1/certificate/adminApply',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),

  getSupportTickets: () =>
    requestJson<{ success: boolean; count?: number; tickets?: Array<Record<string, unknown>> }>('/api/v1/support/allticket'),

  closeSupportTicket: (id: string) =>
    requestJson<{ success: boolean; message: string; ticket?: Record<string, unknown> }>(`/api/v1/support/closeTicket/${id}`, {
      method: 'PATCH',
    }),

  rejectSupportTicket: (id: string) =>
    requestJson<{ success: boolean; message: string; ticket?: Record<string, unknown> }>(`/api/v1/support/Reject/${id}`, {
      method: 'PATCH',
    }),

  getUpcomingEvents: () =>
    requestJson<{ success: boolean; count?: number; posts?: Array<Record<string, unknown>> }>('/api/v1/upcomingevents/all'),

  getUpcomingEventById: (id: string) =>
    requestJson<{ success: boolean; post?: Record<string, unknown> }>(`/api/v1/upcomingevents/post/${id}`),

  createUpcomingEvent: (formData: FormData) =>
    requestJson<{ success: boolean; message: string; post?: Record<string, unknown> }>('/api/v1/upcomingevents/create', {
      method: 'POST',
      body: formData,
    }),

  updateUpcomingEvent: (id: string, formData: FormData | Record<string, unknown>) =>
    requestJson<{ success: boolean; message: string; post?: Record<string, unknown> }>(`/api/v1/upcomingevents/edit/${id}`, {
      method: 'PATCH',
      body: formData instanceof FormData ? formData : JSON.stringify(formData),
    }),

  deleteUpcomingEvent: (id: string) =>
    requestJson<{ success: boolean; message: string }>(`/api/v1/upcomingevents/delete/${id}`, {
      method: 'DELETE',
    }),

  getDepartmentPosts: (dep?: string) => {
    const query = dep ? `?dep=${encodeURIComponent(dep)}` : '';
    return requestJson<{ success: boolean; count?: number; posts?: Array<Record<string, unknown>> }>(`/api/v1/department/all${query}`);
  },

  getDepartmentPostById: (id: string) =>
    requestJson<{ success: boolean; post?: Record<string, unknown> }>(`/api/v1/department/post/${id}`),

  createDepartmentPost: (formData: FormData) =>
    requestJson<{ success: boolean; message: string; post?: Record<string, unknown> }>('/api/v1/department/create', {
      method: 'POST',
      body: formData,
    }),

  updateDepartmentPost: (id: string, formData: FormData | Record<string, unknown>) =>
    requestJson<{ success: boolean; message: string; post?: Record<string, unknown> }>(`/api/v1/department/edit/${id}`, {
      method: 'PATCH',
      body: formData instanceof FormData ? formData : JSON.stringify(formData),
    }),

  deleteDepartmentPost: (id: string) =>
    requestJson<{ success: boolean; message: string }>(`/api/v1/department/delete/${id}`, {
      method: 'DELETE',
    }),
};
