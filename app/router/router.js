import express from 'express';
import userController from '../modules/user/controller/user-controller.js'
import authController from '../modules/auth/controller/auth-controller.js'

const router = express.Router();

router.use('/user', userController);
router.use('/auth', authController);

export default router;