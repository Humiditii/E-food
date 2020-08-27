import {Router} from 'express';
import Validator from '../Middlewares/Validator';
import AuthController from '../Controllers/AuthController';

const baseRoute = Router();
const authRoutes = Router();

authRoutes.post('/signup', Validator.checkEmpty, Validator.checkEmail, Validator.samePassword, AuthController.signup);

authRoutes.post('/signin', Validator.checkEmpty, Validator.checkEmail, AuthController.signin);

baseRoute.use('/auth', authRoutes);

export default baseRoute;