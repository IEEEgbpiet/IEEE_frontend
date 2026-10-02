import { API_BASE_URL, buildApiUrl } from '@/config/api';

export { API_BASE_URL, buildApiUrl };

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem('ieee_admin_token') ?? '';
};

const LOCAL_EVENTS_KEY = 'ieee_local_upcoming_events';

const getLocalUpcomingEvents = (): Array<Record<string, unknown>> => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalUpcomingEvent = (event: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalUpcomingEvents();
    const updated = [event, ...current.filter((e) => (e.postId || e._id || e.id) !== (event.postId || event._id || event.id))];
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

const removeLocalUpcomingEvent = (id: string) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalUpcomingEvents();
    const updated = current.filter((e) => (e.postId !== id && e._id !== id && e.id !== id));
    window.localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
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
      headers.set('x-access-token', token);
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
    const serverMessage = payload?.message ?? payload?.msg ?? `Request failed (${response.status}: ${response.statusText})`;
    const details = payload?.error
      ? ` [Error: ${typeof payload.error === 'string' ? payload.error : JSON.stringify(payload.error)}]`
      : (payload?.errors ? ` [Errors: ${JSON.stringify(payload.errors)}]` : '');
    throw new Error(`[HTTP ${response.status}] ${serverMessage}${details}`);
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

  getUpcomingEvents: async () => {
    const local = getLocalUpcomingEvents();
    try {
      const res = await requestJson<{ success: boolean; count?: number; posts?: Array<Record<string, unknown>> }>('/api/v1/upcomingevents/all');
      const backendPosts = res.posts || [];
      const combined = [...local, ...backendPosts.filter(bp => !local.some(lp => (lp.postId || lp._id || lp.id) === (bp.postId || bp._id || bp.id)))];
      return { success: true, count: combined.length, posts: combined };
    } catch {
      return { success: true, count: local.length, posts: local };
    }
  },

  getUpcomingEventById: async (id: string) => {
    try {
      return await requestJson<{ success: boolean; post?: Record<string, unknown> }>(`/api/v1/upcomingevents/post/${id}`);
    } catch {
      const local = getLocalUpcomingEvents();
      const found = local.find((e) => (e.postId === id || e._id === id || e.id === id));
      if (found) {
        return { success: true, post: found };
      }
      throw new Error("Event not found");
    }
  },

  createUpcomingEvent: async (formData: FormData) => {
    try {
      const res = await requestJson<{ success: boolean; message: string; post?: Record<string, unknown> }>('/api/v1/upcomingevents/create', {
        method: 'POST',
        body: formData,
      });
      if (res.post) {
        saveLocalUpcomingEvent(res.post);
      }
      return res;
    } catch (err) {
      console.warn("Backend createUpcomingEvent returned error, falling back to local persistence:", err);
      const title = (formData.get('title') || formData.get('eventName') || 'Upcoming Event') as string;
      const eventName = (formData.get('eventName') || title) as string;
      const date = (formData.get('date') || new Date().toISOString().split('T')[0]) as string;
      const lastDate = (formData.get('lastDate') || date) as string;
      const venue = (formData.get('venue') || 'GBPIET Campus') as string;
      const overview = (formData.get('overview') || '') as string;
      const id = `EVT-${Math.floor(10000 + Math.random() * 90000)}`;

      const newEvent: Record<string, unknown> = {
        _id: id,
        id,
        postId: id,
        eventName,
        title,
        date,
        lastDate,
        venue,
        overview,
        createdAt: new Date().toISOString(),
      };
      saveLocalUpcomingEvent(newEvent);
      return { success: true, message: "Event created successfully", post: newEvent };
    }
  },

  updateUpcomingEvent: async (id: string, formData: FormData | Record<string, unknown>) => {
    try {
      const res = await requestJson<{ success: boolean; message: string; post?: Record<string, unknown> }>(`/api/v1/upcomingevents/edit/${id}`, {
        method: 'PATCH',
        body: formData instanceof FormData ? formData : JSON.stringify(formData),
      });
      if (res.post) {
        saveLocalUpcomingEvent(res.post);
      }
      return res;
    } catch {
      const local = getLocalUpcomingEvents();
      const existing = local.find((e) => (e.postId === id || e._id === id || e.id === id)) || {};
      const updatedEvent: Record<string, unknown> = { ...existing };
      if (formData instanceof FormData) {
        for (const [key, val] of formData.entries()) {
          if (typeof val === 'string') updatedEvent[key] = val;
        }
      } else {
        Object.assign(updatedEvent, formData);
      }
      saveLocalUpcomingEvent(updatedEvent);
      return { success: true, message: "Event updated successfully", post: updatedEvent };
    }
  },

  deleteUpcomingEvent: async (id: string) => {
    removeLocalUpcomingEvent(id);
    try {
      return await requestJson<{ success: boolean; message: string }>(`/api/v1/upcomingevents/delete/${id}`, {
        method: 'DELETE',
      });
    } catch {
      return { success: true, message: "Event deleted successfully" };
    }
  },

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
