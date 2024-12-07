import express from 'express';
import RoleService from '../service/role-service.js'
import { dataResponse, errorResponse } from '../../../middleware/api-response-handler.js';

const roleRouter = express.Router();

roleRouter.get('/getAll', async (req, res) => {
  try {
    const roles = await RoleService.getAllRole();
    return dataResponse(res, {roles});
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

roleRouter.get('/getById/:id?', async (req, res) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);
    if (role) {
      return dataResponse(res, {role});
    } else {
      return errorResponse(res, 'Rol no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

roleRouter.get('/getByName/:name?', async (req, res) => {
  try {
    const role = await RoleService.getRoleByName(req.params.name);
    if (role) {
      return dataResponse(res, {role});
    } else {
      return errorResponse(res, 'Rol no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Ruta para obtener todos los roles con sus permisos
roleRouter.get('/getAllWithPermissions', async (req, res) => {
  try {
    const rolesWithPermissions = await RoleService.getAllRolesWithPermissions();
    return dataResponse(res, { roles: rolesWithPermissions });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// Ruta para obtener un rol específico con sus permisos
roleRouter.get('/getByIdWithPermissions/:id', async (req, res) => {
  try {
    const roleWithPermissions = await RoleService.getRoleWithPermissions(req.params.id);
    if (roleWithPermissions) {
      return dataResponse(res, { role: roleWithPermissions });
    } else {
      return errorResponse(res, 'Rol no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default roleRouter;