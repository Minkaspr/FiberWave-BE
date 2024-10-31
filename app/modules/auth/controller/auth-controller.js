import express from 'express';
import AuthService from '../service/auth-service.js';
import { handleValidationErrors } from '../../middleware/validation-handler.js';
import { successResponse, errorResponse } from '../../middleware/response-handler.js';
import { registerValidation, loginValidation } from '../helper/auth-validation.js';
import { authenticateToken } from '../../middleware/auth-handler.js';

const authRouter = express.Router();

authRouter.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
  try {
    await AuthService.register(req.body);
    successResponse(res, { message: 'Usuario registrado con éxito' }, 201);
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 400);
  }
});

authRouter.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { user, token, refreshToken } = await AuthService.login(req.body.email, req.body.password);
    successResponse(res, { user, token, refreshToken }, 200);
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 401);
  }
});

authRouter.get('/protected', authenticateToken, (req, res) => {
  res.send('Contenido protegido');
});

authRouter.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const result = await AuthService.logout(refreshToken);
    successResponse(res, result, 200);
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 400);
  }
});

authRouter.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const tokens = await AuthService.refreshToken(refreshToken);
    successResponse(res, tokens, 200);
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 403);
  }
});

export default authRouter;