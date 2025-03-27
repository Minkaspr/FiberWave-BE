import express from 'express';
import UserService from '../service/user-service.js';
import { getByIdValidRule, insValidRules, updValidRules, updPassValidRules, updProfileValidRules, deleteValidRule, updValidStatus } from '../helper/user-validations.js';
import { adminValidationRules } from '../../admin/helper/admin-validations.js';
import { sellerValidationRules } from '../../seller/helper/seller-validations.js';
import { customerValidationRules } from '../../customer/helper/customer-validations.js';
import { handleValidationErrors } from '../../../middleware/validation-handler.js';
import { dataResponse, errorResponse, successResponse, errorDetailsResponse } from '../../../middleware/api-response-handler.js';
import { validationResult } from 'express-validator';

const userRouter = express.Router();

userRouter.get('/getAll', async (req, res) => {
  try {
    const { page = 1, size = 10, sortBy = 'created_at', sortOrder = 'desc', roles, isActive } = req.query;
    const validSortOrders = ['asc', 'desc'];
    const validSortFields = ['firstname', 'lastname', 'email', 'created_at', 'is_active'];
    const validSortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    // Normalizar roles: convertir a array (si roles está definido)
    const parsedRoles = roles ? roles.split(',') : [];
    // Normalizamos el valor de isActive (en caso de ser string 'true' o 'false')
    const parsedIsActive = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    const userPagination = await UserService.getAllUsers({
      page,
      size,
      sortBy: validSortField,
      sortOrder: validSortOrder,
      roles: parsedRoles,
      isActive: parsedIsActive,
    });

    return dataResponse(res, userPagination);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.get('/fetchUsers', async (req, res) => {
  try {
    const {
      currentPage = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      roles,
      isActive,
      searchTerm,
    } = req.query;

    // Validar y normalizar parámetros
    const validSortFields = ['firstname', 'lastname', 'email', 'created_at', 'is_active'];
    const validSortOrders = ['asc', 'desc'];
    const validSortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    const parsedRoles = roles ? roles.split(',') : [];
    const parsedIsActive = isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    // Llamada al servicio con parámetros unificados
    const userPagination = await UserService.fetchUsers({
      currentPage,
      pageSize,
      sortBy: validSortField,
      sortOrder: validSortOrder,
      roles: parsedRoles,
      isActive: parsedIsActive,
      searchTerm,
    });

    return dataResponse(res, userPagination);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.get('/search', async (req, res) => {
  try {
    const { page = 1, size = 10, searchTerm } = req.query;

    if (!searchTerm) {
      return errorResponse(res, 'El parámetro searchTerm es obligatorio', 400);
    }

    const userPagination = await UserService.searchUsers({
      page,
      size,
      searchTerm
    });

    return dataResponse(res, userPagination);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.get('/getById/:id?', 
  getByIdValidRule(), // Validar el parámetro de ruta
  handleValidationErrors('Error al validar el usuario'), // Manejar errores de validación
  async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      return dataResponse(res, { user });
    } else {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.post(
  '/create',
  insValidRules(),
  handleValidationErrors('Error al validar lo esencial del usuario'), 
  (req, res, next) => {
    const { userData, roleData } = req.body;
    switch (userData.role) {
      case 'admin':
        return Promise.all(adminValidationRules().map((rule) => rule.run(req)))
          .then(() => next())
          .catch(next);
      
      case 'seller':
        return Promise.all(sellerValidationRules().map((rule) => rule.run(req)))
          .then(() => next())
          .catch(next);
      
      case 'customer':
        return Promise.all(customerValidationRules().map((rule) => rule.run(req)))
          .then(() => next())
          .catch(next);

      default:
        return next();
    }
  },
  (req, res, next) => handleValidationErrors('Error al validar el usuario')(req, res, next),
  async (req, res) => {
    try {
      const { userData, roleData } = req.body;
      const newUser = await UserService.createUser(userData, roleData);
      return dataResponse(res, { use: newUser }, "Datos registrados exitosamente", 201);
    } catch (error) {
      if (Array.isArray(error)) {
        const statusCodes = error.map(err => err.statusCode);
        const finalStatusCode = statusCodes.includes(409) ? 409 : statusCodes.includes(404) ? 404 : 400;

        return errorDetailsResponse(
          res,
          error.map(err => ({ field: err.field || err.resource, message: err.message })),
          'Errores en la creación del usuario', 
          finalStatusCode 
        );
      } else {
        return errorResponse(res, 'Error interno del servidor ' + error.message , 500);
      }
    }
  }
);

userRouter.put('/:id/status', updValidStatus(), handleValidationErrors('Error al validar el usuario'), async (req, res) => {
  try {
    const updatedUser = await UserService.updateUserStatus(req.params.id, req.body.is_active);
    if (updatedUser) {
      return successResponse(res, 'Estado de usuario actualizado con éxito');
    } else {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.put(
  '/update/:id?', 
  updValidRules(), 
  handleValidationErrors('Error al validar lo esencial del usuario'), 
  async (req, res, next) => {
    const { userData, roleData } = req.body;
    switch (userData.role) {
      case 'admin':
        return Promise.all(adminValidationRules().map(rule => rule.run(req)))
          .then(() => next())
          .catch(next);

      case 'seller':
        return Promise.all(sellerValidationRules().map(rule => rule.run(req)))
          .then(() => next())
          .catch(next);

      case 'customer':
        return Promise.all(customerValidationRules().map(rule => rule.run(req)))
          .then(() => next())
          .catch(next);

      default:
        return next();
    }
  },
  handleValidationErrors('Error al validar acorde al rol del usuario'), 
  async (req, res) => {
  try {
    const { userData, roleData } = req.body;
    const updatedUser = await UserService.updateUser(req.params.id, userData, roleData);
    if (updatedUser) {
      return successResponse(res, 'Usuario actualizado con éxito');
    } else {
      return errorResponse(res, 'Usuario no encontrado o sin cambios', 404);
    }
  } catch (error) {
    if (Array.isArray(error)) {
      // Obtener todos los códigos de estado de los errores
      const statusCodes = error.map(err => err.statusCode);
      // Determinar el código de estado más relevante
      const finalStatusCode = statusCodes.includes(409) ? 409 : statusCodes.includes(404) ? 404 : 400;

      return errorDetailsResponse(
          res,
          error.map(err => ({ field: err.field || err.resource, message: err.message })), 
          'Errores en la actualización del usuario',
          finalStatusCode
      );
    } else {
        // Manejo de error individual
        const statusCode = error.statusCode || 500;
        return errorResponse(res, error.message, statusCode);
    }
  }
});

userRouter.put('/update-password/:id?', updPassValidRules(), handleValidationErrors, async (req, res) => {
  try {
    await UserService.updatePassword(req.params.id, req.body.oldPassword, req.body.newPassword);
    return successResponse(res, 'Contraseña actualizada con éxito');
  } catch (error) {
    return errorResponse(res, error.message);
  }
});

userRouter.put('/update-profile/:id?', updProfileValidRules(), handleValidationErrors, async (req, res) => {
  try {
    const updatedUser = await UserService.updateProfile(req.params.id, req.body);
    if (updatedUser[0] === 1) {
      return successResponse(res, 'Perfil actualizado con éxito');
    } else {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.delete('/delete/:id?', deleteValidRule(), handleValidationErrors('Error al validar el usuario'), async (req, res) => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    if (result) {
      return successResponse(res, 'Usuario eliminado con éxito');
    }
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return errorResponse(res, error.message, statusCode);
  }
});

userRouter.get('/filters', async (req, res) => {
  try {
    const filters = await UserService.getFilterOptions();
    return dataResponse(res, { filters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default userRouter;