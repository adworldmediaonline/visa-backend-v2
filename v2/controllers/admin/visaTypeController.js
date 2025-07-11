import { asyncHandler } from '../../middleware/validation.js';
import VisaType from '../../models/admin/VisaType.js';
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from '../../utils/response.js';

// Get all visa types with pagination and filtering
export const getVisaTypes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isActive, category } = req.query;

  // Build filter object
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (isActive !== undefined) filter.isActive = isActive;
  if (category) filter.category = category;

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const [visaTypes, total] = await Promise.all([
    VisaType.find(filter)
      .sort({ 'metadata.sortOrder': 1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    VisaType.countDocuments(filter),
  ]);

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  };

  return successResponse(res, 'Visa types retrieved successfully', {
    visaTypes,
    pagination,
  });
});

// Get single visa type by ID
export const getVisaTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaType = await VisaType.findById(id).lean();
  if (!visaType) {
    return notFoundResponse(res, 'Visa type');
  }

  return successResponse(res, 'Visa type retrieved successfully', visaType);
});

// Create new visa type
export const createVisaType = asyncHandler(async (req, res) => {
  try {
    // Check if visa type with same code or name already exists
    const existingVisaType = await VisaType.findOne({
      $or: [{ code: req.body.code }, { name: req.body.name }],
    });

    if (existingVisaType) {
      return errorResponse(
        res,
        'Visa type with this code or name already exists',
        [],
        409
      );
    }

    const visaType = new VisaType(req.body);
    await visaType.save();

    return successResponse(
      res,
      'Visa type created successfully',
      visaType,
      201
    );
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        'Visa type with this information already exists',
        [],
        409
      );
    }
    throw error;
  }
});

// Update visa type
export const updateVisaType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if another visa type with same code or name exists (excluding current)
    if (req.body.code || req.body.name) {
      const filter = { _id: { $ne: id } };
      const conditions = [];

      if (req.body.code) conditions.push({ code: req.body.code });
      if (req.body.name) conditions.push({ name: req.body.name });

      if (conditions.length > 0) {
        filter.$or = conditions;
        const existingVisaType = await VisaType.findOne(filter);
        if (existingVisaType) {
          return errorResponse(
            res,
            'Another visa type with this code or name already exists',
            [],
            409
          );
        }
      }
    }

    const visaType = await VisaType.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!visaType) {
      return notFoundResponse(res, 'Visa type');
    }

    return successResponse(res, 'Visa type updated successfully', visaType);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        'Visa type with this information already exists',
        [],
        409
      );
    }
    throw error;
  }
});

// Delete visa type (soft delete)
export const deleteVisaType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaType = await VisaType.findByIdAndUpdate(
    id,
    { isActive: false, updatedAt: new Date() },
    { new: true }
  );

  if (!visaType) {
    return notFoundResponse(res, 'Visa type');
  }

  return successResponse(res, 'Visa type deleted successfully', visaType);
});

// Hard delete visa type
export const hardDeleteVisaType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaType = await VisaType.findByIdAndDelete(id);
  if (!visaType) {
    return notFoundResponse(res, 'Visa type');
  }

  return successResponse(res, 'Visa type permanently deleted');
});

// Toggle visa type status
export const toggleVisaTypeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visaType = await VisaType.findById(id);
  if (!visaType) {
    return notFoundResponse(res, 'Visa type');
  }

  visaType.isActive = !visaType.isActive;
  visaType.updatedAt = new Date();
  await visaType.save();

  return successResponse(
    res,
    `Visa type ${visaType.isActive ? 'activated' : 'deactivated'} successfully`,
    visaType
  );
});

// Get active visa types for dropdown/selection
export const getActiveVisaTypes = asyncHandler(async (req, res) => {
  const visaTypes = await VisaType.find({ isActive: true })
    .select('name code description category metadata.icon metadata.color')
    .sort({ 'metadata.sortOrder': 1, name: 1 })
    .lean();

  return successResponse(
    res,
    'Active visa types retrieved successfully',
    visaTypes
  );
});

// Get visa types by category
export const getVisaTypesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const visaTypes = await VisaType.find({
    category,
    isActive: true,
  })
    .select(
      'name code description metadata.icon metadata.color metadata.features'
    )
    .sort({ 'metadata.sortOrder': 1, name: 1 })
    .lean();

  return successResponse(
    res,
    `Visa types for ${category} category retrieved successfully`,
    visaTypes
  );
});
