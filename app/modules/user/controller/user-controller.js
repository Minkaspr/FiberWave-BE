import express from 'express';
import UserService from '../service/user-service.js'; 
import { getByIdValidRule, insValidRules, updValidRules, updPassValidRules, updProfileValidRules, deleteValidRule } from '../helper/validation-helper.js';
import { handleValidationErrors } from '../../../middleware/validation-handler.js';
import { dataResponse, errorResponse, successResponse } from '../../../middleware/api-response-handler.js';

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
    
    return dataResponse(res, userPagination );
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

userRouter.get('/getById/:id?', getByIdValidRule(), handleValidationErrors, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      return dataResponse(res, {user});
    } else {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.post('/create', insValidRules(), handleValidationErrors, async (req, res) => {
  try {
    const newUser = await UserService.createUser(req.body);
    return dataResponse(res, {use: newUser}, "Datos registrados exitosamente", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.put('/update/:id?', updValidRules(), handleValidationErrors, async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (updatedUser[0] === 1) {
      return successResponse(res, 'Usuario actualizado con éxito');
    } else {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
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

userRouter.delete('/delete/:id?', deleteValidRule(), handleValidationErrors, async (req, res) => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    if (result) {
      return successResponse(res, 'Usuario eliminado con éxito');
    } else {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

userRouter.get('/filters', async (req, res) =>{
  try {
    const filters = await UserService.getFilterOptions();
    return dataResponse(res, {filters});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default userRouter;