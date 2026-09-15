import prisma from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { EventStatus, EventMode, EventCategory } from '../../types/enums';

export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: EventCategory;
  location?: string;
  mode?: EventMode;
  date?: string;
  status?: EventStatus;
  organizerId?: string;
}

export const eventRepository = {
  // ─── FIND ALL (public, with filters) ──────────────────────────────────
  async findAll(filters: EventFilters) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      location,
      mode,
      date,
      status = EventStatus.APPROVED,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {
      status,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
          { location: { contains: search } },
        ],
      }),
      ...(category && { category }),
      ...(location && { location: { contains: location } }),
      ...(mode && { mode }),
      ...(date && {
        startDate: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      }),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          _count: { select: { registrations: true } },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  // ─── FIND BY ID ────────────────────────────────────────────────────────
  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });
  },

  // ─── CREATE ────────────────────────────────────────────────────────────
  async create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });
  },

  // ─── UPDATE ────────────────────────────────────────────────────────────
  async update(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });
  },

  // ─── DELETE ────────────────────────────────────────────────────────────
  async delete(id: string) {
    return prisma.event.delete({ where: { id } });
  },

  // ─── ORGANIZER EVENTS ─────────────────────────────────────────────────
  async findByOrganizer(organizerId: string) {
    return prisma.event.findMany({
      where: { organizerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { registrations: true } },
      },
    });
  },

  // ─── ADMIN: ALL EVENTS ────────────────────────────────────────────────
  async findAllAdmin(status?: EventStatus) {
    return prisma.event.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });
  },

  // ─── REGISTRATION ─────────────────────────────────────────────────────
  async findRegistration(studentId: string, eventId: string) {
    return prisma.registration.findUnique({
      where: { studentId_eventId: { studentId, eventId } },
    });
  },

  async createRegistration(studentId: string, eventId: string) {
    return prisma.registration.create({
      data: { studentId, eventId },
    });
  },

  async deleteRegistration(studentId: string, eventId: string) {
    return prisma.registration.delete({
      where: { studentId_eventId: { studentId, eventId } },
    });
  },

  async countRegistrations(eventId: string) {
    return prisma.registration.count({ where: { eventId } });
  },

  async findStudentRegistrations(studentId: string) {
    return prisma.registration.findMany({
      where: { studentId },
      orderBy: { registeredAt: 'desc' },
      include: {
        event: {
          include: {
            organizer: { select: { id: true, name: true } },
            _count: { select: { registrations: true } },
          },
        },
      },
    });
  },

  async findEventRegistrations(eventId: string) {
    return prisma.registration.findMany({
      where: { eventId },
      orderBy: { registeredAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });
  },

  // ─── BOOKMARK ─────────────────────────────────────────────────────────
  async findBookmark(studentId: string, eventId: string) {
    return prisma.bookmark.findUnique({
      where: { studentId_eventId: { studentId, eventId } },
    });
  },

  async createBookmark(studentId: string, eventId: string) {
    return prisma.bookmark.create({
      data: { studentId, eventId },
    });
  },

  async deleteBookmark(studentId: string, eventId: string) {
    return prisma.bookmark.delete({
      where: { studentId_eventId: { studentId, eventId } },
    });
  },

  async findStudentBookmarks(studentId: string) {
    return prisma.bookmark.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          include: {
            organizer: { select: { id: true, name: true } },
            _count: { select: { registrations: true } },
          },
        },
      },
    });
  },
};
