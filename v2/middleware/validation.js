import { ZodError } from 'zod';
import { validationErrorResponse } from '../utils/response.js';

// Middleware to validate request data against Zod schemas
export const validateSchema = schemas => {
  return (req, res, next) => {
    try {
      // Validate request body if schema provided
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      // Validate route parameters if schema provided
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      // Validate query parameters if schema provided
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(res, error);
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: [],
      });
    }
  };
};

// Middleware to handle async route errors
export const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
