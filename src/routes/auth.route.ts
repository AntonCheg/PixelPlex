import { Router, Request, Response } from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { RegisterUserDto } from '../dto/register-user.dto';

const router = Router();

// @ts-ignore
router.post('/register', validateBody(RegisterUserDto), register);

// @ts-ignore
router.post('/login', validateBody(RegisterUserDto), login);

// Маршрут для логаута
router.post('/logout', logout);

export { router as authRouter };
