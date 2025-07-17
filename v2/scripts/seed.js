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
        governmentFeeDisplay: 'INR 1,956.90',
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
  {
    passportCountry: {
      name: 'India',
      code: 'IN',
      flag: '🇮🇳',
    },
    destinationCountry: {
      name: 'United Kingdom',
      code: 'GB',
      flag: '🇬🇧',
    },
    visaRequired: true,
    visaOptions: [
      {
        name: 'UK Standard Visitor Visa',
        visaType: 'Tourist',
        entryType: 'Multiple Entry',
        validity: '6 Months',
        stayPerVisit: 'Up to 6 months',
        processingTime: '15-20 working days',
        fee: 8500,
        currency: 'INR',
        governmentFeeDisplay: 'INR 8,500',
        badges: [
          { label: '6 Months validity', color: 'blue' },
          { label: 'Multiple entry', color: 'green' },
        ],
        requiredDocuments: [
          'Valid Passport',
          'Digital Photograph',
          'Bank Statements (6 months)',
          'Employment Letter',
          'Travel Itinerary',
          'Hotel Bookings',
        ],
        description:
          'Standard visitor visa for tourism, business visits, or visiting family and friends.',
        eligibility:
          'For Indian passport holders visiting the UK for short-term purposes.',
        whatToKnow:
          'You must show that you will leave the UK at the end of your visit and have enough money to support yourself.',
        learnMore:
          'Processing time may vary during peak seasons. Apply well in advance of your travel date.',
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
            },
            {
              name: 'phoneNumber',
              label: 'Phone Number',
              type: 'tel',
              required: true,
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
              name: 'purposeOfVisit',
              label: 'Purpose of Visit',
              type: 'select',
              required: true,
              options: [
                { label: 'Tourism', value: 'tourism' },
                { label: 'Business', value: 'business' },
                { label: 'Visiting Family/Friends', value: 'family' },
                { label: 'Medical Treatment', value: 'medical' },
              ],
            },
            {
              name: 'passportUpload',
              label: 'Passport Upload',
              type: 'file',
              required: true,
            },
            {
              name: 'photoUpload',
              label: 'Passport Photo',
              type: 'file',
              required: true,
            },
          ],
        },
      },
    ],
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
