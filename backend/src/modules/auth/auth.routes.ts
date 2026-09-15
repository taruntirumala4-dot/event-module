import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getProfile);

export default router;
