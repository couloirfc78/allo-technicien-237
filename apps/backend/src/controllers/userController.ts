import { Request, Response } from 'express';
import { asyncHandler, ApiError, sendResponse } from '../utils/errors';
import { User } from '../models/User';

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await User.findById(req.user.userId).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  sendResponse(res, 200, user, 'User profile retrieved successfully');
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  sendResponse(res, 200, user, 'User retrieved successfully');
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { firstName, lastName, phone, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      $set: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
    },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  sendResponse(res, 200, user, 'User profile updated successfully');
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  await User.findByIdAndDelete(req.user.userId);

  sendResponse(res, 200, undefined, 'Account deleted successfully');
});
