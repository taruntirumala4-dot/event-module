import { Router } from 'express';
import { eventController } from '../events/event.controller';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { Role } from '../../types/enums';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize(Role.ADMIN));

router.get('/events', eventController.adminGetAllEvents);
router.get('/events/pending', eventController.adminGetPendingEvents);
router.patch('/events/:id/approve', eventController.approveEvent);
router.patch('/events/:id/reject', eventController.rejectEvent);
router.delete('/events/:id', eventController.adminDeleteEvent);

export default router;
