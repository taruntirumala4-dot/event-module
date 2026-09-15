import { Router } from 'express';
import { eventController } from './event.controller';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { Role } from '../../types/enums';

const router = Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────────────────
router.get('/', eventController.getEvents);

// ─── STUDENT-SPECIFIC (must come before /:id to prevent route clash) ────────
router.get('/my-events', authenticate, authorize(Role.STUDENT), eventController.getMyEvents);
router.get('/saved', authenticate, authorize(Role.STUDENT), eventController.getSavedEvents);

// ─── ORGANIZER-SPECIFIC ─────────────────────────────────────────────────────
router.get(
  '/organizer/my-events',
  authenticate,
  authorize(Role.ORGANIZER),
  eventController.getOrganizerEvents
);

// ─── SINGLE EVENT (public) ──────────────────────────────────────────────────
router.get('/:id', eventController.getEventById);

// ─── CREATE EVENT (organizer only) ─────────────────────────────────────────
router.post('/', authenticate, authorize(Role.ORGANIZER), eventController.createEvent);

// ─── UPDATE / DELETE (organizer or admin) ───────────────────────────────────
router.patch(
  '/:id',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  eventController.updateEvent
);
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  eventController.deleteEvent
);

// ─── REGISTRATION ───────────────────────────────────────────────────────────
router.post('/:id/register', authenticate, authorize(Role.STUDENT), eventController.registerForEvent);
router.delete('/:id/register', authenticate, authorize(Role.STUDENT), eventController.unregisterFromEvent);

// ─── BOOKMARK ───────────────────────────────────────────────────────────────
router.post('/:id/bookmark', authenticate, authorize(Role.STUDENT), eventController.bookmarkEvent);
router.delete('/:id/bookmark', authenticate, authorize(Role.STUDENT), eventController.removeBookmark);

// ─── REGISTRATIONS LIST (organizer + admin) ─────────────────────────────────
router.get(
  '/:id/registrations',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  eventController.getEventRegistrations
);

export default router;
