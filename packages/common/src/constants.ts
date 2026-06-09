export const SPECIALTIES = {
  SOUDEUR: 'soudeur',
  MECANICIEN_AUTO: 'mecanicien_auto',
  ELECTRICIEN: 'electricien',
  INFOGRAPHE: 'infographe',
  MECANOGRAPHE: 'mecanographe',
  MACON: 'macon',
  MENUISIER: 'menuisier',
  PLOMBIER: 'plombier',
  GRAPHISTE: 'graphiste',
  VITRIER: 'vitrier',
} as const;

export const SPECIALTY_LABELS = {
  soudeur: '🔥 Soudeur',
  mecanicien_auto: '🚗 Mécanicien automobile',
  electricien: '⚡ Électricien',
  infographe: '🎨 Infographe',
  mecanographe: '⌨️ Mécanographe',
  macon: '🧱 Maçon',
  menuisier: '🪵 Menuisier',
  plombier: '🚰 Plombier',
  graphiste: '🎭 Graphiste',
  vitrier: '🪟 Vitrier',
} as const;

export const USER_ROLES = {
  CLIENT: 'client',
  TECHNICIAN: 'technician',
  ADMIN: 'admin',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const BOOKING_STATUS_LABELS = {
  pending: 'En attente',
  accepted: 'Acceptée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    ME: '/users/me',
    GET_USER: '/users/:id',
    UPDATE_PROFILE: '/users/me',
    DELETE_ACCOUNT: '/users/me',
  },
  TECHNICIANS: {
    LIST: '/technicians',
    GET_TECHNICIAN: '/technicians/:id',
    SEARCH: '/technicians/search/nearby',
    GET_REVIEWS: '/technicians/:id/reviews',
    CREATE_PROFILE: '/technicians',
    UPDATE_PROFILE: '/technicians/me',
  },
  BOOKINGS: {
    LIST: '/bookings/me',
    CREATE: '/bookings',
    GET_BOOKING: '/bookings/:id',
    UPDATE: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
    ACCEPT: '/bookings/:id/accept',
    COMPLETE: '/bookings/:id/complete',
  },
  REVIEWS: {
    CREATE: '/bookings/:bookingId/reviews',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
  },
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_BIO_LENGTH: 10,
  MAX_BIO_LENGTH: 500,
  MIN_HOURLY_RATE: 1000,
  MAX_HOURLY_RATE: 1000000,
  MIN_BOOKING_DURATION: 15, // minutes
  MAX_BOOKING_DURATION: 480, // minutes
} as const;
