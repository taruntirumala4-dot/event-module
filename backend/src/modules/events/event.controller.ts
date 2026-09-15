import { Request, Response } from 'express';
import { eventService } from './event.service';
import { createEventSchema, updateEventSchema, rejectEventSchema } from './event.validation';
import { EventStatus, EventMode, EventCategory, Role } from '../../types/enums';

const respond = (res: Response, data: unknown, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

export const eventController = {
  // GET /api/events
  async getEvents(req: Request, res: Response) {
    const { page, limit, search, category, location, mode, date } = req.query;
    const result = await eventService.getApprovedEvents({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      search: search as string | undefined,
      category: category as EventCategory | undefined,
      location: location as string | undefined,
      mode: mode as EventMode | undefined,
      date: date as string | undefined,
    });
    respond(res, result);
  },

  // GET /api/events/my-events  (student)
  async getMyEvents(req: Request, res: Response) {
    const registrations = await eventService.getStudentRegistrations(req.user!.userId);
    respond(res, registrations);
  },

  // GET /api/events/saved  (student)
  async getSavedEvents(req: Request, res: Response) {
    const bookmarks = await eventService.getStudentBookmarks(req.user!.userId);
    respond(res, bookmarks);
  },

  // GET /api/events/organizer/my-events  (organizer)
  async getOrganizerEvents(req: Request, res: Response) {
    const events = await eventService.getOrganizerEvents(req.user!.userId);
    respond(res, events);
  },

  // GET /api/events/:id
  async getEventById(req: Request, res: Response) {
    const event = await eventService.getEventById(req.params.id);
    let statusInfo = { isRegistered: false, isBookmarked: false };
    if (req.user && req.user.role === Role.STUDENT) {
      statusInfo = await eventService.getRegistrationAndBookmarkStatus(
        req.user.userId,
        req.params.id
      );
    }
    respond(res, { ...event, ...statusInfo });
  },

  // POST /api/events
  async createEvent(req: Request, res: Response) {
    const parsed = createEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation error', errors: parsed.error.flatten() });
      return;
    }
    const event = await eventService.createEvent(req.user!.userId, parsed.data);
    respond(res, event, 201);
  },

  // PATCH /api/events/:id
  async updateEvent(req: Request, res: Response) {
    const parsed = updateEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation error', errors: parsed.error.flatten() });
      return;
    }
    const event = await eventService.updateEvent(
      req.params.id,
      req.user!.userId,
      req.user!.role,
      parsed.data
    );
    respond(res, event);
  },

  // DELETE /api/events/:id
  async deleteEvent(req: Request, res: Response) {
    await eventService.deleteEvent(req.params.id, req.user!.userId, req.user!.role);
    respond(res, { message: 'Event deleted successfully' });
  },

  // POST /api/events/:id/register
  async registerForEvent(req: Request, res: Response) {
    const registration = await eventService.registerForEvent(req.user!.userId, req.params.id);
    respond(res, registration, 201);
  },

  // DELETE /api/events/:id/register
  async unregisterFromEvent(req: Request, res: Response) {
    await eventService.unregisterFromEvent(req.user!.userId, req.params.id);
    respond(res, { message: 'Successfully unregistered from event' });
  },

  // POST /api/events/:id/bookmark
  async bookmarkEvent(req: Request, res: Response) {
    const bookmark = await eventService.bookmarkEvent(req.user!.userId, req.params.id);
    respond(res, bookmark, 201);
  },

  // DELETE /api/events/:id/bookmark
  async removeBookmark(req: Request, res: Response) {
    await eventService.removeBookmark(req.user!.userId, req.params.id);
    respond(res, { message: 'Bookmark removed' });
  },

  // GET /api/events/:id/registrations
  async getEventRegistrations(req: Request, res: Response) {
    const registrations = await eventService.getEventRegistrations(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    respond(res, registrations);
  },

  // ─── ADMIN ────────────────────────────────────────────────────────────
  // GET /api/admin/events
  async adminGetAllEvents(req: Request, res: Response) {
    const { status } = req.query;
    const events = await eventService.adminGetAllEvents(status as EventStatus | undefined);
    respond(res, events);
  },

  // GET /api/admin/events/pending
  async adminGetPendingEvents(_req: Request, res: Response) {
    const events = await eventService.adminGetAllEvents(EventStatus.PENDING);
    respond(res, events);
  },

  // PATCH /api/admin/events/:id/approve
  async approveEvent(req: Request, res: Response) {
    const event = await eventService.approveEvent(req.params.id);
    respond(res, event);
  },

  // PATCH /api/admin/events/:id/reject
  async rejectEvent(req: Request, res: Response) {
    const parsed = rejectEventSchema.safeParse(req.body);
    const reason = parsed.success ? parsed.data.reason : undefined;
    const event = await eventService.rejectEvent(req.params.id, reason);
    respond(res, event);
  },

  // DELETE /api/admin/events/:id
  async adminDeleteEvent(req: Request, res: Response) {
    await eventService.deleteEvent(req.params.id, req.user!.userId, Role.ADMIN);
    respond(res, { message: 'Event deleted by admin' });
  },
};
