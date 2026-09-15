export const Role = {
  STUDENT: 'STUDENT',
  ORGANIZER: 'ORGANIZER',
  ADMIN: 'ADMIN',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const EventCategory = {
  TECHNOLOGY: 'TECHNOLOGY',
  CULTURAL: 'CULTURAL',
  SPORTS: 'SPORTS',
  ACADEMIC: 'ACADEMIC',
  WORKSHOP: 'WORKSHOP',
  SEMINAR: 'SEMINAR',
  CONFERENCE: 'CONFERENCE',
  COLLEGE_FEST: 'COLLEGE_FEST',
  OTHER: 'OTHER',
} as const;
export type EventCategory = (typeof EventCategory)[keyof typeof EventCategory];

export const EventMode = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  HYBRID: 'HYBRID',
} as const;
export type EventMode = (typeof EventMode)[keyof typeof EventMode];

export const EventStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
