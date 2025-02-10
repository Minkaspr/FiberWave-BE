import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { AuthorizationError } from '../modules/auth/helper/auth-error.js';
import { errorDetailsResponse } from './api-response-handler.js';

/**
 * Middleware para autenticar un token JWT.
 * 
 * Este middleware verifica la presencia y validez de un token JWT en los encabezados 
 * de autorización de la solicitud. Si el token es válido, se agrega la información del 
 * usuario decodificada al objeto `req.user` y se permite continuar con la solicitud. 
 * Si no se proporciona un token o es inválido, responde con un error.
 * 
 * @param {Object} req - Objeto de solicitud HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Si el token es válido, llama a `next()`. Si no, responde con un error.
 */
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

/**
 * Middleware para validar la presencia de un token de actualización (refresh token).
 * 
 * Este middleware verifica que el cuerpo de la solicitud (`req.body`) contenga un campo 
 * `refreshToken`. Si no está presente, responde con un error. Si está presente, permite 
 * continuar con la solicitud.
 * 
 * @param {Object} req - Objeto de solicitud HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Si el token de actualización está presente, llama a `next()`. Si no, responde con un error.
 */
export const validateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return errorDetailsResponse(res, [{ message: 'Token de actualización no proporcionado', field: 'refreshToken' }], 'Solicitud inválida');
  }
  next();
};