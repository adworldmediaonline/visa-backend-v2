import dotenv from 'dotenv';
import dbConnect from '../../config/dbConnection.js';
import VisaRule from '../models/visaRule.model.js';

dotenv.config();

const auToUkRule = {
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

  // embassy registration only show if visaRequired is false this is for the ui
  // if visaRequired is true, then embassyRegistration will not be shown
  embassyRegistration: {
    fee: 100,
    description: 'Embassy registration recommended',
    isDefault: false,
  },

  visaOptions: [
    {
      name: 'united kingdom ETA',
      visaType: 'ETA',
      whatToKnow:
        'The UK ETA lets you travel to the UK multiple times for up to 6 months at a time, with a validity of 2 years.',
      learnMore:
        'You do not need to apply for an ETA if you already have a UK visa that allows you to come to the UK.',

      validityOptions: [
        {
          name: 'valid for 6 months',
          validityTime: '6 months',
          entryType: 'multiple entry',
          fee: 100,
          isDefault: true,
        },
        {
          name: 'valid for 1 year',
          validityTime: '1 year',
          entryType: 'single entry',
          fee: 200,
          isDefault: false,
        },

        {
          name: 'valid for 2 years',
          validityTime: '2 years',
          entryType: 'multiple entry',
          fee: 300,
          isDefault: false,
        },
      ],

      processingOptions: [
        {
          name: 'standard',
          fee: 50,
          processingTime: '24 hours',
          description: 'Standard processing time for your visa application',
          isDefault: true,
        },
        {
          name: 'rush',
          fee: 100,
          processingTime: '4 hours',
          description: 'Faster processing for urgent travel needs',
          isDefault: false,
        },
        {
          name: 'super rush',
          fee: 150,
          processingTime: '1 hour',
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
            options: [],
          },
          {
            name: 'passportNumber',
            label: 'Passport Number',
            type: 'text',
            required: true,
            placeholder: 'Enter passport number',
            options: [],
          },
          {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            required: true,
            options: [],
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'Enter your email address',
            options: [],
          },
          {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
              {
                label: 'Male',
                value: 'male',
              },
              {
                label: 'Female',
                value: 'female',
              },
              {
                label: 'Other',
                value: 'other',
              },
            ],
          },
          {
            name: 'passportUpload',
            label: 'Passport Upload',
            type: 'file',
            required: true,
            options: [],
          },
        ],
      },
      isActive: true,
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
  isActive: true,
};

// Australia → New Zealand (visa not required)
const auToNzRule = {
  passportCountry: {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
  },
  destinationCountry: {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
  },

  visaRequired: false,

  embassyRegistration: {
    fee: 1000,
    description: 'Embassy registration (optional)',
    isDefault: true,
  },

  visaOptions: [],

  generalInfo: {
    description:
      'Australian passport holders do not require a visa for short visits to New Zealand.',
    tips: ['Carry a valid passport', 'Return/onward ticket may be required'],
    importantNotes: ['Subject to New Zealand entry requirements'],
  },
  isActive: true,
};

const visaRulesEntries = [auToUkRule, auToNzRule];

async function seedVisaRules() {
  try {
    // Connect to database
    await dbConnect();
    console.log('Connected to database');

    // Upsert visa rules without deleting existing rules
    const ops = visaRulesEntries.map(rule => ({
      updateOne: {
        filter: {
          'passportCountry.code': rule.passportCountry.code,
          'destinationCountry.code': rule.destinationCountry.code,
        },
        update: { $set: rule },
        upsert: true,
      },
    }));

    const result = await VisaRule.bulkWrite(ops);
    console.log(
      'Upserted visa rules:',
      JSON.stringify(result.result || result, null, 2)
    );

    const saved = await VisaRule.find({
      'passportCountry.code': { $in: ['AU'] },
      'destinationCountry.code': { $in: ['GB', 'NZ'] },
    });
    saved.forEach(rule => {
      console.log(
        `- ${rule.passportCountry.name} → ${rule.destinationCountry.name}: ${rule.visaOptions.length} visa options (visaRequired=${rule.visaRequired})`
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

export { seedVisaRules, visaRulesEntries };
