import { asyncHandler } from '../../middleware/validation.js';
import Country from '../../models/admin/Country.js';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../../utils/response.js';

// Get all countries with pagination and filtering
export const getCountries = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    isActive,
    allowAsOrigin,
    allowAsDestination,
  } = req.query;

  // Build filter object
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { isoCode: { $regex: search, $options: 'i' } },
      { iso3Code: { $regex: search, $options: 'i' } },
    ];
  }
  if (isActive !== undefined) filter.isActive = isActive;
  if (allowAsOrigin !== undefined) filter.allowAsOrigin = allowAsOrigin;
  if (allowAsDestination !== undefined)
    filter.allowAsDestination = allowAsDestination;

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [countries, total] = await Promise.all([
    Country.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Country.countDocuments(filter),
  ]);

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  };

  return successResponse(res, 'Countries retrieved successfully', {
    countries,
    pagination,
  });
});

// Get single country by ID
export const getCountryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const country = await Country.findById(id).lean();
  if (!country) {
    return notFoundResponse(res, 'Country');
  }

  return successResponse(res, 'Country retrieved successfully', country);
});

// Create new country
export const createCountry = asyncHandler(async (req, res) => {
  try {
    // Check if country with same ISO code already exists
    const existingCountry = await Country.findOne({
      $or: [
        { isoCode: req.body.isoCode },
        { iso3Code: req.body.iso3Code },
        { name: req.body.name },
      ],
    });

    if (existingCountry) {
      return errorResponse(
        res,
        'Country with this ISO code or name already exists',
        [],
        409
      );
    }

    const country = new Country(req.body);
    await country.save();

    return successResponse(res, 'Country created successfully', country, 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        'Country with this information already exists',
        [],
        409
      );
    }
    throw error;
  }
});

// Update country
export const updateCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if another country with same ISO code exists (excluding current)
    if (req.body.isoCode || req.body.iso3Code || req.body.name) {
      const filter = { _id: { $ne: id } };
      const conditions = [];

      if (req.body.isoCode) conditions.push({ isoCode: req.body.isoCode });
      if (req.body.iso3Code) conditions.push({ iso3Code: req.body.iso3Code });
      if (req.body.name) conditions.push({ name: req.body.name });

      if (conditions.length > 0) {
        filter.$or = conditions;
        const existingCountry = await Country.findOne(filter);
        if (existingCountry) {
          return errorResponse(
            res,
            'Another country with this ISO code or name already exists',
            [],
            409
          );
        }
      }
    }

    const country = await Country.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!country) {
      return notFoundResponse(res, 'Country');
    }

    return successResponse(res, 'Country updated successfully', country);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        'Country with this information already exists',
        [],
        409
      );
    }
    throw error;
  }
});

// Delete country (soft delete by setting isActive to false)
export const deleteCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const country = await Country.findByIdAndUpdate(
    id,
    { isActive: false, updatedAt: new Date() },
    { new: true }
  );

  if (!country) {
    return notFoundResponse(res, 'Country');
  }

  return successResponse(res, 'Country deleted successfully', country);
});

// Hard delete country (permanent deletion)
export const hardDeleteCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const country = await Country.findByIdAndDelete(id);
  if (!country) {
    return notFoundResponse(res, 'Country');
  }

  return successResponse(res, 'Country permanently deleted');
});

// Toggle country status
export const toggleCountryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const country = await Country.findById(id);
  if (!country) {
    return notFoundResponse(res, 'Country');
  }

  country.isActive = !country.isActive;
  country.updatedAt = new Date();
  await country.save();

  return successResponse(
    res,
    `Country ${country.isActive ? 'activated' : 'deactivated'} successfully`,
    country
  );
});

// Get countries for origin selection (passport from)
export const getOriginCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find({
    isActive: true,
    allowAsOrigin: true,
  })
    .select('name isoCode iso3Code flagUrl dialCode')
    .sort({ name: 1 })
    .lean();

  return successResponse(
    res,
    'Origin countries retrieved successfully',
    countries
  );
});

// Get countries for destination selection (going to)
export const getDestinationCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find({
    isActive: true,
    allowAsDestination: true,
  })
    .select('name isoCode iso3Code flagUrl')
    .sort({ name: 1 })
    .lean();

  return successResponse(
    res,
    'Destination countries retrieved successfully',
    countries
  );
});
