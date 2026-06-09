import { Schema, model, Document } from 'mongoose';
import { Booking as IBooking, BookingStatus, PaymentStatus, PaymentMethod } from '@allo/common';

export interface IBookingDocument extends Omit<IBooking, 'createdAt' | 'updatedAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    specialty: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      stripePaymentId: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      method: {
        type: String,
        enum: ['stripe', 'bank_transfer'],
        default: 'stripe',
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'XAF',
      },
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },
  },
  { timestamps: true }
);

export const Booking = model<IBookingDocument>('Booking', bookingSchema);
