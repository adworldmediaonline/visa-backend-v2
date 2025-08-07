import mongoose from 'mongoose';

const simpleUploadSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'processed'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const SimpleUpload = mongoose.model('SimpleUpload', simpleUploadSchema);

export default SimpleUpload;
