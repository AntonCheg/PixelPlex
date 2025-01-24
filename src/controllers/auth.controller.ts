import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

// Регистрация
export const register = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
): Promise<any> => {
  try {
    const { username, password } = req.body;
    const user = await AuthService.register(username, password);
    return res
      .status(201)
      .json({ message: 'User registered successfully', user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Логин
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    const user = await AuthService.login(username, password);

    // Сохраняем пользователя в сессии
    req.session.userId = user.id;
    req.session.username = user.username;

    return res.json({ message: 'Login successful' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Логаут
export const logout = (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }

    return res.json({ message: 'Logged out successfully' });
  });
};
