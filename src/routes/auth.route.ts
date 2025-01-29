import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { RegisterUserDto } from '../dto/register-user.dto';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

// @ts-ignore
router.post('/register', validateBody(RegisterUserDto), register);

// @ts-ignore
router.post('/login', validateBody(RegisterUserDto), login);

// Маршрут для логаута
router.post('/logout', logout);

export { router as authRouter };
