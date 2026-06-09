import { Request, Response } from 'express';
import { asyncHandler, ApiError, sendResponse } from '../utils/errors';
import { Review } from '../models/Review';
import { Booking } from '../models/Booking';
import { Technician } from '../models/Technician';

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { bookingId } = req.params;
  const { rating, title, comment, images } = req.body;

  if (!rating || !title || !comment) {
    throw new ApiError(400, 'Missing required fields');
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.clientId.toString() !== req.user.userId) {
    throw new ApiError(403, 'Not authorized');
  }

  if (booking.status !== 'completed') {
    throw new ApiError(400, 'Can only review completed bookings');
  }

  if (booking.review) {
    throw new ApiError(400, 'Booking already has a review');
  }

  const review = await Review.create({
    bookingId,
    authorId: req.user.userId,
    rating,
    title,
    comment,
    images: images || [],
  });

  booking.review = review._id;
  await booking.save();

  const technician = await Technician.findOne({ userId: booking.technicianId });
  if (technician) {
    const allReviews = await Review.find({
      bookingId: { $in: (await Booking.find({ technicianId: booking.technicianId })).map((b) => b._id) },
    });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    technician.rating = totalRating / allReviews.length;
    technician.reviewCount = allReviews.length;
    await technician.save();
  }

  sendResponse(res, 201, review, 'Review created successfully');
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;
  const { rating, title, comment, images } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  if (review.authorId.toString() !== req.user.userId) {
    throw new ApiError(403, 'Not authorized');
  }

  if (rating) review.rating = rating;
  if (title) review.title = title;
  if (comment) review.comment = comment;
  if (images) review.images = images;

  await review.save();

  sendResponse(res, 200, review, 'Review updated successfully');
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  if (review.authorId.toString() !== req.user.userId) {
    throw new ApiError(403, 'Not authorized');
  }

  await Review.findByIdAndDelete(id);
  await Booking.findByIdAndUpdate(review.bookingId, { review: null });

  sendResponse(res, 200, undefined, 'Review deleted successfully');
});
