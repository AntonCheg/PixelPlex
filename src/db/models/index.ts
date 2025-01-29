import { Sequelize } from 'sequelize';
import { File, FileStatusEnum } from './file.model';
import { User } from './user.model';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql', // Укажите ваш диалект
  }
);

User.initialize(sequelize);
File.initialize(sequelize);

// Настройка ассоциаций
User.associate();
File.associate();

export { File, FileStatusEnum, sequelize, User };
