import { validationResult } from 'express-validator';
import { errorDetailsResponse } from './api-response-handler.js';

/**
 * Middleware para manejar errores de validación generados por express-validator.
 * 
 * Este middleware revisa si hay errores de validación en la solicitud actual y,
 * en caso de que existan, los formatea y responde con un error detallado.
 * Si no hay errores, permite que la solicitud continúe al siguiente middleware o controlador.
 * 
 * @param {Object} req - Objeto de solicitud HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @returns {void} Si hay errores, responde con un JSON detallando los errores; 
 *                 si no, llama a `next()`.
 */
export const handleValidationErrors = (customMessage = 'Error en la validación de datos') => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return errorDetailsResponse(res, formattedErrors, customMessage, 400);
  }
  next();
};

/**
 * Middleware para filtrar los campos permitidos en el cuerpo de la solicitud (req.body).
 * 
 * Este middleware asegura que solo los campos especificados en `allowedFields` permanezcan en `req.body`.
 * Esto ayuda a prevenir que datos no deseados o maliciosos sean procesados por la aplicación.
 * 
 * @param {string[]} allowedFields - Lista de nombres de campos permitidos.
 * @returns {Function} Middleware que filtra los campos no permitidos.
 */
export const filterAllowedFields = (allowedFields) => {
  return (req, res, next) => {
    req.body = Object.keys(req.body)
      .filter((key) => allowedFields.includes(key))
      .reduce((filteredBody, key) => {
        filteredBody[key] = req.body[key];
        return filteredBody;
      }, {});
    next();
  };
};
