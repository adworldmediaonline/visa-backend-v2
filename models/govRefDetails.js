import mongoose from 'mongoose';
const { Schema } = mongoose;

const indiaGovRefDetailsSchema = new Schema(
    {
        govRefEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        govRefNumber: {
            type: String,
            trim: true,
        },
        comment: {
            type: String,
            trim: true,
        },
        visaApplicationId: {
            type: String,
            ref: 'VisaRequestForm',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
indiaGovRefDetailsSchema.index({ visaApplicationId: 1 });

const IndiaGovRefDetails = mongoose.model(
    'IndiaGovRefDetails',
    indiaGovRefDetailsSchema
);

export default IndiaGovRefDetails;
