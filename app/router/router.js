import express from 'express';
import userController from '../user/controller/user-controller.js'
import authController from '../auth/controller/auth-controller.js'

const router = express.Router();

router.use('/user', userController);
router.use('/auth', authController);

export default router;