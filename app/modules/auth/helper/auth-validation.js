import { body } from 'express-validator';

export const registerValidation = [
  body('firstname')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto'),
  body('lastname')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto'),
  body('email')
    .isEmail().withMessage('Correo electrónico no válido')
    .isString().withMessage('El correo electrónico debe ser un texto'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener un número')
    .matches(/[a-z]/).withMessage('La contraseña debe contener una letra minúscula')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener una letra mayúscula')
    .matches(/[@$!%*?&#]/).withMessage('La contraseña debe contener un carácter especial')
    .isString().withMessage('La contraseña debe ser un texto')
];

export const loginValidation = [
  body('email')
    .isEmail().withMessage('Correo electrónico no válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];