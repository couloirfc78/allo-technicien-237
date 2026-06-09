import { Request, Response } from 'express';
import { asyncHandler, ApiError, sendResponse } from '../utils/errors';
import { User } from '../models/User';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/auth';
import { AuthResponse } from '@allo/common';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  if (!email || !password || !firstName || !lastName || !phone) {
    throw new ApiError(400, 'Missing required fields');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone,
    role: role || 'client',
  });

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const response: AuthResponse = {
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };

  sendResponse(res, 201, response, 'User registered successfully');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const passwordValid = await verifyPassword(password, user.password);
  if (!passwordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const response: AuthResponse = {
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };

  sendResponse(res, 200, response, 'Login successful');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, 200, undefined, 'Logout successful');
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  const accessToken = generateAccessToken({
    userId: 'userId',
    email: 'email',
    role: 'client',
  });

  sendResponse(res, 200, { accessToken }, 'Token refreshed successfully');
});
