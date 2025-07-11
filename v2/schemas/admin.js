import { z } from 'zod';
import {
  currencyCodeSchema,
  emailSchema,
  objectIdSchema,
  paginationSchema,
  priceSchema,
  urlSchema,
} from './common.js';

// Country schemas
export const createCountrySchema = z.object({
  name: z.string().min(1).max(100).trim(),
  isoCode: z.string().length(2).toUpperCase(),
  iso3Code: z.string().length(3).toUpperCase(),
  flagUrl: urlSchema,
  dialCode: z.string().min(1).max(10),
  currency: z.object({
    code: currencyCodeSchema,
    symbol: z.string().min(1).max(5),
    name: z.string().min(1).max(50),
  }),
  isActive: z.boolean().default(true),
  allowAsOrigin: z.boolean().default(true),
  allowAsDestination: z.boolean().default(true),
  metadata: z
    .object({
      continent: z.string().optional(),
      region: z.string().optional(),
      subregion: z.string().optional(),
    })
    .optional(),
});

export const updateCountrySchema = createCountrySchema.partial();

export const countryParamsSchema = z.object({
  id: objectIdSchema,
});

export const countryQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  allowAsOrigin: z.boolean().optional(),
  allowAsDestination: z.boolean().optional(),
});

// VisaType schemas
export const createVisaTypeSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  code: z.string().min(1).max(20).toUpperCase().trim(),
  description: z.string().min(1).max(500),
  category: z.enum([
    'tourist',
    'business',
    'transit',
    'student',
    'work',
    'medical',
    'other',
  ]),
  isActive: z.boolean().default(true),
  metadata: z
    .object({
      icon: z.string().optional(),
      color: z.string().optional(),
      sortOrder: z.number().int().min(0).default(0),
      features: z.array(z.string()).optional(),
    })
    .optional(),
});

export const updateVisaTypeSchema = createVisaTypeSchema.partial();

// VisaRule schemas
export const createVisaRuleSchema = z.object({
  fromCountry: objectIdSchema,
  toCountry: objectIdSchema,
  visaType: objectIdSchema,
  isVisaAvailable: z.boolean().default(true),
  validity: z.object({
    value: z.number().int().min(1),
    unit: z.enum(['days', 'months', 'years']),
  }),
  entryType: z.enum(['single', 'multiple', 'double']).default('single'),
  governmentFee: z.object({
    amount: priceSchema,
    currency: currencyCodeSchema,
  }),
  processingTimeRange: z.object({
    min: z.number().int().min(1),
    max: z.number().int().min(1),
    unit: z.enum(['hours', 'days', 'weeks']).default('days'),
  }),
  requirements: z
    .object({
      minimumValidityRequired: z.number().int().min(0).default(6),
      blankPagesRequired: z.number().int().min(0).default(2),
      biometricRequired: z.boolean().default(false),
      interviewRequired: z.boolean().default(false),
    })
    .optional(),
  isActive: z.boolean().default(true),
  metadata: z
    .object({
      description: z.string().optional(),
      notes: z.string().optional(),
      lastUpdatedBy: objectIdSchema.optional(),
    })
    .optional(),
});

export const updateVisaRuleSchema = createVisaRuleSchema.partial();

// ProcessingTime schemas
export const createProcessingTimeSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  code: z.string().min(1).max(20).toUpperCase().trim(),
  description: z.string().min(1).max(500),
  duration: z.object({
    value: z.number().int().min(1),
    unit: z.enum(['hours', 'days', 'weeks']).default('days'),
  }),
  serviceFee: z.object({
    amount: priceSchema,
    currency: currencyCodeSchema,
  }),
  isGlobal: z.boolean().default(true),
  applicableVisaRules: z.array(objectIdSchema).optional(),
  isActive: z.boolean().default(true),
  metadata: z
    .object({
      priority: z.number().int().default(0),
      color: z.string().optional(),
      icon: z.string().optional(),
      features: z.array(z.string()).optional(),
    })
    .optional(),
});

export const updateProcessingTimeSchema = createProcessingTimeSchema.partial();

// AppointmentCenter schemas
export const createAppointmentCenterSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  code: z.string().min(1).max(20).toUpperCase().trim(),
  address: z.object({
    street: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
    country: objectIdSchema,
  }),
  contact: z
    .object({
      phone: z.string().optional(),
      email: emailSchema.optional(),
      website: urlSchema.optional(),
    })
    .optional(),
  operatingHours: z
    .object({
      monday: z
        .object({
          isOpen: z.boolean().default(true),
          openTime: z.string().optional(),
          closeTime: z.string().optional(),
        })
        .optional(),
      tuesday: z
        .object({
          isOpen: z.boolean().default(true),
          openTime: z.string().optional(),
          closeTime: z.string().optional(),
        })
        .optional(),
      wednesday: z
        .object({
          isOpen: z.boolean().default(true),
          openTime: z.string().optional(),
          closeTime: z.string().optional(),
        })
        .optional(),
      thursday: z
        .object({
          isOpen: z.boolean().default(true),
          openTime: z.string().optional(),
          closeTime: z.string().optional(),
        })
        .optional(),
      friday: z
        .object({
          isOpen: z.boolean().default(true),
          openTime: z.string().optional(),
          closeTime: z.string().optional(),
        })
        .optional(),
      saturday: z
        .object({
          isOpen: z.boolean().default(false),
          openTime: z.string().optional(),
          closeTime: z.string().optional(),
        })
        .optional(),
      sunday: z
        .object({
          isOpen: z.boolean().default(false),
          openTime: z.string().optional(),
          closeTime: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  location: z
    .object({
      coordinates: z.array(z.number()).length(2).optional(),
      type: z.enum(['Point']).default('Point'),
    })
    .optional(),
  isActive: z.boolean().default(true),
  capacity: z
    .object({
      slotsPerDay: z.number().int().min(1).default(50),
      slotDuration: z.number().int().min(15).default(30),
    })
    .optional(),
  metadata: z
    .object({
      facilities: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

export const updateAppointmentCenterSchema =
  createAppointmentCenterSchema.partial();

// ServiceFee schemas
export const createServiceFeeSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  type: z
    .enum(['global', 'country_specific', 'visa_type_specific'])
    .default('global'),
  applicableTo: z
    .object({
      countries: z.array(objectIdSchema).optional(),
      visaTypes: z.array(objectIdSchema).optional(),
    })
    .optional(),
  fee: z.object({
    amount: priceSchema,
    currency: currencyCodeSchema,
    isPercentage: z.boolean().default(false),
    percentageOf: z.enum(['government_fee', 'total_amount']).optional(),
  }),
  tax: z
    .object({
      isApplicable: z.boolean().default(true),
      type: z.enum(['gst', 'vat', 'sales_tax', 'other']).default('gst'),
      rate: z.number().min(0).max(100).default(18),
      isInclusive: z.boolean().default(false),
    })
    .optional(),
  isActive: z.boolean().default(true),
  metadata: z
    .object({
      description: z.string().optional(),
      terms: z.string().optional(),
      lastUpdatedBy: objectIdSchema.optional(),
    })
    .optional(),
});

export const updateServiceFeeSchema = createServiceFeeSchema.partial();

// DocumentRequirement schemas
export const createDocumentRequirementSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  code: z.string().min(1).max(20).toUpperCase().trim(),
  description: z.string().min(1).max(1000),
  category: z.enum([
    'identity',
    'financial',
    'travel',
    'employment',
    'education',
    'medical',
    'other',
  ]),
  type: z.enum(['mandatory', 'optional', 'conditional']).default('mandatory'),
  applicableTo: z
    .object({
      visaRules: z.array(objectIdSchema).optional(),
      countries: z.array(objectIdSchema).optional(),
      visaTypes: z.array(objectIdSchema).optional(),
    })
    .optional(),
  conditions: z
    .object({
      age: z
        .object({
          min: z.number().int().min(0).optional(),
          max: z.number().int().max(120).optional(),
        })
        .optional(),
      travelPurpose: z.array(z.string()).optional(),
      nationality: z.array(objectIdSchema).optional(),
      customConditions: z.array(z.string()).optional(),
    })
    .optional(),
  specifications: z
    .object({
      fileFormats: z.array(z.string()).default(['pdf', 'jpg', 'jpeg', 'png']),
      maxFileSize: z.number().int().min(1).default(5242880),
      dimensions: z
        .object({
          width: z.number().int().min(1).optional(),
          height: z.number().int().min(1).optional(),
          unit: z.enum(['px', 'mm', 'inch']).default('px'),
        })
        .optional(),
      quality: z.string().optional(),
      colorRequirement: z.enum(['color', 'black_white', 'any']).default('any'),
    })
    .optional(),
  validityRequirements: z
    .object({
      minimumValidity: z
        .object({
          value: z.number().int().min(0).optional(),
          unit: z.enum(['days', 'months', 'years']).default('months'),
        })
        .optional(),
      issuedWithin: z
        .object({
          value: z.number().int().min(0).optional(),
          unit: z.enum(['days', 'months', 'years']).default('months'),
        })
        .optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
  metadata: z
    .object({
      sampleUrl: urlSchema.optional(),
      helpText: z.string().optional(),
      sortOrder: z.number().int().default(0),
      icon: z.string().optional(),
    })
    .optional(),
});

export const updateDocumentRequirementSchema =
  createDocumentRequirementSchema.partial();
