import { body } from 'express-validator';

/**
 * Validaciones específicas para el rol de Customer.
 */
export const customerValidationRules = () => [
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
  body('roleData.phone_number')
    .notEmpty().withMessage('El número de teléfono es obligatorio')
    .isString().withMessage('El número de teléfono debe ser un texto')
    .matches(/^\d+$/).withMessage('El número de teléfono debe contener solo números')
    .isLength({ min: 9 }).withMessage('El número de teléfono debe tener al menos 9 dígitos'),
  body('roleData.loyalty_points')
    .isInt({ min: 0 }).withMessage('Los puntos de lealtad deben ser un número entero positivo')
];
