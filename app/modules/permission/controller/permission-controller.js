import express from 'express';
import PermissionService from '../service/permission-service.js';
import { dataResponse, errorResponse } from '../../../middleware/api-response-handler.js';

const permissionRouter = express.Router();

permissionRouter.get('/getAll', async (req, res) => {
  try {
    const permissions = await PermissionService.getAllPermisssions();
    return dataResponse(res, {permissions});
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

permissionRouter.get('/getById/:id?', async (req, res) => {
  try {
    const permission = await PermissionService.getPermissionById(req.params.id);
    if (permission) {
      return dataResponse(res, {permission});
    } else {
      return errorResponse(res, 'Permiso no encontrado', 404);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default permissionRouter;