import dotenv from 'dotenv';
import dbConnect from '../../config/dbConnection.js';
import VisaRule from '../models/visaRule.model.js';

dotenv.config();

const sampleVisaRules = [
  {
    passportCountry: {
      name: 'Australia',
      code: 'AU',
      flag: '🇦🇺',
    },
    destinationCountry: {
      name: 'United Kingdom',
      code: 'GB',
      flag: '🇬🇧',
    },
    visaRequired: true,
    visaOptions: [
      {
        name: 'United Kingdom ETA',
        visaType: 'ETA',
        entryType: 'Multiple Entry',
        validity: '2 Years',
        stayPerVisit: 'Up to 6 months',
        processingTime: 'Immediate',
        fee: 1956.9,
        currency: 'INR',
        governmentFeeDisplay: 'INR 8,164.84',
        badges: [
          { label: 'Valid for 2 Years', color: 'blue' },
          { label: 'Multiple entry', color: 'green' },
        ],
        requiredDocuments: [
          'Valid Passport',
          'Digital Photograph',
          'Travel Itinerary (optional)',
          'Proof of Funds (optional)',
        ],
        description:
          'The UK ETA allows multiple visits to the United Kingdom for tourism, business, or transit purposes.',
        eligibility:
          'For travelers from ETA-eligible countries like Australia.',
        whatToKnow:
          'The UK ETA lets you travel to the UK multiple times for up to 6 months at a time, with a validity of 2 years.',
        learnMore:
          'You do not need to apply for an ETA if you already have a UK visa that allows you to come to the UK.',
        processingOptions: [
          {
            id: 'standard',
            name: 'Standard',
            fee: 8164.84,
            currency: 'INR',
            processingTime: 'Processed within 24 hours',
            description: 'Standard processing time for your visa application',
            isDefault: true,
          },
          {
            id: 'rush',
            name: 'Rush',
            fee: 12701.37,
            currency: 'INR',
            processingTime: 'Processed within 4 hours',
            description: 'Faster processing for urgent travel needs',
            isDefault: false,
          },
          {
            id: 'super_rush',
            name: 'Super Rush',
            fee: 16330.59,
            currency: 'INR',
            processingTime: 'Processed within 1 hour',
            description: 'Fastest processing for immediate travel requirements',
            isDefault: false,
          },
        ],
        formConfig: {
          fields: [
            {
              name: 'fullName',
              label: 'Full Name',
              type: 'text',
              required: true,
              placeholder: 'Enter your full name as per passport',
            },
            {
              name: 'passportNumber',
              label: 'Passport Number',
              type: 'text',
              required: true,
              placeholder: 'Enter passport number',
            },
            {
              name: 'dateOfBirth',
              label: 'Date of Birth',
              type: 'date',
              required: true,
            },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              required: true,
              placeholder: 'Enter your email address',
            },
            {
              name: 'gender',
              label: 'Gender',
              type: 'select',
              required: true,
              options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'passportUpload',
              label: 'Passport Upload',
              type: 'file',
              required: true,
            },
          ],
        },
      },
    ],
    generalInfo: {
      description:
        'Australia passport holders need an ETA to enter the United Kingdom.',
      tips: [
        'Apply at least 48 hours before travel',
        'Ensure passport is valid for at least 6 months',
        'Have proof of return ticket',
      ],
      importantNotes: [
        'ETA is linked to your passport',
        'Cannot be extended once in the UK',
        'Must have clean criminal record',
      ],
    },
  },
];

async function seedVisaRules() {
  try {
    // Connect to database
    await dbConnect();
    console.log('Connected to database');

    // Clear existing visa rules
    await VisaRule.deleteMany({});
    console.log('Cleared existing visa rules');

    // Insert new visa rules
    const createdRules = await VisaRule.insertMany(sampleVisaRules);
    console.log(`Created ${createdRules.length} visa rules`);

    createdRules.forEach(rule => {
      console.log(
        `- ${rule.passportCountry.name} → ${rule.destinationCountry.name}: ${rule.visaOptions.length} visa options`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding visa rules:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedVisaRules();
}

export { sampleVisaRules, seedVisaRules };
