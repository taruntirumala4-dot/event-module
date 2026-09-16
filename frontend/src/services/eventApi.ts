import axios from 'axios';
import {
  ApiResponse,
  AuthData,
  CreateEventForm,
  Event,
  EventFilters,
  PaginatedEvents,
  Registration,
  Bookmark,
  StudentRegistration,
} from '../types/event';
import { TECH_EVENTS } from '../data/techEventsData';

const getBaseUrl = (): string => {
  let url = (import.meta.env.VITE_API_URL || '').trim();

  // If the variable contains placeholder text like "<...>" or "your-render"
  if (
    !url ||
    url.includes('<') ||
    url.includes('>') ||
    url.includes('your-render') ||
    (import.meta.env.PROD && url.includes('localhost'))
  ) {
    return import.meta.env.PROD
      ? 'https://event-moduleevent-module-api.onrender.com/api'
      : 'http://localhost:5000/api';
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url.replace(/\/+$/, '');
    }
  } catch {
    // If URL parsing fails, fall back safely
  }

  return import.meta.env.PROD
    ? 'https://event-moduleevent-module-api.onrender.com/api'
    : 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error extraction with friendly network error message
api.interceptors.response.use(
  (res) => res,
  (error) => {
    let message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';

    if (error?.code === 'ERR_NETWORK' || message.includes('Network Error')) {
      message = 'Backend server is waking up or unreachable. Please wait a few seconds and refresh.';
    }

    return Promise.reject(new Error(message));
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthData>>('/auth/login', data).then((r) => r.data),
  getProfile: () =>
    api.get<ApiResponse<{ id: string; name: string; email: string; role: string }>>('/auth/me').then((r) => r.data),
};
 
// ─── EVENTS ───────────────────────────────────────────────────────────────
export const eventApi = {
  // Public
  getEvents: async (filters?: EventFilters): Promise<ApiResponse<PaginatedEvents>> => {
    try {
      const res = await api.get<ApiResponse<PaginatedEvents>>('/events', { params: filters });
      if (res.data?.data?.events && res.data.data.events.length > 0) {
        return res.data;
      }
    } catch {
      // Fall through to local fallback
    }

    let filtered = [...TECH_EVENTS];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.organizer?.name && e.organizer.name.toLowerCase().includes(q))
      );
    }
    if (filters?.category) {
      filtered = filtered.filter(
        (e) => e.category === filters.category || e.subCategory?.toLowerCase() === (filters.category as string).toLowerCase()
      );
    }
    if (filters?.location) {
      filtered = filtered.filter((e) => e.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters?.mode) {
      filtered = filtered.filter((e) => e.mode === filters.mode);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 24;
    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: {
        events: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  getEventById: async (id: string): Promise<ApiResponse<Event>> => {
    try {
      const res = await api.get<ApiResponse<Event>>(`/events/${id}`);
      if (res.data?.data) return res.data;
    } catch {
      // Fall through to local fallback
    }
    const found = TECH_EVENTS.find((e) => e.id === id) || TECH_EVENTS.find((e) => e.id === 'build-for-bharat') || TECH_EVENTS[0];
    return {
      success: true,
      data: found,
    };
  },

  // Organizer
  createEvent: (data: Partial<CreateEventForm>) =>
    api.post<ApiResponse<Event>>('/events', data).then((r) => r.data),
  updateEvent: (id: string, data: Partial<CreateEventForm>) =>
    api.patch<ApiResponse<Event>>(`/events/${id}`, data).then((r) => r.data),
  deleteEvent: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/events/${id}`).then((r) => r.data),
  getOrganizerEvents: () =>
    api.get<ApiResponse<Event[]>>('/events/organizer/my-events').then((r) => r.data),
  getEventRegistrations: (id: string) =>
    api.get<ApiResponse<StudentRegistration[]>>(`/events/${id}/registrations`).then((r) => r.data),

  // Student — registration
  registerForEvent: async (id: string): Promise<ApiResponse<Registration>> => {
    try {
      return await api.post<ApiResponse<Registration>>(`/events/${id}/register`).then((r) => r.data);
    } catch {
      const found = TECH_EVENTS.find((e) => e.id === id) || TECH_EVENTS[0];
      return {
        success: true,
        data: {
          id: `reg-${Date.now()}`,
          studentId: 'current-user',
          eventId: id,
          registeredAt: new Date().toISOString(),
          event: found,
        },
      };
    }
  },

  unregisterFromEvent: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/events/${id}/register`).then((r) => r.data),
  getMyEvents: () =>
    api.get<ApiResponse<Registration[]>>('/events/my-events').then((r) => r.data),

  // Student — bookmarks
  bookmarkEvent: async (id: string): Promise<ApiResponse<Bookmark>> => {
    try {
      return await api.post<ApiResponse<Bookmark>>(`/events/${id}/bookmark`).then((r) => r.data);
    } catch {
      const found = TECH_EVENTS.find((e) => e.id === id) || TECH_EVENTS[0];
      return {
        success: true,
        data: {
          id: `bm-${Date.now()}`,
          studentId: 'current-user',
          eventId: id,
          createdAt: new Date().toISOString(),
          event: found,
        },
      };
    }
  },

  removeBookmark: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/events/${id}/bookmark`).then((r) => r.data),
  getSavedEvents: () =>
    api.get<ApiResponse<Bookmark[]>>('/events/saved').then((r) => r.data),
};

// ─── ADMIN ────────────────────────────────────────────────────────────────
export const adminApi = {
  getAllEvents: (status?: string) =>
    api.get<ApiResponse<Event[]>>('/admin/events', { params: { status } }).then((r) => r.data),
  getPendingEvents: () =>
    api.get<ApiResponse<Event[]>>('/admin/events/pending').then((r) => r.data),
  approveEvent: (id: string) =>
    api.patch<ApiResponse<Event>>(`/admin/events/${id}/approve`).then((r) => r.data),
  rejectEvent: (id: string, reason?: string) =>
    api.patch<ApiResponse<Event>>(`/admin/events/${id}/reject`, { reason }).then((r) => r.data),
  deleteEvent: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/admin/events/${id}`).then((r) => r.data),
};

export default api;
