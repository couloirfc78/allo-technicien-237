import { Router } from 'express';
import * as technicianController from '../controllers/technicianController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', technicianController.getTechnicians);
router.get('/search/nearby', technicianController.searchTechniciansByLocation);
router.post('/', authMiddleware, technicianController.createTechnicianProfile);
router.get('/:id', technicianController.getTechnicianById);
router.get('/:id/reviews', technicianController.getTechnicianReviews);
router.put('/me', authMiddleware, technicianController.updateTechnicianProfile);

export default router;
