import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { AuthorizationError } from '../modules/auth/helper/auth-error.js';
import { errorDetailsResponse } from './api-response-handler.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorDetailsResponse(res, [{ message: 'Token no proporcionado', field: 'token' }], 401, 'No estás autorizado para acceder a este recurso');
  }

  jwt.verify(token, config.jwt, (err, user) => {
    if (err) {
      const authorizationError = new AuthorizationError(undefined,'Token inválido o expirado');
      return errorDetailsResponse(res, [{ message: authorizationError.message, field: authorizationError.field }], authorizationError.statusCode);
    }
    req.user = user;
    next();
  });
};

export const validateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return errorDetailsResponse(res, [{ message: 'Token de actualización no proporcionado', field: 'refreshToken' }], 'Solicitud inválida');
  }
  next();
};