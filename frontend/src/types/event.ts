export type UserRole = 'STUDENT' | 'ORGANIZER' | 'ADMIN';
export type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type EventMode = 'ONLINE' | 'OFFLINE' | 'HYBRID';
export type EventCategory =
  | 'TECHNOLOGY'
  | 'CULTURAL'
  | 'SPORTS'
  | 'ACADEMIC'
  | 'WORKSHOP'
  | 'SEMINAR'
  | 'CONFERENCE'
  | 'COLLEGE_FEST'
  | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Organizer {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  image: string | null;
  venue: string | null;
  location: string;
  mode: EventMode;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  capacity: number;
  eligibility: string | null;
  registrationLink: string | null;
  organizerId: string;
  organizer: Organizer;
  status: EventStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { registrations: number };
  // added by backend when student is logged in
  isRegistered?: boolean;
  isBookmarked?: boolean;
}

export interface Registration {
  id: string;
  studentId: string;
  eventId: string;
  registeredAt: string;
  event: Event;
}

export interface Bookmark {
  id: string;
  studentId: string;
  eventId: string;
  createdAt: string;
  event: Event;
}

export interface StudentRegistration {
  id: string;
  studentId: string;
  student: { id: string; name: string; email: string };
  eventId: string;
  registeredAt: string;
}

export interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: EventCategory | '';
  location?: string;
  mode?: EventMode | '';
  date?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface CreateEventForm {
  title: string;
  description: string;
  category: EventCategory | '';
  image: string;
  venue: string;
  location: string;
  mode: EventMode | '';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  capacity: number | '';
  eligibility: string;
  registrationLink: string;
}
