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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error extraction
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';
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
  getEvents: (filters?: EventFilters) =>
    api.get<ApiResponse<PaginatedEvents>>('/events', { params: filters }).then((r) => r.data),
  getEventById: (id: string) =>
    api.get<ApiResponse<Event>>(`/events/${id}`).then((r) => r.data),

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
  registerForEvent: (id: string) =>
    api.post<ApiResponse<Registration>>(`/events/${id}/register`).then((r) => r.data),
  unregisterFromEvent: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/events/${id}/register`).then((r) => r.data),
  getMyEvents: () =>
    api.get<ApiResponse<Registration[]>>('/events/my-events').then((r) => r.data),

  // Student — bookmarks
  bookmarkEvent: (id: string) =>
    api.post<ApiResponse<Bookmark>>(`/events/${id}/bookmark`).then((r) => r.data),
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
