// Standardized response utilities for consistent API responses

export const successResponse = (
  res,
  message,
  data = null,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const validationErrorResponse = (res, zodError) => {
  const errors = zodError.errors.map(
    err => `${err.path.join('.')}: ${err.message}`
  );
  return errorResponse(res, 'Validation failed', errors, 422);
};

export const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(res, `${resource} not found`, [], 404);
};

export const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return errorResponse(res, message, [], 401);
};

export const serverErrorResponse = (res, message = 'Internal server error') => {
  return errorResponse(res, message, [], 500);
};
