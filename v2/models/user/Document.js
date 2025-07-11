import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    // Reference to the main application
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },

    // Reference to traveler (if document is for a specific traveler)
    traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traveler',
    },

    // Document requirement reference
    documentRequirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentRequirement',
    },

    // Document type and category
    type: {
      type: String,
      enum: [
        'passport_copy',
        'passport_photo',
        'financial_statement',
        'employment_letter',
        'invitation_letter',
        'travel_insurance',
        'hotel_booking',
        'flight_booking',
        'medical_certificate',
        'police_clearance',
        'birth_certificate',
        'marriage_certificate',
        'educational_documents',
        'consent_letter',
        'other',
      ],
      required: true,
    },

    category: {
      type: String,
      enum: [
        'identity',
        'financial',
        'travel',
        'employment',
        'education',
        'medical',
        'other',
      ],
      required: true,
    },

    // File information
    file: {
      originalName: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      thumbnailUrl: String,
      mimeType: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },

    // Document status
    status: {
      type: String,
      enum: [
        'uploaded',
        'processing',
        'approved',
        'rejected',
        'requires_reupload',
      ],
      default: 'uploaded',
    },

    // Validation and processing
    validation: {
      isValid: {
        type: Boolean,
        default: false,
      },
      errors: [String],
      warnings: [String],
      validatedAt: Date,
      validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },

    // Admin review
    review: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      notes: String,
      rejectionReason: String,
    },

    // Document metadata
    metadata: {
      description: String,
      tags: [String],
      isRequired: {
        type: Boolean,
        default: true,
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
      },
      expiryDate: Date,
      issueDate: Date,
      issuingAuthority: String,
    },

    // Version control (for resubmissions)
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [
      {
        version: Number,
        fileUrl: String,
        uploadedAt: Date,
        rejectionReason: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
documentSchema.index({ application: 1 });
documentSchema.index({ traveler: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ category: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ 'review.status': 1 });

// Compound indexes
documentSchema.index({ application: 1, type: 1 });
documentSchema.index({ application: 1, status: 1 });

// Virtual for file size display
documentSchema.virtual('fileSizeDisplay').get(function () {
  const bytes = this.file.size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Virtual for document age
documentSchema.virtual('documentAge').get(function () {
  return Math.floor(
    (Date.now() - this.file.uploadedAt) / (1000 * 60 * 60 * 24)
  );
});

// Virtual for is expired
documentSchema.virtual('isExpired').get(function () {
  if (!this.metadata.expiryDate) return false;
  return this.metadata.expiryDate < new Date();
});

export default mongoose.model('Document', documentSchema);
