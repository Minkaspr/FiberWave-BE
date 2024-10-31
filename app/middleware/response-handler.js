export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    data
  });
};

export const errorResponse = (res, errors, statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    errors
  });
};