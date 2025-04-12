import mongoose from 'mongoose';

const { Schema } = mongoose;

const EgyptDeclarationSchema = new Schema(
    {
        formId: {
            type: String,
            required: true,
            ref: 'EgyptVisaApplicationN'
        },
        visitedBefore: {
            type: Boolean,
            required: true
        },
        dateFrom: {
            type: Date,
            required: false
        },
        dateTo: {
            type: Date,
            required: false
        },
        whereStayed: {
            type: String,
            required: false
        },
        deportedFromEgyptOrOtherCountry: {
            type: Boolean,
            required: true
        },
        deportedDateFrom: {
            type: Date,
            required: false
        },
        deportedDateTo: {
            type: Date,
            required: false
        },
        whoIsPaying: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
);

const EgyptDeclaration = mongoose.model('EgyptDeclaration', EgyptDeclarationSchema);
export default EgyptDeclaration;