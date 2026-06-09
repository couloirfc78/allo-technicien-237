import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, userController.getCurrentUser);
router.put('/me', authMiddleware, userController.updateUserProfile);
router.delete('/me', authMiddleware, userController.deleteAccount);
router.get('/:id', userController.getUserById);

export default router;
