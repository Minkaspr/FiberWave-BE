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