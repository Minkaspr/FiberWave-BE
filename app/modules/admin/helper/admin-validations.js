import { body } from 'express-validator';

/**
 * Validaciones específicas para el rol de Admin.
 */
export const adminValidationRules = () => [
  body('roleData.address')
    .notEmpty().withMessage('La dirección es obligatoria')
    .isString().withMessage('La dirección debe ser un texto')
    .isLength({ min: 5 }).withMessage('La dirección debe tener al menos 5 caracteres'),
  body('roleData.city')
    .notEmpty().withMessage('La ciudad es obligatoria')
    .isString().withMessage('La ciudad debe ser un texto')
    .isLength({ min: 3 }).withMessage('La ciudad debe tener al menos 3 caracteres'),
  body('roleData.department')
    .notEmpty().withMessage('El departamento es obligatorio')
    .isString().withMessage('El departamento debe ser un texto')
    .isLength({ min: 3 }).withMessage('El departamento debe tener al menos 3 caracteres'),
  body('roleData.gender')
    .notEmpty().withMessage('El género es obligatorio')
    .isString().withMessage('El género debe ser un texto')
    .isIn(['male', 'female', 'other']).withMessage('El género debe ser "male", "female" o "other"'),
  body('roleData.birth_date')
    .notEmpty().withMessage('La fecha de nacimiento es obligatoria')
    .isISO8601().withMessage('La fecha de nacimiento debe ser válida')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate >= today) {
        throw new Error('La fecha de nacimiento debe ser anterior a la fecha actual');
      }
      return true;
    }),
  body('roleData.identity_document')
    .notEmpty().withMessage('El documento de identidad es obligatorio')
    .isString().withMessage('El documento de identidad debe ser un texto')
    .matches(/^\d+$/).withMessage('El documento de identidad debe contener solo números')
    .isLength({ min: 8, max: 20 }).withMessage('El documento de identidad debe tener entre 8 y 20 dígitos'),
];
