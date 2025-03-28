import { body, param, check } from 'express-validator';

export const getByIdValidRule = () => {
  return [
    param('id') // Cambiar 'check' por 'param' para trabajar con parámetros de ruta
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0')
      .toInt() // Convertir el ID a número
  ];
};

export const insValidRules = () => {
  return [
    body('userData.firstname')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isString().withMessage('El nombre debe ser un texto')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('userData.lastname')
      .notEmpty().withMessage('El apellido es obligatorio')
      .isString().withMessage('El apellido debe ser un texto')
      .isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 caracteres'),
    body('userData.email')
      .notEmpty().withMessage('El correo electrónico es obligatorio')
      .isEmail().withMessage('Correo electrónico no válido'),
    body('userData.password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/\d/).withMessage('La contraseña debe contener un número')
      .matches(/[a-z]/).withMessage('La contraseña debe contener una letra minúscula')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener una letra mayúscula')
      .matches(/[@$!%*?&#]/).withMessage('La contraseña debe contener un carácter especial'),
    body('userData.role')
      .notEmpty().withMessage('El rol es obligatorio')
      .isString().withMessage('El rol debe ser un texto')
      .isIn(['admin', 'seller', 'customer']).withMessage('El rol debe ser uno de los siguientes: admin, seller o customer'),
    body('userData.is_active')
      .optional()
      .isBoolean().withMessage('El estado activo debe ser booleano')
  ];
};

export const updValidStatus = () => {
  return [
    param('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
    body('is_active')
      .notEmpty().withMessage('El estado activo es obligatorio')
      .isBoolean().withMessage('El estado activo debe ser booleano')
  ];
}

export const updValidRules = () => {
  return [
    check('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
    body('userData.name')
      .optional()
      .isString().withMessage('El nombre debe ser un texto'),
    body('userData.surname')
      .optional()
      .isString().withMessage('El apellido debe ser un texto'),
    body('userData.email')
      .optional()
      .isEmail().withMessage('Correo electrónico no válido')
      .isString().withMessage('El correo electrónico debe ser un texto'),
    body('userData.role')
      .notEmpty().withMessage('El rol es obligatorio')
      .isString().withMessage('El rol debe ser un texto')
      .isIn(['admin', 'seller', 'customer']).withMessage('El rol debe ser uno de los siguientes: admin, seller o customer'),
    body('userData.is_active')
      .optional()
      .isBoolean().withMessage('El estado activo debe ser booleano')
  ];
};

export const updPassValidRules = () => {
  return [
    check('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
    body('oldPassword')
      .notEmpty().withMessage('La contraseña antigua es obligatoria')
      .isString().withMessage('La contraseña antigua debe ser un texto'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
      .matches(/\d/).withMessage('La nueva contraseña debe contener un número')
      .matches(/[a-z]/).withMessage('La nueva contraseña debe contener una letra minúscula')
      .matches(/[A-Z]/).withMessage('La nueva contraseña debe contener una letra mayúscula')
      .matches(/[@$!%*?&#]/).withMessage('La nueva contraseña debe contener un carácter especial')
      .isString().withMessage('La nueva contraseña debe ser un texto')
  ];
};

export const updProfileValidRules = () => {
  return [
    check('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
    body('name')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isString().withMessage('El nombre debe ser un texto'),
    body('surname')
      .optional()
      .isString().withMessage('El apellido debe ser un texto'),
    body('email')
      .isEmail().withMessage('Correo electrónico no válido')
      .isString().withMessage('El correo electrónico debe ser un texto')
  ];
};

export const deleteValidRule = () => {
  return [
    param('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
  ];
};

export const deleteMultipleValidRule = () => {
  return [
    body('userIds')
      .isArray({ min: 1 }).withMessage('Debe proporcionar al menos un ID de usuario.')
      .custom((userIds) => userIds.every(id => Number.isInteger(id)))
      .withMessage('Todos los IDs deben ser números enteros válidos.')
  ];
};