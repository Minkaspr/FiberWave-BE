import express from 'express';
import UserService from '../service/user-service.js'; 
import { getByIdValidRule, insValidRules, updValidRules, updPassValidRules, updProfileValidRules, deleteValidRule } from '../helper/validation-helper.js';
import { handleValidationErrors } from '../../../middleware/validation-handler.js';
import { successResponse, errorResponse } from '../../../middleware/response-handler.js';

const userRouter = express.Router();

userRouter.get('/getAll', async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    successResponse(res, { users }, 200);
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 500);
  }
});

userRouter.get('/getById/:id?', getByIdValidRule(), handleValidationErrors, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      successResponse(res, { user }, 200);
    } else {
      errorResponse(res, [{ message: 'Usuario no encontrado' }], 404);
    }
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 500);
  }
});

userRouter.post('/create', insValidRules(), handleValidationErrors, async (req, res) => {
  try {
    const newUser = await UserService.createUser(req.body);
    successResponse(res, { user: newUser }, 201);
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 500);
  }
});

userRouter.put('/update/:id?', updValidRules(), handleValidationErrors, async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (updatedUser[0] === 1) {
      successResponse(res, { message: 'Usuario actualizado con éxito' }, 200);
    } else {
      errorResponse(res, [{ message: 'Usuario no encontrado' }], 404);
    }
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 500);
  }
});

userRouter.put('/update-password/:id?', updPassValidRules(), handleValidationErrors, async (req, res) => {
  try {
    await UserService.updatePassword(req.params.id, req.body.oldPassword, req.body.newPassword);
    successResponse(res, { message: 'Contraseña actualizada con éxito' }, 200);
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 400);
  }
});

userRouter.put('/update-profile/:id?', updProfileValidRules(), handleValidationErrors, async (req, res) => {
  try {
    const updatedUser = await UserService.updateProfile(req.params.id, req.body);
    if (updatedUser[0] === 1) {
      successResponse(res, { message: 'Perfil actualizado con éxito' }, 200);
    } else {
      errorResponse(res, [{ message: 'Usuario no encontrado' }], 404);
    }
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 500);
  }
});

userRouter.delete('/delete/:id?', deleteValidRule(), handleValidationErrors, async (req, res) => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    if (result) {
      successResponse(res, { message: 'Usuario eliminado con éxito' }, 200);
    } else {
      errorResponse(res, [{ message: 'Usuario no encontrado' }], 404);
    }
  } catch (error) {
    errorResponse(res, [{ message: error.message }], 500);
  }
});

export default userRouter;