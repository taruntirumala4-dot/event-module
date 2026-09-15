import { EventStatus, Role } from '../../types/enums';
import { eventRepository, EventFilters } from './event.repository';
import { createError } from '../../middleware/errorHandler';
import { CreateEventInput, UpdateEventInput } from './event.validation';

export const eventService = {
  // ─── DISCOVERY ────────────────────────────────────────────────────────
  async getApprovedEvents(filters: EventFilters) {
    return eventRepository.findAll({ ...filters, status: EventStatus.APPROVED });
  },

  async getEventById(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw createError('Event not found', 404);
    return event;
  },

  // ─── ORGANIZER CRUD ───────────────────────────────────────────────────
  async createEvent(organizerId: string, data: CreateEventInput) {
    return eventRepository.create({
      title: data.title,
      description: data.description,
      category: data.category,
      image: data.image || null,
      venue: data.venue || null,
      location: data.location,
      mode: data.mode,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      startTime: data.startTime,
      endTime: data.endTime,
      registrationDeadline: new Date(data.registrationDeadline),
      capacity: data.capacity,
      eligibility: data.eligibility || null,
      registrationLink: data.registrationLink || null,
      status: EventStatus.PENDING,
      organizer: { connect: { id: organizerId } },
    });
  },

  async updateEvent(id: string, userId: string, userRole: Role, data: UpdateEventInput) {
    const event = await eventRepository.findById(id);
    if (!event) throw createError('Event not found', 404);

    if (userRole !== Role.ADMIN && event.organizerId !== userId) {
      throw createError('You can only edit your own events', 403);
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.image !== undefined) updateData.image = data.image || null;
    if (data.venue !== undefined) updateData.venue = data.venue || null;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.mode !== undefined) updateData.mode = data.mode;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.registrationDeadline !== undefined)
      updateData.registrationDeadline = new Date(data.registrationDeadline);
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.eligibility !== undefined) updateData.eligibility = data.eligibility || null;
    if (data.registrationLink !== undefined) updateData.registrationLink = data.registrationLink || null;

    return eventRepository.update(id, updateData);
  },

  async deleteEvent(id: string, userId: string, userRole: Role) {
    const event = await eventRepository.findById(id);
    if (!event) throw createError('Event not found', 404);

    if (userRole !== Role.ADMIN && event.organizerId !== userId) {
      throw createError('You can only delete your own events', 403);
    }

    await eventRepository.delete(id);
  },

  async getOrganizerEvents(organizerId: string) {
    return eventRepository.findByOrganizer(organizerId);
  },

  // ─── REGISTRATION ─────────────────────────────────────────────────────
  async registerForEvent(studentId: string, eventId: string) {
    const event = await eventRepository.findById(eventId);
    if (!event) throw createError('Event not found', 404);

    if (event.status !== EventStatus.APPROVED)
      throw createError('This event is not open for registration', 400);

    const now = new Date();
    if (now > event.registrationDeadline)
      throw createError('Registration deadline has passed', 400);

    const registrationCount = await eventRepository.countRegistrations(eventId);
    if (registrationCount >= event.capacity)
      throw createError('This event is already full', 400);

    const existing = await eventRepository.findRegistration(studentId, eventId);
    if (existing) throw createError('You are already registered for this event', 409);

    return eventRepository.createRegistration(studentId, eventId);
  },

  async unregisterFromEvent(studentId: string, eventId: string) {
    const existing = await eventRepository.findRegistration(studentId, eventId);
    if (!existing) throw createError('You are not registered for this event', 404);
    await eventRepository.deleteRegistration(studentId, eventId);
  },

  async getStudentRegistrations(studentId: string) {
    return eventRepository.findStudentRegistrations(studentId);
  },

  async getEventRegistrations(eventId: string, userId: string, userRole: Role) {
    const event = await eventRepository.findById(eventId);
    if (!event) throw createError('Event not found', 404);

    if (userRole !== Role.ADMIN && event.organizerId !== userId) {
      throw createError('You can only view registrations for your own events', 403);
    }

    return eventRepository.findEventRegistrations(eventId);
  },

  // ─── BOOKMARK ─────────────────────────────────────────────────────────
  async bookmarkEvent(studentId: string, eventId: string) {
    const event = await eventRepository.findById(eventId);
    if (!event) throw createError('Event not found', 404);

    const existing = await eventRepository.findBookmark(studentId, eventId);
    if (existing) throw createError('Event already bookmarked', 409);

    return eventRepository.createBookmark(studentId, eventId);
  },

  async removeBookmark(studentId: string, eventId: string) {
    const existing = await eventRepository.findBookmark(studentId, eventId);
    if (!existing) throw createError('Bookmark not found', 404);
    await eventRepository.deleteBookmark(studentId, eventId);
  },

  async getStudentBookmarks(studentId: string) {
    return eventRepository.findStudentBookmarks(studentId);
  },

  // ─── ADMIN ────────────────────────────────────────────────────────────
  async adminGetAllEvents(status?: EventStatus) {
    return eventRepository.findAllAdmin(status);
  },

  async approveEvent(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw createError('Event not found', 404);
    if (event.status === EventStatus.APPROVED)
      throw createError('Event is already approved', 400);
    return eventRepository.update(id, { status: EventStatus.APPROVED, rejectionReason: null });
  },

  async rejectEvent(id: string, reason?: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw createError('Event not found', 404);
    if (event.status === EventStatus.REJECTED)
      throw createError('Event is already rejected', 400);
    return eventRepository.update(id, {
      status: EventStatus.REJECTED,
      rejectionReason: reason || 'Rejected by admin',
    });
  },

  // ─── BOOKMARK STATUS ──────────────────────────────────────────────────
  async getRegistrationAndBookmarkStatus(studentId: string, eventId: string) {
    const [registration, bookmark] = await Promise.all([
      eventRepository.findRegistration(studentId, eventId),
      eventRepository.findBookmark(studentId, eventId),
    ]);
    return {
      isRegistered: !!registration,
      isBookmarked: !!bookmark,
    };
  },
};
