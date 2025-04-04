import mongoose from 'mongoose';
const { Schema } = mongoose;

const ethiopiaGovRefDetailsSchema = new Schema(
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
        applicationType: {
            type: String,
            enum: ['primary', 'additional'],
            default: 'primary'
        },
        additionalApplicantIndex: {
            type: Number,
            default: null
        },
        visaApplicationId: {
            type: String,
            ref: 'EthiopiaVisaApplication',
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
ethiopiaGovRefDetailsSchema.index({ visaApplicationId: 1, applicationType: 1, additionalApplicantIndex: 1 });

const EthiopiaGovRefDetails = mongoose.model(
    'EthiopiaGovRefDetails',
    ethiopiaGovRefDetailsSchema
);

export default EthiopiaGovRefDetails;
