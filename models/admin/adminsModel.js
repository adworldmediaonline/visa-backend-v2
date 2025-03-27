import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      index: { unique: true },
    },

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    role: {
      type: String,
      enum: ['admin', 'superAdmin', 'agent', 'superAgent'],
      default: 'admin',
    },

    password: {
      type: String,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
