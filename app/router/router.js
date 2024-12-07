import express from 'express';
import userController from '../modules/user/controller/user-controller.js'
import authController from '../modules/auth/controller/auth-controller.js'
import permissionController from '../modules/permission/controller/permission-controller.js'
import roleController from '../modules/role/controller/role-controller.js'
import rolePermissionController from '../modules/role-permission/controller/role-permission-controller.js'

const router = express.Router();

router.use('/user', userController);
router.use('/auth', authController);
router.use('/permission', permissionController);
router.use('/role',roleController);
router.use('/rolePermmission',rolePermissionController);

export default router;