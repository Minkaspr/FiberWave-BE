/**
 * Utilidades para manejar respuestas HTTP de forma uniforme en toda la aplicación.
 * 
 * Este archivo contiene métodos para generar respuestas consistentes, incluyendo
 * respuestas exitosas, de error y con detalles específicos.
 * 
 * Métodos:
 * - apiResponse: Genera una respuesta genérica basada en los parámetros proporcionados.
 * - authResponse: Respuesta para operaciones relacionadas con autenticación.
 * - tokenResponse: Respuesta para generación de tokens.
 * - dataResponse: Respuesta para enviar datos exitosamente.
 * - errorDetailsResponse: Respuesta para errores con detalles específicos.
 * - successResponse: Respuesta genérica para operaciones exitosas.
 * - errorResponse: Respuesta genérica para errores.
 */

const apiResponse = (
  {
    status = '',
    message = '',
    data = undefined,
    token = undefined,
    refreshToken = undefined,
    errors = undefined
  },
  res,
  statusCode = 200
) => {
  // Filtrar las propiedades con valor undefined o null
  const response = Object.fromEntries(
    Object.entries({
      status,
      message,
      data,
      token,
      refreshToken,
      errors
    }).filter(([_, v]) => v !== undefined && v !== null)
  );

  return res.status(statusCode).json(response);
};

export const authResponse = (res, data, token, refreshToken, statusCode = 200, message = 'Operación exitosa') => {
  return apiResponse({
    status: 'success',
    message,
    data,
    token,
    refreshToken
  }, res, statusCode);
};

export const tokenResponse = (res, token, refreshToken, message = 'Token generado correctamente', statusCode = 200) => {
  return apiResponse({
    status: 'success',
    message,
    token,
    refreshToken
  }, res, statusCode);
};

export const dataResponse = (res, data, message = 'Datos enviados correctamente', statusCode = 200) => {
  return apiResponse({
    status: 'success',
    message,
    data
  }, res, statusCode);
};

export const errorDetailsResponse = (res, errors, message = 'Hubo un problema con la solicitud', statusCode = 400) => {
  return apiResponse({
    status: 'error',
    message,
    errors
  }, res, statusCode);
};

export const successResponse = (res, message = 'Operación exitosa', statusCode = 200) => {
  return apiResponse({
    status: 'success',
    message
  }, res, statusCode);
};

export const errorResponse = (res, message = 'Hubo un problema con la solicitud', statusCode = 400) => {
  return apiResponse({
    status: 'error',
    message
  }, res, statusCode);
};