import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export const validateBody = (dtoClass: any) => {
  return async (req: Request, res: Response, next) => {
    // Преобразуем тело запроса в объект нужного класса DTO
    const dtoObject = plainToInstance(dtoClass, req.body);

    // Валидируем объект
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      // Если ошибки есть, возвращаем их в ответе
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        })),
      });
    }

    // Если ошибок нет, продолжаем выполнение запроса
    next();
  };
};

export const validateParams = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Проверяем параметры пути (req.params)
    const pathParams = plainToInstance(dtoClass, req.params);

    // Проверяем query параметры (req.query)
    const queryParams = plainToInstance(dtoClass, req.query);

    // Валидируем параметры пути
    const pathErrors = await validate(pathParams as any);
    const queryErrors = await validate(queryParams as any);

    if (
      (pathErrors.length > 0 && Object.keys(req.params)).length > 1 ||
      (queryErrors.length > 0 && Object.keys(req.query)).length > 1
    ) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: [
          ...pathErrors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
          ...queryErrors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
        ],
      });
    }

    // Если ошибок нет, продолжаем выполнение запроса
    next();
  };
};
