import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { EventCategory, EventMode, EventStatus } from '../types/event';

export const formatDate = (date: string): string => {
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return date;
  }
};

export const formatTime = (time: string): string => {
  try {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m);
    return format(d, 'hh:mm a');
  } catch {
    return time;
  }
};

export const formatDateRange = (start: string, end: string): string => {
  try {
    const s = new Date(start);
    const e = new Date(end);
    if (format(s, 'yyyy-MM-dd') === format(e, 'yyyy-MM-dd')) {
      return format(s, 'MMM dd, yyyy');
    }
    return `${format(s, 'MMM dd')} – ${format(e, 'MMM dd, yyyy')}`;
  } catch {
    return start;
  }
};

export const timeAgo = (date: string): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return date;
  }
};

export const isDeadlinePassed = (deadline: string): boolean => {
  try {
    return isPast(new Date(deadline));
  } catch {
    return false;
  }
};

export const isDeadlineToday = (deadline: string): boolean => {
  try {
    return isToday(new Date(deadline));
  } catch {
    return false;
  }
};

export const getCategoryLabel = (category: EventCategory): string => {
  const labels: Record<EventCategory, string> = {
    TECHNOLOGY: 'Technology',
    CULTURAL: 'Cultural',
    SPORTS: 'Sports',
    ACADEMIC: 'Academic',
    WORKSHOP: 'Workshop',
    SEMINAR: 'Seminar',
    CONFERENCE: 'Conference',
    COLLEGE_FEST: 'College Fest',
    OTHER: 'Other',
  };
  return labels[category] || category;
};

export const getModeLabel = (mode: EventMode): string => {
  const labels: Record<EventMode, string> = {
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    HYBRID: 'Hybrid',
  };
  return labels[mode] || mode;
};

export const getStatusLabel = (status: EventStatus): string => {
  const labels: Record<EventStatus, string> = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  };
  return labels[status] || status;
};

export const getCategoryColor = (category: EventCategory): string => {
  const colors: Record<EventCategory, string> = {
    TECHNOLOGY: '#818cf8',
    CULTURAL: '#f472b6',
    SPORTS: '#34d399',
    ACADEMIC: '#60a5fa',
    WORKSHOP: '#fb923c',
    SEMINAR: '#a78bfa',
    CONFERENCE: '#38bdf8',
    COLLEGE_FEST: '#fbbf24',
    OTHER: '#94a3b8',
  };
  return colors[category] || '#94a3b8';
};

export const getModeColor = (mode: EventMode): string => {
  const colors: Record<EventMode, string> = {
    ONLINE: '#34d399',
    OFFLINE: '#fb923c',
    HYBRID: '#818cf8',
  };
  return colors[mode] || '#94a3b8';
};

export const getCapacityPercent = (registered: number, capacity: number): number => {
  return Math.min(100, Math.round((registered / capacity) * 100));
};

export const getRegistrationButtonState = (
  event: {
    status: EventStatus;
    registrationDeadline: string;
    capacity: number;
    _count: { registrations: number };
  },
  isRegistered: boolean
): { label: string; disabled: boolean; variant: string } => {
  if (isRegistered) return { label: 'Already Registered', disabled: true, variant: 'success' };
  if (event.status !== 'APPROVED') return { label: 'Not Available', disabled: true, variant: 'secondary' };
  if (isDeadlinePassed(event.registrationDeadline))
    return { label: 'Registration Closed', disabled: true, variant: 'secondary' };
  if (event._count.registrations >= event.capacity)
    return { label: 'Event Full', disabled: true, variant: 'secondary' };
  return { label: 'Register Now', disabled: false, variant: 'primary' };
};

export const EVENT_CATEGORIES: EventCategory[] = [
  'TECHNOLOGY', 'CULTURAL', 'SPORTS', 'ACADEMIC',
  'WORKSHOP', 'SEMINAR', 'CONFERENCE', 'COLLEGE_FEST', 'OTHER',
];

export const EVENT_MODES: EventMode[] = ['ONLINE', 'OFFLINE', 'HYBRID'];
