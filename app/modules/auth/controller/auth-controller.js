import express from 'express';
import AuthService from '../service/auth-service.js';
import { handleValidationErrors, filterAllowedFields } from '../../../middleware/validation-handler.js';
import { authResponse, errorDetailsResponse, errorResponse, successResponse, tokenResponse } from '../../../middleware/api-response-handler.js';
import { registerValidation, loginValidation } from '../helper/auth-validations.js';
import { authenticateToken, validateRefreshToken } from '../../../middleware/auth-handler.js';
import { UniqueConstraintError } from '../../user/helper/unique-constraint-error.js';
import { CredentialError } from '../helper/auth-error.js';

const authRouter = express.Router();

authRouter.post(
  '/register', 
  filterAllowedFields(['firstname', 'lastname', 'email', 'password']),
  registerValidation, 
  (req, res, next) => handleValidationErrors('Error al validar el usuario')(req, res, next), 
  async (req, res) => {
    try {
      await AuthService.register(req.body);
      return successResponse(res, 'Usuario registrado con éxito', 201);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return errorDetailsResponse(
          res,
          [{ field: error.field, message: error.message }], // Mensaje detallado
          'Duplicidad de campos', // Mensaje genérico
          error.statusCode
        );
      } else {
        return errorResponse(res, 'Error interno del servidor', 500);
      }
    }
  }
);

authRouter.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { user, token, refreshToken } = await AuthService.login(req.body.email, req.body.password);
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,    // No accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production',  // Solo en HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 días en milisegundos
      sameSite: 'None'
    });
    return authResponse(res, { user }, token, refreshToken, 200);
  } catch (error) {
    if (error instanceof CredentialError) {
      return errorDetailsResponse(res, [{ message: error.message, field: error.field }], error.statusCode);
    }
    return errorResponse(res, 'Error interno del servidor' + error.message, 500);
  }
});

authRouter.get('/protected', authenticateToken, (req, res) => {
  res.send('Contenido protegido');
});

authRouter.post('/refresh-token', validateRefreshToken, async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const tokens = await AuthService.refreshToken(refreshToken);
    return tokenResponse(res, tokens.token, tokens.refreshToken);
  } catch (error) {
    return errorDetailsResponse(res,[{ message: error.message, field: error.field }], 403);
  }
});

authRouter.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return errorResponse(res, "El token de actualización es obligatorio para cerrar sesión.");
  }
  try {
    const result = await AuthService.logout(refreshToken);
    return successResponse(res, result.message);
  } catch (error) {
    return errorResponse(res, error.message);
  }
});

export default authRouter;