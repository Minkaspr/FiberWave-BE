import { body, check } from 'express-validator';

export const getByIdValidRule = () => {
  return [
    check('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
  ];
};

export const insValidRules = () => {
  return [
    body('name')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isString().withMessage('El nombre debe ser un texto'),
    body('surname')
      .notEmpty().withMessage('El apellido es obligatorio')
      .isString().withMessage('El apellido debe ser un texto'),
    body('email')
      .isEmail().withMessage('Correo electrónico no válido')
      .isString().withMessage('El correo electrónico debe ser un texto'),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/\d/).withMessage('La contraseña debe contener un número')
      .matches(/[a-z]/).withMessage('La contraseña debe contener una letra minúscula')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener una letra mayúscula')
      .matches(/[@$!%*?&#]/).withMessage('La contraseña debe contener un carácter especial')
      .isString().withMessage('La contraseña debe ser un texto'),
    body('role_id')
      .optional()
      .isInt({ min: 1 }).withMessage('El rol debe ser un número entero mayor a 0'),
    body('is_active')
      .optional()
      .isBoolean().withMessage('El estado activo debe ser booleano')
  ];
};

export const updValidRules = () => {
  return [
    check('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
    body('name')
      .optional()
      .isString().withMessage('El nombre debe ser un texto'),
    body('surname')
      .optional()
      .isString().withMessage('El apellido debe ser un texto'),
    body('email')
      .optional()
      .isEmail().withMessage('Correo electrónico no válido')
      .isString().withMessage('El correo electrónico debe ser un texto'),
    body('password')
      .optional()
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/\d/).withMessage('La contraseña debe contener un número')
      .matches(/[a-z]/).withMessage('La contraseña debe contener una letra minúscula')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener una letra mayúscula')
      .matches(/[@$!%*?&#]/).withMessage('La contraseña debe contener un carácter especial')
      .isString().withMessage('La contraseña debe ser un texto'),
    body('role_id')
      .optional()
      .isInt({ min: 1 }).withMessage('El rol debe ser un número entero mayor a 0'),
    body('is_active')
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
    check('id')
      .notEmpty().withMessage('El ID es obligatorio')
      .isInt({ min: 1 }).withMessage('El ID debe ser un número entero mayor a 0'),
  ];
};