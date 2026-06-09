import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/me', authMiddleware, bookingController.getMyBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.put('/:id', authMiddleware, bookingController.updateBooking);
router.put('/:id/cancel', authMiddleware, bookingController.cancelBooking);
router.put('/:id/accept', authMiddleware, bookingController.acceptBooking);
router.put('/:id/complete', authMiddleware, bookingController.completeBooking);

export default router;
