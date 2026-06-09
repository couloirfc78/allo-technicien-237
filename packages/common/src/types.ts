// User types
export type UserRole = 'client' | 'technician' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Technician types
export type Specialty = 
  | 'soudeur'
  | 'mecanicien_auto'
  | 'electricien'
  | 'infographe'
  | 'mecanographe'
  | 'macon'
  | 'menuisier'
  | 'plombier'
  | 'graphiste'
  | 'vitrier';

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
}

export interface AvailabilitySchedule {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Technician {
  id: string;
  userId: string;
  specialty: Specialty;
  bio: string;
  rating: number;
  reviewCount: number;
  certifications: string[];
  hourlyRate: number;
  availability: AvailabilitySchedule;
  location: LocationCoords;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Review types
export interface Review {
  id: string;
  bookingId: string;
  authorId: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Booking types
export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'stripe' | 'bank_transfer';

export interface Payment {
  stripePaymentId?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number;
  currency: string;
}

export interface Booking {
  id: string;
  clientId: string;
  technicianId: string;
  specialty: Specialty;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number; // in minutes
  location: LocationCoords;
  status: BookingStatus;
  totalPrice: number;
  payment: Payment;
  review?: Review;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
