import { Request, Response } from 'express';
import { asyncHandler, ApiError, sendResponse } from '../utils/errors';
import { User } from '../models/User';
import { Technician } from '../models/Technician';
import { Booking } from '../models/Booking';
import { PaginatedResponse } from '@allo/common';

export const getTechnicians = asyncHandler(async (req: Request, res: Response) => {
  const { skip = 0, limit = 20, specialty, rating } = req.query;

  const skipNum = Math.max(0, parseInt(skip as string) || 0);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

  const filters: any = { isActive: true };

  if (specialty) {
    filters.specialty = specialty;
  }

  if (rating) {
    filters.rating = { $gte: parseInt(rating as string) };
  }

  const total = await Technician.countDocuments(filters);
  const technicians = await Technician.find(filters)
    .populate('userId', 'firstName lastName email phone avatar')
    .skip(skipNum)
    .limit(limitNum)
    .sort({ rating: -1 });

  const response: PaginatedResponse<any> = {
    data: technicians,
    total,
    page: Math.floor(skipNum / limitNum) + 1,
    limit: limitNum,
    hasMore: skipNum + limitNum < total,
  };

  sendResponse(res, 200, response, 'Technicians retrieved successfully');
});

export const searchTechniciansByLocation = asyncHandler(async (req: Request, res: Response) => {
  const { latitude, longitude, radius = 50, specialty } = req.query;

  if (!latitude || !longitude) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const lat = parseFloat(latitude as string);
  const lon = parseFloat(longitude as string);
  const rad = parseInt(radius as string) || 50;

  const filters: any = {
    isActive: true,
    location: {
      $geoWithin: {
        $centerSphere: [[lon, lat], rad / 3959],
      },
    },
  };

  if (specialty) {
    filters.specialty = specialty;
  }

  const technicians = await Technician.find(filters)
    .populate('userId', 'firstName lastName email phone avatar')
    .limit(50)
    .sort({ rating: -1 });

  sendResponse(res, 200, technicians, 'Nearby technicians found');
});

export const getTechnicianById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const technician = await Technician.findById(id).populate(
    'userId',
    'firstName lastName email phone avatar'
  );

  if (!technician) {
    throw new ApiError(404, 'Technician not found');
  }

  sendResponse(res, 200, technician, 'Technician retrieved successfully');
});

export const createTechnicianProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { specialty, bio, hourlyRate, certifications, location, availability } = req.body;

  if (!specialty || !hourlyRate || !location) {
    throw new ApiError(400, 'Missing required fields');
  }

  const existingTechnician = await Technician.findOne({ userId: req.user.userId });
  if (existingTechnician) {
    throw new ApiError(400, 'Technician profile already exists');
  }

  const technician = await Technician.create({
    userId: req.user.userId,
    specialty,
    bio,
    hourlyRate,
    certifications: certifications || [],
    location,
    availability: availability || {},
  });

  sendResponse(res, 201, technician, 'Technician profile created successfully');
});

export const updateTechnicianProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const technician = await Technician.findOne({ userId: req.user.userId });

  if (!technician) {
    throw new ApiError(404, 'Technician profile not found');
  }

  const { bio, hourlyRate, certifications, location, availability, isActive } = req.body;

  if (bio !== undefined) technician.bio = bio;
  if (hourlyRate !== undefined) technician.hourlyRate = hourlyRate;
  if (certifications !== undefined) technician.certifications = certifications;
  if (location !== undefined) technician.location = location;
  if (availability !== undefined) technician.availability = availability;
  if (isActive !== undefined) technician.isActive = isActive;

  await technician.save();

  sendResponse(res, 200, technician, 'Technician profile updated successfully');
});

export const getTechnicianReviews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { skip = 0, limit = 20 } = req.query;

  const technician = await Technician.findById(id);
  if (!technician) {
    throw new ApiError(404, 'Technician not found');
  }

  const skipNum = Math.max(0, parseInt(skip as string) || 0);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

  const reviews = await Booking.find({
    technicianId: technician.userId,
    status: 'completed',
    review: { $ne: null },
  })
    .populate('review')
    .skip(skipNum)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments({
    technicianId: technician.userId,
    status: 'completed',
    review: { $ne: null },
  });

  const response: PaginatedResponse<any> = {
    data: reviews.map((b) => b.review),
    total,
    page: Math.floor(skipNum / limitNum) + 1,
    limit: limitNum,
    hasMore: skipNum + limitNum < total,
  };

  sendResponse(res, 200, response, 'Reviews retrieved successfully');
});
