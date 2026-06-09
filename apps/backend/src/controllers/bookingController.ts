import { Request, Response } from 'express';
import { asyncHandler, ApiError, sendResponse } from '../utils/errors';
import { Booking } from '../models/Booking';
import { Technician } from '../models/Technician';
import { PaginatedResponse } from '@allo/common';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { technicianId, title, description, specialty, scheduledDate, duration, location } = req.body;

  if (!technicianId || !title || !specialty || !scheduledDate || !duration || !location) {
    throw new ApiError(400, 'Missing required fields');
  }

  const technician = await Technician.findById(technicianId);
  if (!technician) {
    throw new ApiError(404, 'Technician not found');
  }

  const totalPrice = (technician.hourlyRate / 60) * duration;

  const booking = await Booking.create({
    clientId: req.user.userId,
    technicianId: technician.userId,
    title,
    description,
    specialty,
    scheduledDate: new Date(scheduledDate),
    duration,
    location,
    totalPrice,
    payment: {
      amount: totalPrice,
      currency: 'XAF',
      status: 'pending',
    },
  });

  sendResponse(res, 201, booking, 'Booking created successfully');
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { status, skip = 0, limit = 20 } = req.query;

  const skipNum = Math.max(0, parseInt(skip as string) || 0);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

  const filters: any = {
    $or: [{ clientId: req.user.userId }, { technicianId: req.user.userId }],
  };

  if (status) {
    filters.status = status;
  }

  const total = await Booking.countDocuments(filters);
  const bookings = await Booking.find(filters)
    .populate('clientId', 'firstName lastName email phone avatar')
    .populate('technicianId', 'firstName lastName email phone avatar')
    .skip(skipNum)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const response: PaginatedResponse<any> = {
    data: bookings,
    total,
    page: Math.floor(skipNum / limitNum) + 1,
    limit: limitNum,
    hasMore: skipNum + limitNum < total,
  };

  sendResponse(res, 200, response, 'Bookings retrieved successfully');
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate('clientId', 'firstName lastName email phone avatar')
    .populate('technicianId', 'firstName lastName email phone avatar')
    .populate('review');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  sendResponse(res, 200, booking, 'Booking retrieved successfully');
});

export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;
  const { title, description, scheduledDate, duration } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.clientId.toString() !== req.user.userId) {
    throw new ApiError(403, 'Not authorized');
  }

  if (booking.status !== 'pending') {
    throw new ApiError(400, 'Can only update pending bookings');
  }

  if (title) booking.title = title;
  if (description) booking.description = description;
  if (scheduledDate) booking.scheduledDate = new Date(scheduledDate);
  if (duration) {
    booking.duration = duration;
    const technician = await Technician.findOne({ userId: booking.technicianId });
    if (technician) {
      booking.totalPrice = (technician.hourlyRate / 60) * duration;
    }
  }

  await booking.save();

  sendResponse(res, 200, booking, 'Booking updated successfully');
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.clientId.toString() !== req.user.userId) {
    throw new ApiError(403, 'Not authorized');
  }

  booking.status = 'cancelled';
  await booking.save();

  sendResponse(res, 200, booking, 'Booking cancelled successfully');
});

export const acceptBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.technicianId.toString() !== req.user.userId) {
    throw new ApiError(403, 'Not authorized');
  }

  booking.status = 'accepted';
  await booking.save();

  sendResponse(res, 200, booking, 'Booking accepted successfully');
});

export const completeBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.technicianId.toString() !== req.user.userId) {
    throw new ApiError(403, 'Not authorized');
  }

  booking.status = 'completed';
  booking.payment.status = 'completed';
  await booking.save();

  sendResponse(res, 200, booking, 'Booking completed successfully');
});
