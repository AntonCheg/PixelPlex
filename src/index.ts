// Import required dependencies
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { authRouter } from './routes/auth.route';
import { config } from 'dotenv';
config();
import { sequelize } from './db/models';
import { fileRouter } from './routes/file.route';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';

const app = express();

// Конфигурация сессий
app.use(
  //@ts-ignore
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/files', fileRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use((err: Error, req: Request, res: Response, next) => {
  console.error(err); // Выводим ошибку в консоль

  // Проверяем, если ошибка имеет свойство 'status', иначе возвращаем 500
  const status = (err as any).status || 500;
  const message = (err as any).message || 'Internal Server Error';

  res.status(status).json({ message });
});

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate(); // Проверяем подключение
    app.listen(3000, () => {
      console.log('Server running on port 3000');

      console.log('Server doc is available at http:/localhost:3000/api-docs');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

void start();
