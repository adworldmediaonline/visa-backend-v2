import * as Yup from 'yup';

const cambodiaYupSchema = Yup.object().shape({
  passportDateOfIssue: Yup.date().required('Date Of issue is required'),
  dateOfBirth: Yup.date()
    .required('Date Of birth is required')
    .max(
      Yup.ref('passportDateOfIssue'),
      'Date of birth must be earlier than the date of issue'
    ),

  personalDetails: Yup.object().shape({
    familyName: Yup.string().required('Family name is required'),
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string(),

    countryOfBirth: Yup.string().required('Country of birth is required'),
    countryOfCitizenship: Yup.string().required(
      'Country of citizenship is required'
    ),
    gender: Yup.string().required('Gender is required'),
  }),

  passportDetails: Yup.object().shape({
    passportCountry: Yup.string(),
    passportNumber: Yup.string().required('Passport number is required'),

    passportExpiryDate: Yup.date()
      .min(
        new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000),
        'Passport expiry must be valid at least 6 months from Intended Date of Entry.'
      )
      .required('Passport expiry date is required'),
  }),

  contactDetails: Yup.object().shape({
    emailAddress: Yup.string()
      .email('Invalid email address')
      .required('Email address is required'),
    confirmEmailAddress: Yup.string()
      .oneOf([Yup.ref('emailAddress'), null], 'Emails must match')
      .required('Confirm email address is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be a valid 10-digit number')
      .required('Mobile is required'),
  }),

  travelDetails: Yup.object().shape({
    portOfEntry: Yup.string().required('Port of entry is required'),
    proposedDateOfEntry: Yup.date()
      .min(
        new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        'Proposed date of entry must be at least 5 days from today'
      )
      .required('Proposed date of entry is required'),
    touristPurpose: Yup.string().required('Tourist purpose is required'),
    purposeOfVisit: Yup.string().when('touristPurpose', {
      is: 'no',
      then: schema => schema.required('Purpose of visit is required'),
      otherwise: schema => schema,
    }),
  }),

  termsAndConditions: Yup.boolean()
    .oneOf([true])
    .required('Terms and conditions is required'),
  declareInformation: Yup.boolean()
    .oneOf([true])
    .required('declare information is required'),
});
const indonesiaYupSchema = Yup.object().shape({
  passportDateOfIssue: Yup.date()
    .required('Date Of issue is required')
    .min(Yup.ref('dateOfBirth'), 'Date of issue must be after date of birth'),
  dateOfBirth: Yup.date()
    .required('Date Of birth is required')
    .max(
      new Date(),
      'Date of birth must be a past date and earlier than date of issue'
    ),
  countryOfCitizenship: Yup.string().required(
    'Country of citizenship is required'
  ),
  passportCountry: Yup.string().oneOf(
    [Yup.ref('countryOfCitizenship'), null],
    'Passport country must be the same as country of citizenship'
  ),

  personalDetails: Yup.object().shape({
    surname: Yup.string().required('Family name is required'),
    givenName: Yup.string().required('First name is required'),
    motherGivenName: Yup.string(),
    gender: Yup.string().required('Gender is required'),
    countryOfBirth: Yup.string().required('Country of birth is required'),
    placeOfBirth: Yup.string().required('Country of citizenship is required'),
  }),

  passportDetails: Yup.object().shape({
    passportNumber: Yup.string().required('Passport number is required'),
    passportExpiryDate: Yup.date()
      .min(
        new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000),
        'Passport expiry must be valid at least 6 months from Intended Date of Entry.'
      )
      .required('Passport expiry date is required'),
  }),

  contactDetails: Yup.object().shape({
    emailAddress: Yup.string()
      .email('Invalid email address')
      .required('Email address is required'),
    confirmEmailAddress: Yup.string()
      .oneOf([Yup.ref('emailAddress'), null], 'Emails must match')
      .required('Confirm email address is required'),
    phoneNumber: Yup.string().required('Mobile is required'),
  }),

  travelDetails: Yup.object().shape({
    intendedDateOfEntry: Yup.date()
      .min(new Date(), 'Intended Date Of entry must be a future date')
      .required('Intended Date Of entry is required'),
    intendedDateOfExit: Yup.date()
      .min(
        Yup.ref('intendedDateOfEntry'),
        'Intended Date Of exit must be after Intended Date Of entry'
      )
      .required('Intended Date Of exit is required'),
    accommodationType: Yup.string().required('Accommodation Type is required'),
    accommodationAddress: Yup.string().required(
      'Accommodation Address is required'
    ),
    accommodationProvince: Yup.string().required(
      'Accommodation Address is required'
    ),
    travelingWithMinor: Yup.string()
      .oneOf(['yes', 'no'], 'Please select either "yes" or "no"')
      .required('Traveling with minor is required'),
    numberOfMinor: Yup.string().when('travelingWithMinor', {
      is: 'yes',
      then: schema => schema.required('Number of minor is required'),
      otherwise: schema => schema,
    }),
    minorInformation: Yup.array().when('travelingWithMinor', {
      is: 'yes',
      then: schema =>
        schema.of(
          Yup.object().shape({
            minorPassportNumber: Yup.string().required(),
          })
        ),
      otherwise: schema => schema,
    }),
  }),

  termsAndConditions: Yup.boolean()
    .oneOf([true])
    .required('Terms and conditions is required'),
  declareInformation: Yup.boolean()
    .oneOf([true])
    .required('declare information is required'),
});

const omanYupSchema = Yup.object().shape({
  personalDetails: Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string(),
    nationality: Yup.string().required('Nationality is required'),
    entryType: Yup.string().required('Entry Type is required'),
    gender: Yup.string().required('Gender is required'),
    passportNumber: Yup.string().required('Passport Number is required'),
    passportColouredPhoto: Yup.mixed()
      .required('Passport Coloured Photo is required')
      .test(
        'file-type',
        'Only image files are allowed',
        value => value && value.type.startsWith('image/')
      ),
    profilePhoto: Yup.mixed()
      .required('Profile Photo is required')
      .test(
        'file-type',
        'Only image files are allowed',
        value => value && value.type.startsWith('image/')
      ),
  }),
  generalDetails: Yup.object().shape({
    currentAddress: Yup.string().required('Current Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip Code is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    whatsappNumber: Yup.string().required('WhatsApp Number is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    purposeOfVisit: Yup.string().required('Purpose of Visit is required'),
  }),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of Birth cannot be a future date')
    .required('Date of Birth is required'),
  arrivalDate: Yup.date()
    .min(Yup.ref('dateOfBirth'), 'Arrival Date must be after Date of Birth')
    .required('Arrival Date is required'),
  passportExpiryDate: Yup.date()
    .min(
      Yup.ref('arrivalDate'),
      'Passport Expiry Date must be after Arrival Date'
    )
    .test(
      'is-expiry-date-valid',
      'Passport Expiry Date must be at least 180 days after Arrival Date',
      function (value) {
        const arrivalDate = this.parent.arrivalDate;
        const minExpiryDate = new Date(arrivalDate);
        minExpiryDate.setDate(arrivalDate.getDate() + 180);
        return value && value >= minExpiryDate;
      }
    )
    .required('Passport Expiry Date is required'),
  interested: Yup.array().of(Yup.string()),
  termsAndConditions: Yup.boolean().oneOf(
    [true],
    'You must accept the Terms and Conditions'
  ),
});

export { cambodiaYupSchema, omanYupSchema, indonesiaYupSchema };
