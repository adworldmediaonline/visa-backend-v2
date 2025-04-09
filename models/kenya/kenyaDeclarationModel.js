import mongoose from 'mongoose';

const { Schema } = mongoose;

const KenyaDeclarationSchema = new Schema(
    {
        formId: {
            type: String,
            required: true,
            ref: 'KenyaVisaApplication'
        },
        tripFinanced: {
            type: Boolean,
            required: true
        },
        convictedOfOffence: {
            type: Boolean,
            required: true
        },
        deniedEntryToKenya: {
            type: Boolean,
            required: true
        },
        previousTravelToKenya: {
            type: Boolean,
            required: true
        },
        monetaryInstrument: {
            type: Boolean,
            required: true
        },
        monetaryInstrumentName: {
            type: String,
            required: false
        },
        monetaryInstrumentCurrency: {
            type: String
        },
        amount: {
            type: Number,
            required: false
        }
    },
    { timestamps: true }
);

const KenyaDeclaration = mongoose.model('KenyaDeclaration', KenyaDeclarationSchema);
export default KenyaDeclaration;