import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AppointmentCenter from '../models/admin/AppointmentCenter.js';
import Country from '../models/admin/Country.js';
import DocumentRequirement from '../models/admin/DocumentRequirement.js';
import ProcessingTime from '../models/admin/ProcessingTime.js';
import ServiceFee from '../models/admin/ServiceFee.js';
import VisaRule from '../models/admin/VisaRule.js';
import VisaType from '../models/admin/VisaType.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await Country.deleteMany({});
    await VisaType.deleteMany({});
    await VisaRule.deleteMany({});
    await ProcessingTime.deleteMany({});
    await AppointmentCenter.deleteMany({});
    await ServiceFee.deleteMany({});
    await DocumentRequirement.deleteMany({});
    console.log('✅ Data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

// Seed Countries
const seedCountries = async () => {
  const countries = [
    {
      name: 'India',
      isoCode: 'IN',
      iso3Code: 'IND',
      flagUrl: 'https://flagcdn.com/in.svg',
      dialCode: '+91',
      currency: {
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: false,
      metadata: {
        continent: 'Asia',
        region: 'Southern Asia',
        subregion: 'Southern Asia',
      },
    },
    {
      name: 'United States',
      isoCode: 'US',
      iso3Code: 'USA',
      flagUrl: 'https://flagcdn.com/us.svg',
      dialCode: '+1',
      currency: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'North America',
        region: 'Northern America',
        subregion: 'Northern America',
      },
    },
    {
      name: 'United Kingdom',
      isoCode: 'GB',
      iso3Code: 'GBR',
      flagUrl: 'https://flagcdn.com/gb.svg',
      dialCode: '+44',
      currency: {
        code: 'GBP',
        symbol: '£',
        name: 'British Pound',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'Europe',
        region: 'Northern Europe',
        subregion: 'British Isles',
      },
    },
    {
      name: 'Canada',
      isoCode: 'CA',
      iso3Code: 'CAN',
      flagUrl: 'https://flagcdn.com/ca.svg',
      dialCode: '+1',
      currency: {
        code: 'CAD',
        symbol: 'C$',
        name: 'Canadian Dollar',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'North America',
        region: 'Northern America',
        subregion: 'Northern America',
      },
    },
    {
      name: 'Australia',
      isoCode: 'AU',
      iso3Code: 'AUS',
      flagUrl: 'https://flagcdn.com/au.svg',
      dialCode: '+61',
      currency: {
        code: 'AUD',
        symbol: 'A$',
        name: 'Australian Dollar',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'Oceania',
        region: 'Australia and New Zealand',
        subregion: 'Australia and New Zealand',
      },
    },
    {
      name: 'Germany',
      isoCode: 'DE',
      iso3Code: 'DEU',
      flagUrl: 'https://flagcdn.com/de.svg',
      dialCode: '+49',
      currency: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'Europe',
        region: 'Western Europe',
        subregion: 'Western Europe',
      },
    },
    {
      name: 'France',
      isoCode: 'FR',
      iso3Code: 'FRA',
      flagUrl: 'https://flagcdn.com/fr.svg',
      dialCode: '+33',
      currency: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'Europe',
        region: 'Western Europe',
        subregion: 'Western Europe',
      },
    },
    {
      name: 'Singapore',
      isoCode: 'SG',
      iso3Code: 'SGP',
      flagUrl: 'https://flagcdn.com/sg.svg',
      dialCode: '+65',
      currency: {
        code: 'SGD',
        symbol: 'S$',
        name: 'Singapore Dollar',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'Asia',
        region: 'South-Eastern Asia',
        subregion: 'South-Eastern Asia',
      },
    },
    {
      name: 'Japan',
      isoCode: 'JP',
      iso3Code: 'JPN',
      flagUrl: 'https://flagcdn.com/jp.svg',
      dialCode: '+81',
      currency: {
        code: 'JPY',
        symbol: '¥',
        name: 'Japanese Yen',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'Asia',
        region: 'Eastern Asia',
        subregion: 'Eastern Asia',
      },
    },
    {
      name: 'Thailand',
      isoCode: 'TH',
      iso3Code: 'THA',
      flagUrl: 'https://flagcdn.com/th.svg',
      dialCode: '+66',
      currency: {
        code: 'THB',
        symbol: '฿',
        name: 'Thai Baht',
      },
      isActive: true,
      allowAsOrigin: true,
      allowAsDestination: true,
      metadata: {
        continent: 'Asia',
        region: 'South-Eastern Asia',
        subregion: 'South-Eastern Asia',
      },
    },
  ];

  try {
    const createdCountries = await Country.insertMany(countries);
    console.log(`✅ ${createdCountries.length} countries seeded successfully`);
    return createdCountries;
  } catch (error) {
    console.error('❌ Error seeding countries:', error);
    return [];
  }
};

// Seed Visa Types
const seedVisaTypes = async () => {
  const visaTypes = [
    {
      name: 'Tourist Visa',
      code: 'TOURIST',
      description: 'For tourism and leisure purposes',
      category: 'tourist',
      isActive: true,
      metadata: {
        icon: '🏖️',
        color: '#61affe',
        sortOrder: 1,
        features: ['Single entry', '90 days validity', 'Extendable'],
      },
    },
    {
      name: 'Business Visa',
      code: 'BUSINESS',
      description: 'For business meetings, conferences, and trade activities',
      category: 'business',
      isActive: true,
      metadata: {
        icon: '💼',
        color: '#49cc90',
        sortOrder: 2,
        features: [
          'Multiple entry',
          '1 year validity',
          'Business activities allowed',
        ],
      },
    },
    {
      name: 'Student Visa',
      code: 'STUDENT',
      description: 'For educational purposes and academic studies',
      category: 'student',
      isActive: true,
      metadata: {
        icon: '🎓',
        color: '#fca130',
        sortOrder: 3,
        features: [
          'Course duration',
          'Part-time work allowed',
          'Academic activities',
        ],
      },
    },
    {
      name: 'Work Visa',
      code: 'WORK',
      description: 'For employment and professional work',
      category: 'work',
      isActive: true,
      metadata: {
        icon: '👷',
        color: '#f93e3e',
        sortOrder: 4,
        features: [
          'Employment authorization',
          'Long-term stay',
          'Family dependent',
        ],
      },
    },
    {
      name: 'Transit Visa',
      code: 'TRANSIT',
      description: 'For short-term transit through the country',
      category: 'transit',
      isActive: true,
      metadata: {
        icon: '✈️',
        color: '#50e3c2',
        sortOrder: 5,
        features: ['Short duration', 'Transit only', 'No work allowed'],
      },
    },
    {
      name: 'Medical Visa',
      code: 'MEDICAL',
      description: 'For medical treatment and healthcare purposes',
      category: 'medical',
      isActive: true,
      metadata: {
        icon: '🏥',
        color: '#9012fe',
        sortOrder: 6,
        features: [
          'Medical treatment',
          'Accompanying family',
          'Healthcare facilities',
        ],
      },
    },
  ];

  try {
    const createdVisaTypes = await VisaType.insertMany(visaTypes);
    console.log(`✅ ${createdVisaTypes.length} visa types seeded successfully`);
    return createdVisaTypes;
  } catch (error) {
    console.error('❌ Error seeding visa types:', error);
    return [];
  }
};

// Seed Processing Times
const seedProcessingTimes = async () => {
  const processingTimes = [
    {
      name: 'Standard Processing',
      code: 'STANDARD',
      description: 'Regular processing time',
      duration: {
        value: 5,
        min: 5,
        max: 10,
        unit: 'days',
      },
      serviceFee: {
        amount: 500,
        currency: 'INR',
      },
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Express Processing',
      code: 'EXPRESS',
      description: 'Faster processing for urgent applications',
      duration: {
        value: 2,
        min: 2,
        max: 4,
        unit: 'days',
      },
      serviceFee: {
        amount: 1500,
        currency: 'INR',
      },
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Urgent Processing',
      code: 'URGENT',
      description: 'Fastest processing for emergency situations',
      duration: {
        value: 1,
        min: 1,
        max: 2,
        unit: 'days',
      },
      serviceFee: {
        amount: 3000,
        currency: 'INR',
      },
      isActive: true,
      sortOrder: 3,
    },
  ];

  try {
    const createdProcessingTimes = await ProcessingTime.insertMany(
      processingTimes
    );
    console.log(
      `✅ ${createdProcessingTimes.length} processing times seeded successfully`
    );
    return createdProcessingTimes;
  } catch (error) {
    console.error('❌ Error seeding processing times:', error);
    return [];
  }
};

// Seed Service Fees
const seedServiceFees = async () => {
  const serviceFees = [
    {
      name: 'Standard Service Fee',
      type: 'global',
      fee: {
        amount: 1500,
        currency: 'INR',
      },
      description: 'Standard service fee for visa applications',
      isActive: true,
      applicableCountries: [],
      applicableVisaTypes: [],
    },
    {
      name: 'Premium Service Fee',
      type: 'global',
      fee: {
        amount: 2500,
        currency: 'INR',
      },
      description: 'Premium service with additional support',
      isActive: true,
      applicableCountries: [],
      applicableVisaTypes: [],
    },
  ];

  try {
    const createdServiceFees = await ServiceFee.insertMany(serviceFees);
    console.log(
      `✅ ${createdServiceFees.length} service fees seeded successfully`
    );
    return createdServiceFees;
  } catch (error) {
    console.error('❌ Error seeding service fees:', error);
    return [];
  }
};

// Seed Appointment Centers
const seedAppointmentCenters = async countries => {
  const india = countries.find(c => c.isoCode === 'IN');
  const appointmentCenters = [
    {
      name: 'Mumbai Visa Center',
      code: 'MUMBAI_VC',
      address: {
        street: '123 Marine Drive',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400002',
        country: india ? india._id : undefined,
      },
      contact: {
        phone: '+91-22-12345678',
        email: 'mumbai@visacenter.com',
        website: 'https://mumbai.visacenter.com',
      },
      operatingHours: {
        monday: { open: '09:00', close: '17:00', isOpen: true },
        tuesday: { open: '09:00', close: '17:00', isOpen: true },
        wednesday: { open: '09:00', close: '17:00', isOpen: true },
        thursday: { open: '09:00', close: '17:00', isOpen: true },
        friday: { open: '09:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '13:00', isOpen: true },
        sunday: { open: '00:00', close: '00:00', isOpen: false },
      },
      capacity: {
        dailySlots: 50,
        slotDuration: 30,
        maxAdvanceBooking: 30,
      },
      services: ['Biometric collection', 'Document verification', 'Interview'],
      isActive: true,
    },
    {
      name: 'Delhi Visa Center',
      code: 'DELHI_VC',
      address: {
        street: '456 Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: india ? india._id : undefined,
      },
      contact: {
        phone: '+91-11-87654321',
        email: 'delhi@visacenter.com',
        website: 'https://delhi.visacenter.com',
      },
      operatingHours: {
        monday: { open: '09:00', close: '17:00', isOpen: true },
        tuesday: { open: '09:00', close: '17:00', isOpen: true },
        wednesday: { open: '09:00', close: '17:00', isOpen: true },
        thursday: { open: '09:00', close: '17:00', isOpen: true },
        friday: { open: '09:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '13:00', isOpen: true },
        sunday: { open: '00:00', close: '00:00', isOpen: false },
      },
      capacity: {
        dailySlots: 60,
        slotDuration: 30,
        maxAdvanceBooking: 30,
      },
      services: [
        'Biometric collection',
        'Document verification',
        'Interview',
        'Express processing',
      ],
      isActive: true,
    },
  ];

  try {
    const createdCenters = await AppointmentCenter.insertMany(
      appointmentCenters
    );
    console.log(
      `✅ ${createdCenters.length} appointment centers seeded successfully`
    );
    return createdCenters;
  } catch (error) {
    console.error('❌ Error seeding appointment centers:', error);
    return [];
  }
};

// Seed Document Requirements
const seedDocumentRequirements = async () => {
  const documentRequirements = [
    {
      name: 'Passport',
      code: 'PASSPORT',
      description: 'Valid passport with minimum 6 months validity',
      category: 'passport',
      isRequired: true,
      fileSpecifications: {
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSize: 5,
        maxFiles: 1,
      },
      validationRules: {
        minValidityMonths: 6,
        requireBlankPages: 2,
      },
      isActive: true,
    },
    {
      name: 'Passport Size Photograph',
      code: 'PHOTO',
      description: 'Recent passport size photograph',
      category: 'photo',
      isRequired: true,
      fileSpecifications: {
        allowedFormats: ['jpg', 'jpeg', 'png'],
        maxSize: 2,
        maxFiles: 2,
      },
      validationRules: {
        dimensions: '35mm x 45mm',
        background: 'white',
        faceCoverage: '70%',
      },
      isActive: true,
    },
    {
      name: 'Bank Statement',
      code: 'BANK_STATEMENT',
      description: 'Last 3 months bank statements',
      category: 'financial',
      isRequired: true,
      fileSpecifications: {
        allowedFormats: ['pdf'],
        maxSize: 10,
        maxFiles: 3,
      },
      validationRules: {
        minMonths: 3,
        requireStamped: true,
      },
      isActive: true,
    },
    {
      name: 'Employment Letter',
      code: 'EMPLOYMENT_LETTER',
      description: 'Current employment verification letter',
      category: 'employment',
      isRequired: false,
      fileSpecifications: {
        allowedFormats: ['pdf', 'doc', 'docx'],
        maxSize: 5,
        maxFiles: 1,
      },
      validationRules: {
        requireCompanyStamp: true,
        requireContactInfo: true,
      },
      isActive: true,
    },
    {
      name: 'Travel Insurance',
      code: 'TRAVEL_INSURANCE',
      description: 'Travel insurance covering the entire trip',
      category: 'insurance',
      isRequired: true,
      fileSpecifications: {
        allowedFormats: ['pdf'],
        maxSize: 5,
        maxFiles: 1,
      },
      validationRules: {
        minCoverage: 30000,
        requireRepatriation: true,
      },
      isActive: true,
    },
  ];

  try {
    const createdRequirements = await DocumentRequirement.insertMany(
      documentRequirements
    );
    console.log(
      `✅ ${createdRequirements.length} document requirements seeded successfully`
    );
    return createdRequirements;
  } catch (error) {
    console.error('❌ Error seeding document requirements:', error);
    return [];
  }
};

// Seed Visa Rules
const seedVisaRules = async (countries, visaTypes) => {
  const visaRules = [];

  // Get destination countries (excluding India)
  const destinationCountries = countries.filter(c => c.allowAsDestination);
  const touristVisa = visaTypes.find(vt => vt.category === 'tourist');
  const businessVisa = visaTypes.find(vt => vt.category === 'business');
  const studentVisa = visaTypes.find(vt => vt.category === 'student');

  // Create visa rules for each destination from India
  destinationCountries.forEach(destCountry => {
    // Tourist Visa Rules
    if (touristVisa) {
      visaRules.push({
        fromCountry: countries.find(c => c.isoCode === 'IN')._id,
        toCountry: destCountry._id,
        visaType: touristVisa._id,
        isVisaAvailable: true,
        validity: {
          value: 1,
          unit: 'years',
        },
        entryType: 'multiple',
        governmentFee: {
          amount: Math.floor(Math.random() * 5000) + 2000, // Random fee between 2000-7000
          currency: 'INR',
        },
        processingTimeRange: {
          min: 5,
          max: 10,
          unit: 'days',
        },
        requirements: {
          minimumValidityRequired: 6,
          blankPagesRequired: 2,
          biometricRequired: Math.random() > 0.5,
          interviewRequired: Math.random() > 0.7,
        },
        isActive: true,
      });
    }

    // Business Visa Rules
    if (businessVisa) {
      visaRules.push({
        fromCountry: countries.find(c => c.isoCode === 'IN')._id,
        toCountry: destCountry._id,
        visaType: businessVisa._id,
        isVisaAvailable: true,
        validity: {
          value: 2,
          unit: 'years',
        },
        entryType: 'multiple',
        governmentFee: {
          amount: Math.floor(Math.random() * 8000) + 5000, // Random fee between 5000-13000
          currency: 'INR',
        },
        processingTimeRange: {
          min: 7,
          max: 15,
          unit: 'days',
        },
        requirements: {
          minimumValidityRequired: 6,
          blankPagesRequired: 2,
          biometricRequired: true,
          interviewRequired: Math.random() > 0.3,
        },
        isActive: true,
      });
    }

    // Student Visa Rules (for some countries)
    if (
      studentVisa &&
      ['US', 'GB', 'CA', 'AU', 'DE'].includes(destCountry.isoCode)
    ) {
      visaRules.push({
        fromCountry: countries.find(c => c.isoCode === 'IN')._id,
        toCountry: destCountry._id,
        visaType: studentVisa._id,
        isVisaAvailable: true,
        validity: {
          value: 1,
          unit: 'years',
        },
        entryType: 'multiple',
        governmentFee: {
          amount: Math.floor(Math.random() * 10000) + 8000, // Random fee between 8000-18000
          currency: 'INR',
        },
        processingTimeRange: {
          min: 10,
          max: 20,
          unit: 'days',
        },
        requirements: {
          minimumValidityRequired: 6,
          blankPagesRequired: 2,
          biometricRequired: true,
          interviewRequired: true,
        },
        isActive: true,
      });
    }
  });

  try {
    const createdVisaRules = await VisaRule.insertMany(visaRules);
    console.log(`✅ ${createdVisaRules.length} visa rules seeded successfully`);
    return createdVisaRules;
  } catch (error) {
    console.error('❌ Error seeding visa rules:', error);
    return [];
  }
};

// Main seeding function
const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    await clearData();

    // Seed data in order
    const countries = await seedCountries();
    const visaTypes = await seedVisaTypes();
    const processingTimes = await seedProcessingTimes();
    const serviceFees = await seedServiceFees();
    const appointmentCenters = await seedAppointmentCenters(countries);
    const documentRequirements = await seedDocumentRequirements();
    const visaRules = await seedVisaRules(countries, visaTypes);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Countries: ${countries.length}`);
    console.log(`   Visa Types: ${visaTypes.length}`);
    console.log(`   Processing Times: ${processingTimes.length}`);
    console.log(`   Service Fees: ${serviceFees.length}`);
    console.log(`   Appointment Centers: ${appointmentCenters.length}`);
    console.log(`   Document Requirements: ${documentRequirements.length}`);
    console.log(`   Visa Rules: ${visaRules.length}`);

    console.log('\n🚀 You can now test the API endpoints with this data!');
    console.log('   Health Check: GET /api/v2/health');
    console.log('   Countries: GET /api/v2/admin/countries');
    console.log('   Visa Types: GET /api/v2/admin/visa-types');
    console.log('   Visa Rules: GET /api/v2/admin/visa-rules');
    console.log('   Documentation: GET /api/v2/docs');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed script
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedData();
}

export default seedData;
