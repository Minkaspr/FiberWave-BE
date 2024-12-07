import express from 'express';
import RolePermissionService from '../service/role-permission-service.js'
import { dataResponse, errorResponse } from '../../../middleware/api-response-handler.js';

const rolePermissionRouter = express.Router();

rolePermissionRouter.get('/getAll', async (req, res) => {
  try {
    const rolesPermissions = await RolePermissionService.getAllRolePermission();
    return dataResponse(res, {rolesPermissions});
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default rolePermissionRouter;
