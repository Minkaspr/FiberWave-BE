import { validationResult } from 'express-validator';
import { errorDetailsResponse } from './api-response-handler.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return errorDetailsResponse(res, formattedErrors, 400);
  }
  next();
};