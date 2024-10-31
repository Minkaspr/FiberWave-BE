import { validationResult } from 'express-validator';
import { errorResponse } from './response-handler.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return errorResponse(res, formattedErrors, 400);
  }
  next();
};