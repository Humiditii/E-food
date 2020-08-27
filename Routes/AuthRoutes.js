import {Router} from 'express';
import Validator from '../Middlewares/Validator';
import AuthController from '../Controllers/AuthController';
import IsAuth from '../Middlewares/IsAuth';

const baseRoute = Router();
const authRoutes = Router();

authRoutes.post('/signup', Validator.checkEmpty, Validator.checkEmail, Validator.samePassword, AuthController.signup);

authRoutes.post('/signin', Validator.checkEmpty, Validator.checkEmail, AuthController.signin);

authRoutes.patch('/change_password', Validator.checkEmpty, Validator.samePassword, IsAuth.verifyAuth, AuthController.changePassword )

baseRoute.use('/auth', authRoutes);

export default baseRoute;