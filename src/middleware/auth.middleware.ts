import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next) => {
  if (req.session.userId) {
    return next(); // Пользователь авторизован
  }

  return res.status(401).json({ message: 'Not authenticated' }); // Если нет сессии, отправляем ошибку
};
