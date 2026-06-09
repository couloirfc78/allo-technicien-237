import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@allo/common';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  errors?: Array<{ field: string; message: string }>
) => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    data,
    message,
    errors,
  };

  res.status(statusCode).json(response);
};

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return sendResponse(res, err.statusCode, undefined, err.message, err.errors);
  }

  sendResponse(res, 500, undefined, 'Internal server error');
};
