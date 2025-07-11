import { asyncHandler } from '../../middleware/validation.js';
import Country from '../../models/admin/Country.js';
import VisaRule from '../../models/admin/VisaRule.js';
import VisaType from '../../models/admin/VisaType.js';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../../utils/response.js';

// Get all visa rules with pagination and filtering
export const getVisaRules = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    isActive,
    isVisaAvailable,
    fromCountry,
    toCountry,
    visaType,
  } = req.query;

  // Build filter object
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive;
  if (isVisaAvailable !== undefined) filter.isVisaAvailable = isVisaAvailable;
  if (fromCountry) filter.fromCountry = fromCountry;
  if (toCountry) filter.toCountry = toCountry;
  if (visaType) filter.visaType = visaType;

  // Execute query with pagination and population
  const skip = (page - 1) * limit;
  const [visaRules, total] = await Promise.all([
    VisaRule.find(filter)
      .populate('fromCountry', 'name isoCode flagUrl')
      .populate('toCountry', 'name isoCode flagUrl')
      .populate('visaType', 'name code category')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    VisaRule.countDocuments(filter),
  ]);

  // Apply search filter if provided (after population)
  let filteredRules = visaRules;
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filteredRules = visaRules.filter(
      rule =>
        searchRegex.test(rule.fromCountry?.name) ||
        searchRegex.test(rule.toCountry?.name) ||
        searchRegex.test(rule.visaType?.name) ||
        searchRegex.test(rule.entryType)
    );
  }

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  };

  return successResponse(res, 'Visa rules retrieved successfully', {
    visaRules: filteredRules,
    pagination,
  });
});

// Get single visa rule by ID
export const getVisaRuleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaRule = await VisaRule.findById(id)
    .populate('fromCountry', 'name isoCode iso3Code flagUrl currency')
    .populate('toCountry', 'name isoCode iso3Code flagUrl currency')
    .populate('visaType', 'name code description category')
    .lean();

  if (!visaRule) {
    return notFoundResponse(res, 'Visa rule');
  }

  return successResponse(res, 'Visa rule retrieved successfully', visaRule);
});

// Create new visa rule
export const createVisaRule = asyncHandler(async (req, res) => {
  try {
    // Validate that fromCountry, toCountry, and visaType exist
    const [fromCountry, toCountry, visaType] = await Promise.all([
      Country.findById(req.body.fromCountry),
      Country.findById(req.body.toCountry),
      VisaType.findById(req.body.visaType),
    ]);

    if (!fromCountry) {
      return errorResponse(res, 'From country not found', [], 404);
    }
    if (!toCountry) {
      return errorResponse(res, 'To country not found', [], 404);
    }
    if (!visaType) {
      return errorResponse(res, 'Visa type not found', [], 404);
    }

    // Check if visa rule already exists for this combination
    const existingRule = await VisaRule.findOne({
      fromCountry: req.body.fromCountry,
      toCountry: req.body.toCountry,
      visaType: req.body.visaType,
    });

    if (existingRule) {
      return errorResponse(
        res,
        'Visa rule already exists for this country combination and visa type',
        [],
        409
      );
    }

    const visaRule = new VisaRule(req.body);
    await visaRule.save();

    // Populate the created rule for response
    await visaRule.populate([
      { path: 'fromCountry', select: 'name isoCode flagUrl' },
      { path: 'toCountry', select: 'name isoCode flagUrl' },
      { path: 'visaType', select: 'name code category' },
    ]);

    return successResponse(
      res,
      'Visa rule created successfully',
      visaRule,
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        'Visa rule with this combination already exists',
        [],
        409
      );
    }
    throw error;
  }
});

// Update visa rule
export const updateVisaRule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // If updating country or visa type references, validate they exist
    if (req.body.fromCountry || req.body.toCountry || req.body.visaType) {
      const validationPromises = [];

      if (req.body.fromCountry) {
        validationPromises.push(Country.findById(req.body.fromCountry));
      }
      if (req.body.toCountry) {
        validationPromises.push(Country.findById(req.body.toCountry));
      }
      if (req.body.visaType) {
        validationPromises.push(VisaType.findById(req.body.visaType));
      }

      const results = await Promise.all(validationPromises);
      let index = 0;

      if (req.body.fromCountry && !results[index++]) {
        return errorResponse(res, 'From country not found', [], 404);
      }
      if (req.body.toCountry && !results[index++]) {
        return errorResponse(res, 'To country not found', [], 404);
      }
      if (req.body.visaType && !results[index++]) {
        return errorResponse(res, 'Visa type not found', [], 404);
      }
    }

    // Check for duplicate combination if key fields are being updated
    if (req.body.fromCountry || req.body.toCountry || req.body.visaType) {
      const currentRule = await VisaRule.findById(id);
      if (!currentRule) {
        return notFoundResponse(res, 'Visa rule');
      }

      const newFromCountry = req.body.fromCountry || currentRule.fromCountry;
      const newToCountry = req.body.toCountry || currentRule.toCountry;
      const newVisaType = req.body.visaType || currentRule.visaType;

      const existingRule = await VisaRule.findOne({
        _id: { $ne: id },
        fromCountry: newFromCountry,
        toCountry: newToCountry,
        visaType: newVisaType,
      });

      if (existingRule) {
        return errorResponse(
          res,
          'Another visa rule already exists for this country combination and visa type',
          [],
          409
        );
      }
    }

    const visaRule = await VisaRule.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate([
      { path: 'fromCountry', select: 'name isoCode flagUrl' },
      { path: 'toCountry', select: 'name isoCode flagUrl' },
      { path: 'visaType', select: 'name code category' },
    ]);

    if (!visaRule) {
      return notFoundResponse(res, 'Visa rule');
    }

    return successResponse(res, 'Visa rule updated successfully', visaRule);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        'Visa rule with this combination already exists',
        [],
        409
      );
    }
    throw error;
  }
});

// Delete visa rule (soft delete)
export const deleteVisaRule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaRule = await VisaRule.findByIdAndUpdate(
    id,
    { isActive: false, updatedAt: new Date() },
    { new: true }
  ).populate([
    { path: 'fromCountry', select: 'name isoCode flagUrl' },
    { path: 'toCountry', select: 'name isoCode flagUrl' },
    { path: 'visaType', select: 'name code category' },
  ]);

  if (!visaRule) {
    return notFoundResponse(res, 'Visa rule');
  }

  return successResponse(res, 'Visa rule deleted successfully', visaRule);
});

// Hard delete visa rule
export const hardDeleteVisaRule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaRule = await VisaRule.findByIdAndDelete(id);
  if (!visaRule) {
    return notFoundResponse(res, 'Visa rule');
  }

  return successResponse(res, 'Visa rule permanently deleted');
});

// Toggle visa rule status
export const toggleVisaRuleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaRule = await VisaRule.findById(id)
    .populate('fromCountry', 'name isoCode')
    .populate('toCountry', 'name isoCode')
    .populate('visaType', 'name code');

  if (!visaRule) {
    return notFoundResponse(res, 'Visa rule');
  }

  visaRule.isActive = !visaRule.isActive;
  visaRule.updatedAt = new Date();
  await visaRule.save();

  return successResponse(
    res,
    `Visa rule ${visaRule.isActive ? 'activated' : 'deactivated'} successfully`,
    visaRule
  );
});

// Check visa eligibility for a specific country combination
export const checkVisaEligibility = asyncHandler(async (req, res) => {
  const { fromCountryId, toCountryId, visaTypeId } = req.query;

  if (!fromCountryId || !toCountryId) {
    return errorResponse(
      res,
      'From country and to country are required',
      [],
      400
    );
  }

  const filter = {
    fromCountry: fromCountryId,
    toCountry: toCountryId,
    isActive: true,
  };

  if (visaTypeId) {
    filter.visaType = visaTypeId;
  }

  const visaRules = await VisaRule.find(filter)
    .populate('fromCountry', 'name isoCode flagUrl')
    .populate('toCountry', 'name isoCode flagUrl')
    .populate('visaType', 'name code description category')
    .lean();

  if (visaRules.length === 0) {
    return successResponse(
      res,
      'No visa support available for this combination',
      {
        isEligible: false,
        visaRules: [],
        message:
          'Visa cannot be provided at this time. Please contact your local embassy.',
      }
    );
  }

  return successResponse(res, 'Visa eligibility checked successfully', {
    isEligible: true,
    visaRules,
    message: 'Visa support available for this destination.',
  });
});

// Get visa rules for a specific destination country
export const getVisaRulesForDestination = asyncHandler(async (req, res) => {
  const { countryId } = req.params;

  const visaRules = await VisaRule.find({
    toCountry: countryId,
    isActive: true,
    isVisaAvailable: true,
  })
    .populate('fromCountry', 'name isoCode flagUrl')
    .populate('visaType', 'name code description category')
    .sort({ 'fromCountry.name': 1 })
    .lean();

  return successResponse(
    res,
    'Visa rules for destination retrieved successfully',
    visaRules
  );
});
