import { Schema, model, Document } from 'mongoose';
import { Technician as ITechnician, Specialty, AvailabilitySchedule, LocationCoords } from '@allo/common';

export interface ITechnicianDocument extends Omit<ITechnician, 'createdAt' | 'updatedAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const technicianSchema = new Schema<ITechnicianDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      enum: [
        'soudeur',
        'mecanicien_auto',
        'electricien',
        'infographe',
        'mecanographe',
        'macon',
        'menuisier',
        'plombier',
        'graphiste',
        'vitrier',
      ],
      required: true,
      index: true,
    },
    bio: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    certifications: [
      {
        type: String,
      },
    ],
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      monday: [
        {
          start: String,
          end: String,
        },
      ],
      tuesday: [
        {
          start: String,
          end: String,
        },
      ],
      wednesday: [
        {
          start: String,
          end: String,
        },
      ],
      thursday: [
        {
          start: String,
          end: String,
        },
      ],
      friday: [
        {
          start: String,
          end: String,
        },
      ],
      saturday: [
        {
          start: String,
          end: String,
        },
      ],
      sunday: [
        {
          start: String,
          end: String,
        },
      ],
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
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Technician = model<ITechnicianDocument>('Technician', technicianSchema);
